import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import { url } from "./helpers/global_helper";
import fallbackEN from "../src/Json/en.json";
import fallbackID from "../src/Json/id.json";

const resources = {
  en: {
    translation: fallbackEN,
  },
  id: {
    translation: fallbackID,
  },
};

const language = localStorage.getItem("I18N_LANGUAGE");
if (!language) {
  localStorage.setItem("I18N_LANGUAGE", "id");
}
let base_url = window.location.origin;
let ext = url.API_PREFIX + url.PLAYER_MS_EXT + url.APPLICATION_EXT + "/listLanguageData?lang=";
if (process.env.REACT_APP_ENABLE_LOCAL_API == 2) {
  ext = url.PLAYER_MS_EXT + url.APPLICATION_EXT + "/listLanguageData?lang=";
}
const backendOptions = {
  loadPath: ((process.env.REACT_APP_ENABLE_LOCAL_API == 1) ? process.env.REACT_APP_API_URL : base_url) + ext + "{{lng}}",
  customHeaders: {
    Authorization: "Bearer " + localStorage.getItem(url.TOKEN_KEY),
    [url.LOBBY_MOB_PERM] : "new_ar_lob_mob_status",
    [url.LOBBY_WEB_PERM] : "new_ar_lob_web_status",
    // ...
  },
  allowMultiLoading: true,
  crossDomain: true,
  requestOptions: {
    mode: "cors",
    credentials: "same-origin",
    cache: "default",
  },
};
i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    backend: backendOptions,
    lng: localStorage.getItem("I18N_LANGUAGE") || "id",
    fallbackLng: "id",
    fallbackNS: "translation",
    ns: ["translation"],
    defaultNS: "translation",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    // resources,
    initImmediate: false,
  }, (err, t) => {
    if (err) {
      i18n.init({
        resources,
        lng: localStorage.getItem("I18N_LANGUAGE") || "id",
        fallbackLng: "id",
        fallbackNS: "translation",
        ns: ["translation"],
        defaultNS: "translation",
        keySeparator: false,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
    }
  });

export default i18n;
