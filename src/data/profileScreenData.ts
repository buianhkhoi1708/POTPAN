// src/data/profileScreenData.ts

import { ImageSourcePropType } from "react-native";

export const PROFILE_USER: {
  fullName: string;
  handle: string;
  bio: string;
  avatar: ImageSourcePropType;
  stats: {
    savedRecipes: number;
    following: number;
    followers: number;
  };
} = {
  fullName: "Bùi Anh Khôi",
  handle: "@KhoiABui",
  bio: "Nấu ăn là niềm đam mê to lớn\ncủa tôi",
  avatar: require("../assets/images/avt-profile.png") as ImageSourcePropType,
  stats: {
    savedRecipes: 60,
    following: 120,
    followers: 250,
  },
};