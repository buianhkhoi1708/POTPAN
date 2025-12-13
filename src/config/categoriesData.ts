// src/config/categoriesData.ts  (PNG local)
import type { ImageSourcePropType } from "react-native";

export type CategoryItem = {
  id: string;
  title: string;
  image: ImageSourcePropType;
};

export const categories: CategoryItem[] = [
  { id: "1", title: "Cơm gia đình", image: require("../assets/images/com-gia-dinh.png") },
  { id: "2", title: "Đặc sản Việt", image: require("../assets/categories/dac-san-viet.png") },
  { id: "3", title: "Tiệc lễ", image: require("../assets/categories/tiec-le.png") },
  { id: "4", title: "Món nước ngoài", image: require("../assets/categories/mon-nuoc-ngoai.png") },
  { id: "5", title: "Chữa lành", image: require("../assets/categories/chua-lanh.png") },
  { id: "6", title: "Đồ ăn chay", image: require("../assets/categories/do-an-chay.png") },
  { id: "7", title: "Mới hấp dẫn", image: require("../assets/categories/moi-hap-dan.png") },
  { id: "8", title: "Mẹ bầu và con", image: require("../assets/categories/me-bau-va-con.png") },
];
