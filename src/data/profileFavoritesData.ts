// src/data/profileFavoritesData.ts

import type { ImageSourcePropType } from "react-native";

export type ProfileFavoriteItem = {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
  timeMin: number;
  image: ImageSourcePropType;
};

export const profileSavoryFavorites: ProfileFavoriteItem[] = [
  {
    id: "man-1",
    title: "Gà kho gừng",
    subtitle: "Món ngon mỗi ngày",
    rating: 5,
    timeMin: 55,
    image: require("../assets/images/profile-man1.png"),
  },
  {
    id: "man-2",
    title: "Bánh mì",
    subtitle: "Nổi tiếng mọi nơi",
    rating: 5,
    timeMin: 10,
    image: require("../assets/images/profile-man2.png"),
  },
  {
    id: "man-3",
    title: "Bánh xèo",
    subtitle: "Đặc sản vùng miền",
    rating: 5,
    timeMin: 55,
    image: require("../assets/images/profile-man3.png"),
  },
  {
    id: "man-4",
    title: "Canh chua cá lóc",
    subtitle: "Món ăn cho gia đình",
    rating: 4,
    timeMin: 30,
    image: require("../assets/images/profile-man4.png"),
  },
  {
    id: "man-5",
    title: "Thịt kho tàu",
    subtitle: "Đặc sản vùng miền",
    rating: 5,
    timeMin: 60,
    image: require("../assets/images/profile-man5.png"),
  },
  {
    id: "man-6",
    title: "Bánh chả giò",
    subtitle: "Món ăn cho gia đình",
    rating: 4,
    timeMin: 20,
    image: require("../assets/images/profile-man6.png"),
  },
];

export const profileVegetarianFavorites: ProfileFavoriteItem[] = [
  {
    id: "chay-1",
    title: "Tàu hủ kho",
    subtitle: "Món ngon mỗi ngày",
    rating: 5,
    timeMin: 35,
    image: require("../assets/images/profile-chay1.png"),
  },
  {
    id: "chay-2",
    title: "Măng tươi xào",
    subtitle: "Nổi tiếng mọi nơi",
    rating: 5,
    timeMin: 17,
    image: require("../assets/images/profile-chay2.png"),
  },
  {
    id: "chay-3",
    title: "Khổ qua xào",
    subtitle: "Tốt cho sức khoẻ",
    rating: 5,
    timeMin: 20,
    image: require("../assets/images/profile-chay3.png"),
  },
  {
    id: "chay-4",
    title: "Gỏi xoài",
    subtitle: "Món ăn cho gia đình",
    rating: 4,
    timeMin: 17,
    image: require("../assets/images/profile-chay4.png"),
  },
  {
    id: "chay-5",
    title: "Bún xào chay",
    subtitle: "Món ngon mỗi ngày",
    rating: 5,
    timeMin: 15,
    image: require("../assets/images/profile-chay5.png"),
  },
  {
    id: "chay-6",
    title: "Nấm chiên",
    subtitle: "Món ăn cho gia đình",
    rating: 4,
    timeMin: 13,
    image: require("../assets/images/profile-chay6.png"),
  },
];
