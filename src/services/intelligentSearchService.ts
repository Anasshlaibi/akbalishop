import { Product } from '../types';
import { parseCameraSpecs, ExtractedCameraSpecs } from '../utils/cameraDomainParser';
import { normalizeQuery } from '../utils/queryNormalizer';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SearchResultItem {
  product: Product;
  score: number;
  matchedSpecs: string[];
  matchedReason?: string;
}

export interface AutocompleteResult {
  suggestions: string[];
  categories: { slug: string; name: string }[];
  brands: string[];
  specPills: string[];
  matchedProducts: Product[];
}

export interface SearchAnalyticsItem {
  query: string;
  count: number;
  zeroResults: boolean;
  lastSearchedAt: string;
}

const ANALYTICS_STORAGE_KEY = 'akabli_search_analytics_v1';

class IntelligentSearchService {
  
  /**
   * Main Search function with Tiered Relevance Scoring
   */
  public searchProducts(rawQuery: string, products: Product[]): SearchResultItem[] {
    if (!rawQuery || !rawQuery.trim()) return [];

    const normalized = normalizeQuery(rawQuery);
    const parsedSpecs = parseCameraSpecs(rawQuery);
    const queryTokens = normalized.toLowerCase().split(/\s+/).filter(Boolean);

    const activeProducts = products.filter(p => p.isActive !== false);

    const results: SearchResultItem[] = activeProducts.map(product => {
      let score = 0;
      const matchedSpecs: string[] = [];

      const pNameLower = product.name.toLowerCase();
      const pBrandLower = product.brand.toLowerCase();
      const pCatLower = product.category.toLowerCase();
      const pDescLower = (product.description || '').toLowerCase() + ' ' + (product.shortDescription || '').toLowerCase();
      const pSpecsText = JSON.stringify(product.specs || {}).toLowerCase();

      // Extract specs from product name & specs object
      const productParsedSpecs = parseCameraSpecs(`${product.name} ${product.description || ''} ${JSON.stringify(product.specs || {})}`);

      // 1. EXACT & STRUCTURED SPECIFICATION MATCH (Highest Priority Weight 100)
      if (parsedSpecs.focalLengthMin && parsedSpecs.focalLengthMax) {
        if (productParsedSpecs.focalLengthMin === parsedSpecs.focalLengthMin &&
            productParsedSpecs.focalLengthMax === parsedSpecs.focalLengthMax) {
          score += 100;
          matchedSpecs.push(`Focale ${parsedSpecs.focalLengthMin}-${parsedSpecs.focalLengthMax}mm`);
        }
      } else if (parsedSpecs.focalLengthMin) {
        if (productParsedSpecs.focalLengthMin === parsedSpecs.focalLengthMin ||
            pNameLower.includes(`${parsedSpecs.focalLengthMin}mm`) ||
            pNameLower.includes(`${parsedSpecs.focalLengthMin} mm`)) {
          score += 85;
          matchedSpecs.push(`Focale ${parsedSpecs.focalLengthMin}mm`);
        }
      }

      // 2. APERTURE MATCH (Weight 75)
      if (parsedSpecs.aperture) {
        if (productParsedSpecs.aperture === parsedSpecs.aperture ||
            pNameLower.includes(`f/${parsedSpecs.aperture}`) ||
            pNameLower.includes(`f${parsedSpecs.aperture}`) ||
            pNameLower.includes(`t${parsedSpecs.aperture}`)) {
          score += 75;
          matchedSpecs.push(`Ouverture f/${parsedSpecs.aperture}`);
        }
      }

      // 3. BRAND MATCH (Weight 90)
      if (parsedSpecs.brand) {
        if (pBrandLower === parsedSpecs.brand.toLowerCase() || pNameLower.includes(parsedSpecs.brand.toLowerCase())) {
          score += 90;
          matchedSpecs.push(`Marque ${parsedSpecs.brand}`);
        }
      }

      // 4. MOUNT MATCH (Weight 80)
      if (parsedSpecs.mount) {
        if (pNameLower.includes(parsedSpecs.mount.toLowerCase()) || pSpecsText.includes(parsedSpecs.mount.toLowerCase())) {
          score += 80;
          matchedSpecs.push(`Monture ${parsedSpecs.mount}`);
        }
      }

      // 5. CAMERA MODEL / BATTERY MATCH (Weight 95)
      if (parsedSpecs.cameraModel) {
        if (pNameLower.includes(parsedSpecs.cameraModel.toLowerCase())) {
          score += 95;
          matchedSpecs.push(`Modèle ${parsedSpecs.cameraModel}`);
        }
      }

      if (parsedSpecs.batteryType) {
        if (pNameLower.includes(parsedSpecs.batteryType.toLowerCase()) || pSpecsText.includes(parsedSpecs.batteryType.toLowerCase())) {
          score += 90;
          matchedSpecs.push(`Batterie ${parsedSpecs.batteryType}`);
        }
      }

      // 6. CATEGORY DIRECT MATCH (Weight 60)
      if (parsedSpecs.category && pCatLower.includes(parsedSpecs.category)) {
        score += 60;
      }

      // 7. TITLE FULL & TOKEN MATCH (Weight 50)
      if (pNameLower === normalized.toLowerCase()) {
        score += 150; // Exact match bonus
      } else if (pNameLower.includes(normalized.toLowerCase())) {
        score += 70;
      } else {
        queryTokens.forEach(token => {
          if (token.length > 1 && pNameLower.includes(token)) {
            score += 25;
          }
        });
      }

      // 8. FULL-TEXT DESCRIPTION MATCH (Weight 20)
      queryTokens.forEach(token => {
        if (token.length > 2 && pDescLower.includes(token)) {
          score += 15;
        }
      });

      // 9. INTENT RELEVANCE MATCHING (Weight 40)
      if (parsedSpecs.intent) {
        if (parsedSpecs.intent === 'portrait') {
          if (productParsedSpecs.category === 'objectifs' && (productParsedSpecs.focalLengthMin === 50 || productParsedSpecs.focalLengthMin === 85 || productParsedSpecs.focalLengthMin === 135)) {
            score += 50;
            matchedSpecs.push('Optimisé pour Portrait');
          }
        } else if (parsedSpecs.intent === 'wide') {
          if (productParsedSpecs.category === 'objectifs' && (productParsedSpecs.focalLengthMin && productParsedSpecs.focalLengthMin <= 28)) {
            score += 50;
            matchedSpecs.push('Grand Angle / Paysage');
          }
        } else if (parsedSpecs.intent === 'lowlight') {
          if (productParsedSpecs.aperture && productParsedSpecs.aperture <= 1.8) {
            score += 50;
            matchedSpecs.push('Très Haute Luminosité');
          }
        } else if (parsedSpecs.intent === 'cinema') {
          if (pCatLower === 'cameras' || pNameLower.includes('cinéma') || pNameLower.includes('cinema') || productParsedSpecs.isTStop) {
            score += 50;
            matchedSpecs.push('Gamme Cinéma');
          }
        } else if (parsedSpecs.intent === 'interview') {
          if (pCatLower === 'eclairage' || pCatLower === 'audio' || pNameLower.includes('softbox') || pNameLower.includes('micro')) {
            score += 40;
            matchedSpecs.push('Idéal pour Interview');
          }
        }
      }

      return {
        product,
        score,
        matchedSpecs: Array.from(new Set(matchedSpecs))
      };
    });

    // Filter items with positive score and sort descending
    const filteredResults = results
      .filter(r => r.score > 15)
      .sort((a, b) => b.score - a.score);

    // Track analytics silently
    this.trackSearchQuery(rawQuery, filteredResults.length);

    return filteredResults;
  }

  /**
   * Smart Autocomplete for live search modal
   */
  public getAutocompleteSuggestions(query: string, products: Product[]): AutocompleteResult {
    if (!query || query.trim().length < 1) {
      return { suggestions: [], categories: [], brands: [], specPills: [], matchedProducts: [] };
    }

    const searchResults = this.searchProducts(query, products);
    const parsed = parseCameraSpecs(query);
    const norm = normalizeQuery(query).toLowerCase();

    // Suggested query text completions
    const suggestionsSet = new Set<string>();
    if (parsed.focalLengthMin && parsed.focalLengthMax) {
      suggestionsSet.add(`${parsed.focalLengthMin}-${parsed.focalLengthMax}mm Sony`);
      suggestionsSet.add(`${parsed.focalLengthMin}-${parsed.focalLengthMax}mm Canon`);
      suggestionsSet.add(`${parsed.focalLengthMin}-${parsed.focalLengthMax}mm Nikon`);
    } else if (parsed.focalLengthMin) {
      suggestionsSet.add(`${parsed.focalLengthMin}mm f/1.8`);
      suggestionsSet.add(`${parsed.focalLengthMin}mm f/1.4`);
    } else if (parsed.brand) {
      suggestionsSet.add(`${parsed.brand} Caméra`);
      suggestionsSet.add(`${parsed.brand} Objectif`);
    }

    // Specification Pills
    const specPillsSet = new Set<string>();
    if (parsed.mount) specPillsSet.add(`Monture ${parsed.mount}`);
    if (parsed.focalLengthMin) specPillsSet.add(`Focale ${parsed.focalLengthMin}mm`);
    if (parsed.aperture) specPillsSet.add(`f/${parsed.aperture}`);
    if (parsed.intent) specPillsSet.add(`Usage ${parsed.intent}`);

    // Category matches
    const categoryMatches: { slug: string; name: string }[] = [];
    const catMap: Record<string, string> = {
      'cameras': 'Caméras & Boîtiers',
      'objectifs': 'Objectifs Photo & Cinéma',
      'accessoires': 'Accessoires & Cartes',
      'eclairage': 'Éclairage Studio & LED',
      'audio': 'Microphones & Audio',
      'stabilisateurs': 'Stabilisateurs & Trépieds'
    };

    Object.entries(catMap).forEach(([slug, name]) => {
      if (name.toLowerCase().includes(norm) || slug.toLowerCase().includes(norm)) {
        categoryMatches.push({ slug, name });
      }
    });

    // Brand matches
    const brandMatchesSet = new Set<string>();
    products.forEach(p => {
      if (p.brand.toLowerCase().includes(norm) && !brandMatchesSet.has(p.brand)) {
        brandMatchesSet.add(p.brand);
      }
    });

    return {
      suggestions: Array.from(suggestionsSet).slice(0, 4),
      categories: categoryMatches.slice(0, 3),
      brands: Array.from(brandMatchesSet).slice(0, 4),
      specPills: Array.from(specPillsSet),
      matchedProducts: searchResults.map(r => r.product).slice(0, 6)
    };
  }

  /**
   * Analytics logger for search queries
   */
  public trackSearchQuery(query: string, resultCount: number): void {
    if (!query || query.trim().length < 2) return;
    const cleanQuery = query.trim().toLowerCase();

    try {
      const existingStr = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      let list: SearchAnalyticsItem[] = existingStr ? JSON.parse(existingStr) : [];
      
      const itemIdx = list.findIndex(i => i.query === cleanQuery);
      if (itemIdx >= 0) {
        list[itemIdx].count += 1;
        list[itemIdx].lastSearchedAt = new Date().toISOString();
        list[itemIdx].zeroResults = resultCount === 0;
      } else {
        list.unshift({
          query: cleanQuery,
          count: 1,
          zeroResults: resultCount === 0,
          lastSearchedAt: new Date().toISOString()
        });
      }

      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(list.slice(0, 100)));

      // Sync to Supabase if configured
      if (isSupabaseConfigured && supabase) {
        supabase.from('search_analytics').insert([{
          query: cleanQuery,
          results_count: resultCount,
          created_at: new Date().toISOString()
        }]).then((res: { error: any }) => {
          if (res && res.error) console.debug('Supabase search log debug:', res.error.message);
        });
      }
    } catch (e) {
      // Silent error logging
    }
  }

  public getSearchAnalytics(): { topSearches: SearchAnalyticsItem[]; zeroResults: SearchAnalyticsItem[] } {
    try {
      const existingStr = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      const list: SearchAnalyticsItem[] = existingStr ? JSON.parse(existingStr) : [];
      
      const topSearches = [...list].sort((a, b) => b.count - a.count).slice(0, 10);
      const zeroResults = list.filter(i => i.zeroResults).slice(0, 10);

      return { topSearches, zeroResults };
    } catch {
      return { topSearches: [], zeroResults: [] };
    }
  }
}

export const intelligentSearchService = new IntelligentSearchService();
