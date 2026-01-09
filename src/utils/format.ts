// Nhóm 9 - IE307.Q12
import { TFunction } from "i18next";

/**
 * Chuyển đổi dữ liệu thời gian từ DB (chuỗi hoặc số) thành chuỗi đã dịch
 * @param rawTime: Giá trị lấy từ database (vd: 30, "45", "15 mins")
 * @param t: Hàm t từ useTranslation
 */
export const formatRecipeTime = (rawTime: string | number | null | undefined, t: TFunction): string => {
  if (rawTime === null || rawTime === undefined || rawTime === "") {
    return t("common.unknown_time", "N/A"); 
  }

  const timeNumber = typeof rawTime === 'number' 
    ? rawTime 
    : parseInt(String(rawTime).replace(/[^0-9]/g, ''), 10);

  if (isNaN(timeNumber)) {
    return String(rawTime);
  }

  return t("recipe.time_format", { count: timeNumber });
};