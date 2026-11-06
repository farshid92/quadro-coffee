// Evening programme (match screenings and live music) from content/events.json.
// Used at build time by Evenings.astro and again in the browser, so "tonight", "next" and the
// countdown stay right between rebuilds. All dates and times are Lefkoşa local time.
import data from '../../content/events.json';
import type { Lang } from './i18n';

const TZ = 'Asia/Nicosia';
const HOUR = 36e5;
const MATCH_LENGTH = 2 * HOUR; // a match stays "live" for this long after kick-off
const MUSIC_LENGTH = 3 * HOUR; // a music night stays "on stage" for this long

export type Text = { tr: string; en: string };
export interface Match { date: string; time: string; home: string; away: string; league: string; tag?: Text; photo?: string | null }
export interface Music { date: string; time: string; name: Text; text: Text; photo?: string | null }

const byDate = <T extends { date: string; time: string }>(a: T, b: T) => (a.date + a.time).localeCompare(b.date + b.time);
export const matches = ([...data.matches] as Match[]).sort(byDate);
export const music = ([...data.music] as Music[]).sort(byDate);
export const matchPhoto = data.matchPhoto as string | null;
export const musicPhoto = data.musicPhoto as string | null;

// ---- Club colours for the little crest circles (no logos: those are the clubs' trademarks) ----
const clubs: Record<string, { colors: [string, string]; stripes?: boolean }> = {
  'Galatasaray': { colors: ['#A90432', '#FDB912'] },
  'Beşiktaş': { colors: ['#111111', '#EEEEEE'], stripes: true },
  'Fenerbahçe': { colors: ['#0B2A5B', '#FFE600'], stripes: true },
  'Trabzonspor': { colors: ['#6C1D45', '#5FB4E5'], stripes: true },
  'Samsunspor': { colors: ['#D81E2C', '#FFFFFF'] },
  'Başakşehir': { colors: ['#F26522', '#0E2D5E'] },
};
export const crest = (team: string) => {
  const c = clubs[team];
  if (!c) return 'var(--color-copper)';
  const [a, b] = c.colors;
  return c.stripes ? `repeating-linear-gradient(90deg, ${a} 0 7px, ${b} 7px 14px)` : `linear-gradient(90deg, ${a} 50%, ${b} 50%)`;
};

// ---- Time helpers ----
/** Lefkoşa's UTC offset in minutes at a moment (it changes with summer time). */
const offsetMinutes = (ms: number) => {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'longOffset' })
    .formatToParts(ms).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+02:00';
  const m = name.match(/([+-])(\d{2}):?(\d{2})?/);
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0)) : 0;
};
/** Moment (ms) of a Lefkoşa date and time like "2026-11-07", "20:00". */
export const startOf = (date: string, time: string) => {
  const asUtc = Date.parse(`${date}T${time}:00Z`);
  return asUtc - offsetMinutes(asUtc) * 60000;
};
/** Lefkoşa date as YYYY-MM-DD. */
export const dayOf = (ms: number) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(ms);
const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);

// ---- Date wording ----
const fmt = (lang: Lang, iso: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { timeZone: 'UTC', ...o }).format(Date.parse(`${iso}T12:00:00Z`));
/** "Cumartesi 7 Kasım" / "Saturday 7 November" */
export const longDate = (lang: Lang, iso: string) =>
  `${fmt(lang, iso, { weekday: 'long' })} ${Number(iso.slice(8))} ${fmt(lang, iso, { month: 'long' })}`;
/** "Cmt 7" / "Sat 7" */
export const shortDate = (lang: Lang, iso: string) => `${fmt(lang, iso, { weekday: 'short' })} ${Number(iso.slice(8))}`;
export const monthName = (lang: Lang, ym: string) => fmt(lang, `${ym}-01`, { month: 'long' });
export const weekdayNames = (lang: Lang) =>
  [0, 1, 2, 3, 4, 5, 6].map((i) => fmt(lang, addDays('2026-11-02', i), { weekday: 'short' })); // 2 Nov 2026 is a Monday

// ---- Months shown in the calendar strip: every month that has an event ----
export interface Day { iso: string; day: number; weekday: number; matches: Match[]; music: Music[] }
export const months = (() => {
  const yms = [...new Set([...matches, ...music].map((e) => e.date.slice(0, 7)))].sort();
  return yms.map((ym) => {
    const count = new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5)), 0)).getUTCDate();
    const days: Day[] = Array.from({ length: count }, (_, i) => {
      const iso = `${ym}-${String(i + 1).padStart(2, '0')}`;
      return {
        iso,
        day: i + 1,
        weekday: (new Date(`${iso}T12:00:00Z`).getUTCDay() + 6) % 7, // Monday = 0
        matches: matches.filter((m) => m.date === iso),
        music: music.filter((m) => m.date === iso),
      };
    });
    return { ym, days };
  });
})();

// ---- What to feature right now ----
export type MusicWhen = 'live' | 'tonight' | 'tomorrow' | 'next';
export interface Pick {
  today: string;
  match: number;          // index into `matches`, -1 when none is left
  matchLive: boolean;
  matchStart: number;
  music: number;          // index into `music`, -1 when none is left
  musicWhen: MusicWhen;
  month: string;          // YYYY-MM shown in the strip
}
export const pick = (now: number): Pick => {
  const today = dayOf(now);
  const m = matches.findIndex((e) => now < startOf(e.date, e.time) + MATCH_LENGTH);
  const matchStart = m < 0 ? 0 : startOf(matches[m].date, matches[m].time);
  const s = music.findIndex((e) => now < startOf(e.date, e.time) + MUSIC_LENGTH);
  let musicWhen: MusicWhen = 'next';
  if (s >= 0) {
    const e = music[s];
    if (now >= startOf(e.date, e.time)) musicWhen = 'live';
    else if (e.date === today) musicWhen = 'tonight';
    else if (e.date === addDays(today, 1)) musicWhen = 'tomorrow';
  }
  // The strip shows this month while it still has events ahead, otherwise the month of the next event
  const ym = today.slice(0, 7);
  const next = [m >= 0 ? matches[m].date : '', s >= 0 ? music[s].date : ''].filter(Boolean).sort()[0];
  const current = months.find((x) => x.ym === ym);
  const hasAhead = current?.days.some((d) => d.iso >= today && (d.matches.length || d.music.length));
  const month = hasAhead ? ym : next ? next.slice(0, 7) : current ? ym : (months.at(-1)?.ym ?? ym);
  return { today, match: m, matchLive: m >= 0 && now >= matchStart, matchStart, music: s, musicWhen, month };
};
