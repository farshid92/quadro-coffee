import tr from '../../content/tr/site.json';
import en from '../../content/en/site.json';

export type Lang = 'tr' | 'en';
export type Content = typeof tr;

const content: Record<Lang, Content> = { tr, en };

export const getContent = (lang: Lang): Content => content[lang];

/** Path of the home page in a given language. */
export const homePath = (lang: Lang) => (lang === 'tr' ? '/' : '/en/');
