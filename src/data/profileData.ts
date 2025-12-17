// src/data/profileData.ts

import type { ImageSourcePropType } from "react-native";

export type ProfileRecipe = {
  id: string;
  title: string;
  description: string;
  rating: number;
  time: string;
  thumbnail: ImageSourcePropType;
};

export type CollectionCard = {
  id: string;
  title: string;
  image: ImageSourcePropType;
};

export const profileRecipes: ProfileRecipe[] = [
  {
    id: "p-1",
    title: "Gà kho gừng",
    description: "Món ngon mỗi ngày",
    rating: 5,
    time: "55 phút",
    thumbnail: require("../assets/images/man1.png"),
  },
  {
    id: "p-2",
    title: "Bánh mì",
    description: "Nổi tiếng mọi nơi",
    rating: 5,
    time: "10 phút",
    thumbnail: require("../assets/images/man2.png"),
  },
  {
    id: "p-3",
    title: "Bánh xèo",
    description: "Đặc sản",
    rating: 5,
    time: "14 phút",
    thumbnail: require("../assets/images/man3.png"),
  },
  {
    id: "p-4",
    title: "Canh chua cá lóc",
    description: "Đậm đà hương vị",
    rating: 5,
    time: "55 phút",
    thumbnail: require("../assets/images/man4.png"),
  },
];

export const profileCollections: CollectionCard[] = [
  {
    id: "c-1",
    title: "Món mặn",
    image: require("../assets/images/hoso-man.png"),
  },
  {
    id: "c-2",
    title: "Đồ chay",
    image: require("../assets/images/hoso-chay.png"),
  },
];