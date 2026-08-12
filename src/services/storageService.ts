import { supabase } from '../lib/supabase';

export interface UploadResult {
  success: boolean;
  url: string;
  seoFilename: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  error?: string;
}

/**
 * Generate a Google-SEO friendly filename from the product name
 * E.g., "Sony FX3 Cinema Line!" -> "sony-fx3-cinema-line-1723456789.webp"
 */
export function generateSeoFilename(productName: string, ext = 'webp'): string {
  const cleanName = productName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritical accents
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric chars with dash
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes

  const base = cleanName || 'product-image';
  const timestamp = Date.now().toString().slice(-6);
  return `${base}-${timestamp}.${ext}`;
}

/**
 * Client-side browser image compression & conversion to WebP format
 * - Resizes images over maxWidth (default 1200px)
 * - Converts JPG/PNG/HEIC to optimized .webp
 * - Reduces file size by ~70-90% for ultra-fast page load speed
 */
export function compressAndConvertToWebP(
  file: File,
  maxWidth = 1200,
  quality = 0.82
): Promise<{ blob: Blob; dataUrl: string; originalSizeKb: number; compressedSizeKb: number }> {
  return new Promise((resolve, reject) => {
    const originalSizeKb = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scaling if image exceeds maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Draw and smooth image
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to generate WebP image blob'));
              return;
            }

            const compressedSizeKb = Math.round(blob.size / 1024);
            const dataUrl = canvas.toDataURL('image/webp', quality);

            resolve({
              blob,
              dataUrl,
              originalSizeKb,
              compressedSizeKb
            });
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file from PC'));
    reader.readAsDataURL(file);
  });
}

/**
 * Main function: Compresses image, renames for SEO, and uploads to Supabase Storage CDN
 */
export async function uploadProductImage(
  file: File,
  productName: string
): Promise<UploadResult> {
  const originalSizeKb = Math.round(file.size / 1024);

  try {
    // 1. Compress image to WebP
    const { blob, dataUrl, compressedSizeKb } = await compressAndConvertToWebP(file);
    const seoFilename = generateSeoFilename(productName || file.name.split('.')[0]);

    // 2. Upload to Supabase Storage 'products' bucket
    const storagePath = `products/${seoFilename}`;
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(storagePath, blob, {
        cacheControl: '31536000', // Cache for 1 year on CDN
        upsert: true,
        contentType: 'image/webp'
      });

    if (uploadError) {
      console.warn('Supabase storage upload fallback activated:', uploadError.message);
      // Fallback: Return dataUrl if storage bucket is not configured yet
      return {
        success: true,
        url: dataUrl,
        seoFilename,
        originalSizeKb,
        compressedSizeKb,
        error: `Supabase Storage Notice: ${uploadError.message}. Used local optimized preview.`
      };
    }

    // 3. Obtain Public CDN URL
    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(storagePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      seoFilename,
      originalSizeKb,
      compressedSizeKb
    };
  } catch (err: any) {
    console.error('Image processing error:', err);
    return {
      success: false,
      url: '',
      seoFilename: '',
      originalSizeKb,
      compressedSizeKb: 0,
      error: err?.message || 'Failed to process and upload image'
    };
  }
}
