// Facts that are the same in every language. The owner edits them in the content editor (/admin/),
// which saves content/business.json; this file turns them into what the pages need.
import data from '../../content/business.json';
import type { Lang } from './i18n';

const WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
type Day = (typeof WEEK)[number];
interface DayHours { closed: boolean; opens: string; closes: string }
// Each day is written as "07:30-23:00" in the editor, or "Kapalı" (closed); anything unreadable counts as closed
const hours = Object.fromEntries(WEEK.map((day) => {
  const m = String((data.hours as Record<string, string>)[day] ?? '').match(/(\d{1,2})[:.](\d{2})\s*[-–]\s*(\d{1,2})[:.](\d{2})/);
  const hhmm = (h: string, mm: string) => `${h.padStart(2, '0')}:${mm}`;
  return [day, m ? { closed: false, opens: hhmm(m[1], m[2]), closes: hhmm(m[3], m[4]) } : { closed: true, opens: '', closes: '' }];
})) as Record<Day, DayHours>;

/** "0548 889 73 21" → "+905488897321" (Turkish/KKTC numbers written with a leading 0) */
const toIntl = (n: string) => {
  const digits = n.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  if (digits.startsWith('0')) return `+90${digits.slice(1)}`;
  return `+${digits}`;
};

/** Days with the same hours grouped together (closed days left out), as schema.org and the open badge want them */
const openingHours = (() => {
  const groups: { days: string[]; opens: string; closes: string }[] = [];
  for (const day of WEEK) {
    const h = hours[day];
    if (h.closed) continue;
    const name = day[0].toUpperCase() + day.slice(1); // "Monday"
    const same = groups.find((g) => g.opens === h.opens && g.closes === h.closes);
    if (same) same.days.push(name);
    else groups.push({ days: [name], opens: h.opens, closes: h.closes });
  }
  return groups;
})();

export const business = {
  name: data.name,
  phone: toIntl(data.phone),
  phoneDisplay: data.phone,
  // WhatsApp number as wa.me wants it (digits only); empty in the editor means "same as the phone"
  whatsapp: toIntl(data.whatsapp || data.phone).slice(1),
  street: data.address.street,
  district: data.address.district,
  city: data.address.city,
  postalCode: data.address.postalCode,
  geo: data.geo,
  mapsUrl: data.mapsUrl,
  instagram: data.instagram,
  facebook: data.facebook,
  openingHours,
};

/**
 * Opening hours for the contact section: days with the same hours on one row, in week order.
 * One day → its full name ("Pazar"); several → short names ("Pzt, Sal, Per").
 */
export const hoursRows = (lang: Lang, closedLabel: string) => {
  const locale = lang === 'tr' ? 'tr-TR' : 'en-GB';
  // 7 Dec 2026 is a Monday; used only to get the weekday names
  const name = (i: number, weekday: 'long' | 'short') =>
    new Intl.DateTimeFormat(locale, { weekday, timeZone: 'UTC' }).format(Date.UTC(2026, 11, 7 + i));
  const rows: { days: number[]; time: string }[] = [];
  WEEK.forEach((day, i) => {
    const h = hours[day];
    const time = h.closed ? closedLabel : `${h.opens}–${h.closes}`;
    const row = rows.find((r) => r.time === time);
    if (row) row.days.push(i);
    else rows.push({ days: [i], time });
  });
  return rows.map((r) => ({
    days: r.days.length === 1 ? name(r.days[0], 'long') : r.days.map((i) => name(i, 'short')).join(', '),
    time: r.time,
  }));
};
