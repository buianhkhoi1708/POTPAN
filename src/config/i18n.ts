import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import các file ngôn ngữ
import vi from "../local/vi.json";
import en from "../local/en.json";
import zh from "../local/zh.json"

const RESOURCES = {
  vi: { translation: vi },
  en: { translation: en },
  zh: { translation: zh },

  // Thêm các ngôn ngữ khác ở đây nếu có file json tương ứng
};

const LANGUAGE_DETECTOR = {
  type: "languageDetector",
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      // Lấy ngôn ngữ đã lưu dưới máy
      const savedLanguage = await AsyncStorage.getItem("user-language");
      // Nếu có thì dùng, không thì mặc định là 'vi'
      callback(savedLanguage || "vi");
    } catch (error) {
      console.log("Lỗi đọc ngôn ngữ", error);
      callback("vi");
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      // Lưu ngôn ngữ người dùng chọn xuống máy
      await AsyncStorage.setItem("user-language", language);
    } catch (error) {}
  },
};

i18n
  .use(LANGUAGE_DETECTOR as any) // Tự động phát hiện và lưu ngôn ngữ
  .use(initReactI18next)
  .init({
    resources: RESOURCES,
    fallbackLng: "en", // Nếu không tìm thấy ngôn ngữ thì dùng tiếng Anh
    interpolation: {
      escapeValue: false,
    },
    react: {
        useSuspense: false // Tắt suspense để tránh lỗi trên Android cũ
    }
  });

export default i18n;