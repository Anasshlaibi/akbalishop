import { Product } from '../types';
import { parseCameraSpecs } from '../utils/cameraDomainParser';

export interface RecommendationSet {
  compatibleWith: Product[];
  recommendedAccessories: Product[];
  frequentlyBoughtTogether: Product[];
  similarProducts: Product[];
  alternatives: Product[];
}

class RecommendationEngine {

  /**
   * Get all smart recommendations for a specific product page
   */
  public getProductRecommendations(product: Product, catalog: Product[]): RecommendationSet {
    const activeCatalog = catalog.filter(p => p.isActive !== false && p.id !== product.id);
    const pSpecs = parseCameraSpecs(`${product.name} ${product.description || ''} ${JSON.stringify(product.specs || {})}`);

    // 1. COMPATIBLE WITH
    const compatibleWith = this.getCompatibleProducts(product, pSpecs, activeCatalog);

    // 2. RECOMMENDED ACCESSORIES
    const recommendedAccessories = this.getRecommendedAccessories(product, pSpecs, activeCatalog);

    // 3. FREQUENTLY BOUGHT TOGETHER
    const frequentlyBoughtTogether = this.getFrequentlyBoughtTogether(product, compatibleWith, recommendedAccessories, activeCatalog);

    // 4. SIMILAR PRODUCTS
    const similarProducts = this.getSimilarProducts(product, pSpecs, activeCatalog);

    // 5. ALTERNATIVES
    const alternatives = this.getAlternativeProducts(product, pSpecs, activeCatalog);

    return {
      compatibleWith: compatibleWith.slice(0, 4),
      recommendedAccessories: recommendedAccessories.slice(0, 4),
      frequentlyBoughtTogether: frequentlyBoughtTogether.slice(0, 3),
      similarProducts: similarProducts.slice(0, 4),
      alternatives: alternatives.slice(0, 4)
    };
  }

  /**
   * Technical Compatibility Matching
   */
  private getCompatibleProducts(product: Product, pSpecs: ReturnType<typeof parseCameraSpecs>, catalog: Product[]): Product[] {
    const results: Product[] = [];
    const pNameLower = product.name.toLowerCase();
    const pCatLower = product.category.toLowerCase();

    catalog.forEach(item => {
      const itemSpecs = parseCameraSpecs(`${item.name} ${item.description || ''} ${JSON.stringify(item.specs || {})}`);
      const iNameLower = item.name.toLowerCase();
      const iCatLower = item.category.toLowerCase();

      // Case A: Product is a Lens -> Recommend Compatible Cameras & Adapters
      if (pCatLower === 'objectifs') {
        if (iCatLower === 'cameras' || iCatLower === 'occasions') {
          if (pSpecs.mount && itemSpecs.mount && pSpecs.mount === itemSpecs.mount) {
            results.push(item);
          } else if (pSpecs.mount === 'Sony E' && (iNameLower.includes('sony') || iNameLower.includes('fx3') || iNameLower.includes('fx6') || iNameLower.includes('a7s'))) {
            results.push(item);
          } else if (pSpecs.mount === 'Nikon Z' && iNameLower.includes('nikon')) {
            results.push(item);
          }
        } else if (iNameLower.includes('adaptateur') || iNameLower.includes('bague')) {
          results.push(item);
        }
      }

      // Case B: Product is a Camera -> Recommend Compatible Lenses & Batteries
      else if (pCatLower === 'cameras' || pCatLower === 'occasions') {
        if (iCatLower === 'objectifs') {
          if (pSpecs.mount && itemSpecs.mount && pSpecs.mount === itemSpecs.mount) {
            results.push(item);
          } else if (pNameLower.includes('sony') && (iNameLower.includes('sony e') || iSpecsTextContains(item, 'sony e'))) {
            results.push(item);
          } else if (pNameLower.includes('nikon') && (iNameLower.includes('nikon z') || iSpecsTextContains(item, 'nikon z'))) {
            results.push(item);
          }
        } else if (iCatLower === 'accessoires' && iNameLower.includes('batterie')) {
          if (pNameLower.includes('sony') && iNameLower.includes('fz100')) results.push(item);
          if (pNameLower.includes('canon') && iNameLower.includes('lp-e6')) results.push(item);
        }
      }

      // Case C: Product is a Filter -> Recommend Lenses with Matching Diameter
      else if (pSpecs.threadDiameter) {
        if (iCatLower === 'objectifs') {
          const itemFilter = iSpecsFilterDiameter(item);
          if (itemFilter === pSpecs.threadDiameter || iNameLower.includes(`${pSpecs.threadDiameter}mm`)) {
            results.push(item);
          }
        }
      }

      // Case D: Product is a Light -> Recommend Softboxes & Batteries
      else if (pCatLower === 'eclairage') {
        if (iNameLower.includes('softbox') || iNameLower.includes('bowens') || (iNameLower.includes('batterie') && iNameLower.includes('f770'))) {
          results.push(item);
        }
      }
    });

    return Array.from(new Set(results));
  }

  /**
   * Recommended Accessories by Domain
   */
  private getRecommendedAccessories(product: Product, pSpecs: ReturnType<typeof parseCameraSpecs>, catalog: Product[]): Product[] {
    const results: Product[] = [];
    const pCatLower = product.category.toLowerCase();

    catalog.forEach(item => {
      const iNameLower = item.name.toLowerCase();
      const iCatLower = item.category.toLowerCase();

      if (pCatLower === 'cameras') {
        // Recommend cards, cleaning, batteries, cables, bags
        if (iNameLower.includes('carte mémoire') || iNameLower.includes('v60') || iNameLower.includes('v30') || iNameLower.includes('sdxc') ||
            iNameLower.includes('nettoyage') || iNameLower.includes('hdmi') || iNameLower.includes('pochette')) {
          results.push(item);
        }
      } else if (pCatLower === 'objectifs') {
        // Recommend ND filters, cleaning kits, rear caps
        if (iNameLower.includes('filtre') || iNameLower.includes('cleaning') || iNameLower.includes('nettoyage') || iNameLower.includes('bouchon')) {
          results.push(item);
        }
      } else if (pCatLower === 'eclairage') {
        // Recommend softboxes, tubes, stands
        if (iNameLower.includes('softbox') || iNameLower.includes('fond') || iNameLower.includes('stand')) {
          results.push(item);
        }
      }
    });

    return results;
  }

  /**
   * Frequently Bought Together Bundle
   */
  private getFrequentlyBoughtTogether(product: Product, compatible: Product[], accessories: Product[], catalog: Product[]): Product[] {
    const bundle: Product[] = [];
    
    // Pick 1 compatible hardware item + 1 recommended accessory
    if (compatible.length > 0) bundle.push(compatible[0]);
    if (accessories.length > 0) {
      const second = accessories.find(a => !bundle.some(b => b.id === a.id));
      if (second) bundle.push(second);
    }

    // Fallback: pick high rating accessories
    if (bundle.length < 2) {
      const topRatedAcc = catalog.filter(p => p.category === 'accessoires' && !bundle.some(b => b.id === p.id))
        .sort((a, b) => b.rating - a.rating);
      if (topRatedAcc.length > 0) bundle.push(topRatedAcc[0]);
    }

    return bundle;
  }

  /**
   * Similar Products (Same category, close specs or brand)
   */
  private getSimilarProducts(product: Product, pSpecs: ReturnType<typeof parseCameraSpecs>, catalog: Product[]): Product[] {
    return catalog.filter(item => {
      if (item.category.toLowerCase() !== product.category.toLowerCase()) return false;
      if (item.brand.toLowerCase() === product.brand.toLowerCase()) return true;
      return Math.abs(item.price - product.price) < (product.price * 0.4);
    }).sort((a, b) => b.rating - a.rating);
  }

  /**
   * Alternative Products (Different brand or higher/lower tier)
   */
  private getAlternativeProducts(product: Product, pSpecs: ReturnType<typeof parseCameraSpecs>, catalog: Product[]): Product[] {
    return catalog.filter(item => {
      if (item.category.toLowerCase() !== product.category.toLowerCase()) return false;
      return item.brand.toLowerCase() !== product.brand.toLowerCase();
    }).sort((a, b) => b.rating - a.rating);
  }

  /**
   * Cart Context Cross-Selling (Evaluates full kit and suggests missing essentials)
   */
  public getCartKitRecommendations(cartItems: { product: Product; quantity: number }[], catalog: Product[]): Product[] {
    if (!cartItems || cartItems.length === 0) return [];

    const cartProductIds = new Set(cartItems.map(i => i.product.id));
    const cartCategories = new Set(cartItems.map(i => i.product.category.toLowerCase()));
    const cartText = cartItems.map(i => i.product.name.toLowerCase() + ' ' + i.product.brand.toLowerCase()).join(' ');

    const hasCamera = cartCategories.has('cameras') || cartCategories.has('occasions');
    const hasLens = cartCategories.has('objectifs');
    const hasMemoryCard = cartText.includes('carte') || cartText.includes('sdxc') || cartText.includes('lexar') || cartText.includes('sandisk');
    const hasExtraBattery = cartText.includes('batterie');
    const hasFilter = cartText.includes('filtre') || cartText.includes('vnd') || cartText.includes('nd');
    const hasMicrophone = cartText.includes('micro') || cartText.includes('audio') || cartText.includes('røde');
    const hasCleaningKit = cartText.includes('nettoyage') || cartText.includes('cleaning');

    const recommendations: Product[] = [];

    catalog.forEach(item => {
      if (cartProductIds.has(item.id) || item.isActive === false) return;

      const iNameLower = item.name.toLowerCase();
      const iCatLower = item.category.toLowerCase();

      // Rule 1: Camera in cart but NO memory card -> Suggest Memory Card
      if (hasCamera && !hasMemoryCard) {
        if (iNameLower.includes('lexar') || iNameLower.includes('v60') || iNameLower.includes('carte mémoire')) {
          recommendations.push(item);
        }
      }

      // Rule 2: Camera in cart but NO extra battery -> Suggest Battery
      if (hasCamera && !hasExtraBattery) {
        if (cartText.includes('sony') && iNameLower.includes('fz100')) recommendations.push(item);
        else if (cartText.includes('canon') && iNameLower.includes('lp-e6')) recommendations.push(item);
        else if (iNameLower.includes('batterie') && iNameLower.includes('sony')) recommendations.push(item);
      }

      // Rule 3: Lens in cart but NO filter -> Suggest ND Filter
      if (hasLens && !hasFilter) {
        if (iNameLower.includes('filtre') || iNameLower.includes('true color') || iNameLower.includes('nano-x')) {
          recommendations.push(item);
        }
      }

      // Rule 4: Camera or Lens in cart but NO cleaning kit -> Suggest Cleaning Kit
      if ((hasCamera || hasLens) && !hasCleaningKit) {
        if (iNameLower.includes('nettoyage') || iNameLower.includes('cleaning')) {
          recommendations.push(item);
        }
      }

      // Rule 5: Camera in cart but NO microphone -> Suggest Mic
      if (hasCamera && !hasMicrophone) {
        if (iCatLower === 'audio' || iNameLower.includes('røde') || iNameLower.includes('micro')) {
          recommendations.push(item);
        }
      }
    });

    return Array.from(new Set(recommendations)).slice(0, 3);
  }
}

function iSpecsTextContains(item: Product, text: string): boolean {
  return JSON.stringify(item.specs || {}).toLowerCase().includes(text.toLowerCase());
}

function iSpecsFilterDiameter(item: Product): number | null {
  const specsStr = JSON.stringify(item.specs || {}).toLowerCase();
  const m = specsStr.match(/\b(52|55|58|62|67|72|77|82|95)\s*mm\b/i);
  return m ? parseInt(m[1], 10) : null;
}

export const recommendationEngine = new RecommendationEngine();
