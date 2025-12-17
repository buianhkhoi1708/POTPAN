import type { ImageSourcePropType } from "react-native";

export type HomeCategoryKey =
  | "family"
  | "vietnam"
  | "party"
  | "international"
  | "healing"
  | "vegetarian"
  | "snack"
  | "mom_baby";

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
    thumbnail: require("../assets/images/noibat1.png"),
  },
];

export const myRecipes: HomeRecipe[] = [
  {
    id: "mine-1",
    title: "Thịt kho tàu",
    description: "Món quen thuộc trong mâm cơm gia đình.",
    time: "60 phút",
    rating: 5,
    thumbnail: require("../assets/images/thitkhotau.png"),
  },
  {
    id: "mine-2",
    title: "Gà kho gừng",
    description: "Thịt gà thơm, vị gừng ấm.",
    time: "55 phút",
    rating: 5,
    thumbnail: require("../assets/images/gakhorung.png"),
  },
  {
    id: "mine-3",
    title: "Bánh xèo",
    description: "Nước cốt dừa cùng bột bánh xèo",
    time: "25 phút",
    rating: 5,
    thumbnail: require("../assets/images/banhxeotay.png"),
  },
  {
    id: "mine-4",
    title: "Canh chua cá lóc",
    description: "Canh chua cùng cá lóc",
    time: "55 phút",
    rating: 5,
    thumbnail: require("../assets/images/canhchua.png"),
  },
];

export const recentRecipes: HomeRecipe[] = [
  {
    id: "recent-1",
    title: "Thịt kho tàu",
    description: "Món quen thuộc trong mâm cơm gia đình.",
    time: "60 phút",
    rating: 5,
    thumbnail: require("../assets/images/thitkhotau.png"),
  },
  {
    id: "recent-2",
    title: "Gà kho gừng",
    description: "Thịt gà thơm, vị gừng ấm.",
    time: "55 phút",
    rating: 5,
    thumbnail: require("../assets/images/gakhorung.png"),
  },
  {
    id: "recent-3",
    title: "Bánh xèo",
    description: "Nước cốt dừa cùng bột bánh xèo",
    time: "25 phút",
    rating: 5,
    thumbnail: require("../assets/images/banhxeotay.png"),
  },
  {
    id: "recent-4",
    title: "Gà kho gừng",
    description: "Thịt gà thơm, vị gừng ấm.",
    time: "55 phút",
    rating: 5,
    thumbnail: require("../assets/images/gakhorung.png"),
  },
];

export const popularChefs: HomeChef[] = [
  {
    id: "chef-1",
    name: "Đầu bếp 1",
    avatar: require("../assets/images/daubep1.png"),
  },
  {
    id: "chef-2",
    name: "Đầu bếp 2",
    avatar: require("../assets/images/daubep2.png"),
  },
  {
    id: "chef-3",
    name: "Đầu bếp 3",
    avatar: require("../assets/images/daubep3.png"),
  },
  {
    id: "chef-4",
    name: "Đầu bếp 4",
    avatar: require("../assets/images/daubep4.png"),
  },
];