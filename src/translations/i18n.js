import i18n from "i18next/index";
import {initReactI18next} from "react-i18next";
import translationsEN from "./translations-en";
import translationsEE from "./translations-ee";

i18n
  .use(initReactI18next)
  .init({
    lng: "ee",
    debug: false,
    defaultNS: "main",
    fallbackNS: "main",

    resources: {
      en: translationsEN,
      ee: translationsEE
    },

    keySeparator: false, // use keys in form messages.welcome
    interpolation:
      {
        escapeValue: false // react already safes from xss
      }
  });

export default i18n;