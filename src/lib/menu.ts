// The full menu from content/menu.json, with helpers for each language.
import data from '../../content/menu.json';
import type { Lang } from './i18n';

export type Text = { tr: string; en: string };
export interface MenuItem { id?: string; name: string; tr?: string; en?: string; size?: string; price: string; photo?: string | null }
export interface MenuSection {
  id: string;
  icon: string;
  title: Text;
  items: MenuItem[];
  extras?: { title: Text; items: MenuItem[] };
}
export interface AlcoholMenu { id: string; icon: string; title: Text; groups: { title: Text; items: MenuItem[] }[] }

export const sections = data.sections as MenuSection[];
export const alcohol = data.alcohol as AlcoholMenu;

/** The item's name in a language: its own "tr"/"en" name if set, otherwise the board name. */
export const itemName = (item: MenuItem, lang: Lang) => item[lang] ?? item.name;

/** "₺240", or "₺50 / 80" for two sizes. */
export const formatPrice = (price: string) => `₺${price}`;

/** Text the search box matches against: the names in both languages, without accents. */
export const searchText = (item: MenuItem) =>
  normalize([item.name, item.tr, item.en].filter(Boolean).join(' '));

/** Lower case, Turkish-aware, accents removed (so "turk" finds "Türk", "cay" finds "Çay"). */
export const normalize = (s: string) =>
  s.toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Line icons for the category tiles, headings and photo placeholders (24×24 strokes). */
export const icons: Record<string, string> = {
  coffee: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8.5 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3"/>',
  tea: '<path d="M4 10h13v3a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6zM17 11h1.5a2 2 0 0 1 0 4H17M3 21h16M10.5 10V6.5M10.5 6.5l2-2"/>',
  iced: '<path d="M6 4h12l-1.5 16h-9zM6.5 9h11M9.5 12.5l2 2M13 11.5l1.5 1.5M10 16.5h3"/>',
  soda: '<path d="M7 7h10l-1.3 13H8.3zM12 7l2-4h3M7.5 12h9"/>',
  shake: '<path d="M7 9h10l-1.2 11H8.2zM6 9a6 6 0 0 1 12 0M13 3l-1.5 6"/>',
  wine: '<path d="M8 3h8l-.5 6a3.5 3.5 0 0 1-7 0zM12 12.5V20M8.5 20h7M8.2 7h7.6"/>',
};
