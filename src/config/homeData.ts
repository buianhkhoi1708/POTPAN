import type { ImageSourcePropType } from "react-native";

export type HomeCategoryKey =
  | "family"
  | "vietnam"
  | "party"
  | "international"
  | "healing"
  | "vegetarian"
  | "snack"
  | "mom_baby"
  | "kids";

export interface HomeCategory {
  id: HomeCategoryKey;
  label: string;
}

export interface HomeRecipe {
  id: string;
  title: string;
  description: string;
  time: string;
  rating: number;
  thumbnail: ImageSourcePropType;
}

export interface HomeChef {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
}

export const homeCategories: HomeCategory[] = [
  { id: "family", label: "Cơm gia đình" },
  { id: "vietnam", label: "Đặc sản Việt" },
  { id: "party", label: "Tiệc lễ" },
  { id: "international", label: "Món nước ngoài" },
  { id: "healing", label: "Chữa lành" },
  { id: "vegetarian", label: "Đồ ăn chay" },
  { id: "snack", label: "Mồi hấp dẫn" },
  { id: "mom_baby", label: "Mẹ bầu và con" },
  { id: "kids", label: "Cho bé" },
];

// DỮ LIỆU MẪU – chỉ để demo layout, có thể thay toàn bộ hình + text tại đây
const demoImg = require("../assets/images/22bg.png");

export const featuredRecipes: HomeRecipe[] = [
  {
    id: "featured-1",
    title: "Tôm rim thịt",
    description: "Sự kết hợp giữa tôm và thịt tạo ra bữa cơm đậm đà.",
    time: "30 phút",
    rating: 5,
    thumbnail: demoImg,
  },
];

export const myRecipes: HomeRecipe[] = [
  {
    id: "mine-1",
    title: "Thịt kho tàu",
    description: "Món quen thuộc trong mâm cơm gia đình.",
    time: "60 phút",
    rating: 5,
    thumbnail: demoImg,
  },
  {
    id: "mine-2",
    title: "Gà kho gừng",
    description: "Thịt gà thơm, vị gừng ấm.",
    time: "55 phút",
    rating: 5,
    thumbnail: demoImg,
  },
];

export const recentRecipes: HomeRecipe[] = [
  {
    id: "recent-1",
    title: "Ba rọi chiên giòn",
    description: "Lớp da giòn rụm, thịt mềm bên trong.",
    time: "40 phút",
    rating: 5,
    thumbnail: demoImg,
  },
  {
    id: "recent-2",
    title: "Cá kho tộ",
    description: "Đậm vị, ăn kèm cơm trắng.",
    time: "45 phút",
    rating: 5,
    thumbnail: demoImg,
  },
];

export const popularChefs: HomeChef[] = [
  {
    id: "chef-1",
    name: "Đầu bếp 1",
    avatar: demoImg,
  },
  {
    id: "chef-2",
    name: "Đầu bếp 2",
    avatar: demoImg,
  },
  {
    id: "chef-3",
    name: "Đầu bếp 3",
    avatar: demoImg,
  },
  {
    id: "chef-4",
    name: "Đầu bếp 4",
    avatar: demoImg,
  },
];
