import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AnnouncementShowcase: React.FC = React.memo(() => {
  const { slides, setActiveTab, setSelectedProduct } = useShop();
  const announcements = slides
    .filter(slide => slide.type === 'announcement' && slide.isActive !== false)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 2);

  if (announcements.length === 0) return null;

  const openAnnouncement = (productId?: string) => {
    if (productId) {
      setSelectedProduct(productId);
      setActiveTab('product');
      return;
    }
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-5 sm:py-7" aria-label="Annonces AKABLISHOP">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {announcements.map((announcement, index) => (
          <button
            key={announcement.id}
            type="button"
            onClick={() => openAnnouncement(announcement.productId)}
            className={'group relative min-h-[260px] overflow-hidden rounded-3xl bg-slate-900 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-xl sm:min-h-[330px] ' + (index === 0 && announcements.length > 1 ? 'lg:col-span-2' : '')}
            aria-label={announcement.title + ' — ' + (announcement.ctaText || 'Découvrir')}
          >
            <img
              src={announcement.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-8">
              <span className="max-w-xl">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 sm:text-xs">
                  {announcement.badge}
                </span>
                <span className="block text-2xl font-black leading-tight sm:text-3xl">{announcement.title}</span>
                {announcement.subtitle ? (
                  <span className="mt-2 hidden max-w-lg text-sm leading-relaxed text-slate-200 sm:block">{announcement.subtitle}</span>
                ) : null}
              </span>
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white text-slate-950 transition-transform group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
});

AnnouncementShowcase.displayName = 'AnnouncementShowcase';

