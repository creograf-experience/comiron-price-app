import ReactNative from 'react-native';
import i18n from 'i18n-js';
import * as Localization from 'expo-localization';

// Import all locales
import ru from './ru.json';
import en from './en.json';
import zh from './cn.json'


i18n.fallbacks = true;
i18n.missingBehaviour = 'guess';
i18n.locale = Localization.locale;

i18n.translations = {
  ru,
  en,
  zh
};

export const currentLocale = i18n.currentLocale();

export function strings(name, params = {}) {
  return i18n.t(name, params);
};

export default i18n;