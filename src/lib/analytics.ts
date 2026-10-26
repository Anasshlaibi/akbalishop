import { Product } from '../types';
import { getProductPath } from '../utils/seoGenerator';

type EventParams = Record<string, string | number | boolean | object>;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
let initialized = false;

export function initAnalytics() {
  if (!measurementId || initialized) return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false, anonymize_ip: true });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (!measurementId) return;
  initAnalytics();
  window.gtag?.('event', name, params);
}

export function productAnalyticsItem(product: Product, quantity = 1) {
  return {
    item_id: product.id,
    item_name: product.name,
    item_brand: product.brand,
    item_category: product.category,
    item_list_id: getProductPath(product),
    price: product.price,
    quantity
  };
}
