// Nhóm 9 - IE307.Q12
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import vi from "../local/vi.json";
import en from "../local/en.json";
import zh from "../local/zh.json";

const RESOURCES = {
  vi: { translation: vi },
  en: { translation: en },
  zh: { translation: zh },
};

const LANGUAGE_DETECTOR = {
  type: "languageDetector",
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem("user-language");
      callback(savedLanguage || "vi");
    } catch (error) {
      console.log("Lỗi đọc ngôn ngữ", error);
      callback("vi");
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem("user-language", language);
    } catch (error) {}
  },
};

i18n
  .use(LANGUAGE_DETECTOR as any)
  .use(initReactI18next)
  .init({
    resources: RESOURCES,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
