// src/data/famousChefsData.ts

import { ImageSourcePropType } from "react-native";

import Chef1Img from "../assets/images/chef1.png";
import Chef2Img from "../assets/images/chef2.png";
import Chef3Img from "../assets/images/chef3.png";
import Chef4Img from "../assets/images/chef4.png";
import Chef5Img from "../assets/images/chef5.png";
import Chef6Img from "../assets/images/chef6.png";

export type ChefCard = {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  handle: string;
  followers: number;
};

export const CHEFS: ChefCard[] = [
  {
    id: "chef1",
    name: "Gordan Ramsay",
    avatar: Chef1Img,
    handle: "@Gordon_chef",
    followers: 6687,
  },
  {
    id: "chef2",
    name: "Leslie Gilliams",
    avatar: Chef2Img,
    handle: "@Leslie Gilliams",
    followers: 5687,
  },
  {
    id: "chef3",
    name: "Micheal Ballack",
    avatar: Chef3Img,
    handle: "@ballack36",
    followers: 6687,
  },
  {
    id: "chef4",
    name: "Christine Hà",
    avatar: Chef4Img,
    handle: "@theblindcook",
    followers: 5687,
  },
  {
    id: "chef5",
    name: "Nguyễn Thị Linh",
    avatar: Chef5Img,
    handle: "@linhcute",
    followers: 6687,
  },
  {
    id: "chef6",
    name: "Trần Trung Hiếu",
    avatar: Chef6Img,
    handle: "@hieutran",
    followers: 5687,
  },
];

export const topChefs = CHEFS.slice(0, 2);
export const favoriteChefs = CHEFS.slice(2, 4);
export const newChefs = CHEFS.slice(4);