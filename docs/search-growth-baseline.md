# Search visibility and sales measurement baseline

Source: Google Search Console property `https://www.akablishop.ma/`, 13 August-24 October 2026. These are search results, not Google Analytics revenue or order figures.

| Metric | Result |
| --- | ---: |
| Google Search clicks | 149 |
| Impressions | 790 |
| Click-through rate | 18.9% |
| Average position | 10.9 |
| Generative AI search impressions | 72 |
| Indexed pages | 9 |
| Not indexed | 234 |

The homepage accounts for 145 clicks and 710 impressions. Brand queries dominate: `akabli shop` (27 clicks), `akablishop` (24), and `akabli` (5). The clearest non-brand signal is `camera shop marrakech` (6 clicks, 50 impressions). `softbox`/`softbox maroc` and `location matériel audiovisuel` show a little demand but almost no clicks. Contact and boutique pages each have impressions but no clicks in this period. Of the 234 not-indexed pages, 231 are marked "alternative page with proper canonical tag"; many sampled examples are legacy WordPress URLs, so that count is not proof that current catalog pages are broken.

## Changes in this branch

- Crawlable product links with stable `/produits/<slug>/` URLs and matching www canonicals.
- Build-time HTML, product metadata, factual Product schema, and sitemap for the live catalog. Prices, ratings, shipping, and return claims are not frozen into generated pages.
- Distinct, crawlable Marrakech category pages for the stocked product families; existing WordPress URLs redirect to relevant new pages where a matching destination exists.
- Shorter product titles where old editorial titles repeat terms excessively. The confirmed showroom map point is `31.614086,-8.066086`; an exact postal address remains to be verified before adding street-level business markup.
- GA4 `page_view`, `view_item`, `add_to_cart`, `begin_checkout`, and WhatsApp `generate_lead` events. `purchase` is deliberately not emitted: checkout submission does not confirm payment or fulfilment.

## Measurement gap

The signed-in Analytics account exposes three GA4 properties, but their web streams point to `gearshop.ma`, not Akabli Shop. Their traffic and purchase figures must not be used as shop evidence. Set `VITE_GA_MEASUREMENT_ID` to this shop's GA4 web-stream Measurement ID when the correct property is available; then verify events in GA4 DebugView and check that no phone numbers, names, or addresses are sent. Until then, conversion rate, channel revenue, cart abandonment, and return on ad spend cannot be calculated responsibly.

## Next checks after deployment

1. Submit or resubmit the www sitemap in Search Console; inspect a sample of new product URLs for indexing and Product rich-result eligibility.
2. Compare non-brand query clicks, product-page impressions, and AI search impressions over a fresh 28-day period. Search Console has reporting lag, so avoid judging the change the same day.
3. Once GA4 is connected, review `view_item` to `add_to_cart` to `begin_checkout` to confirmed-order rates by device, product, and channel. A WhatsApp lead is not a sale.
4. Validate the highest-demand product titles, descriptions, inventory, and images against the live catalog. Prioritize camera-shop and softbox searches, then build category content supported by real stock and customer questions.
5. Claim or update the Google Business Profile with the verified street address, showroom hours, primary category, current phone, and storefront photos. The map point alone is not a postal address. Check for duplicate old WordPress-era business listings before creating a new one.

No technical change can guarantee first place in Google results. Track Marrakech non-brand queries and product-page conversions over time; improve the pages customers actually find and use.
