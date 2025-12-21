// src/data/featuredRecipeData.ts
import type { ImageSourcePropType } from "react-native";

export type DifficultyLabel = "Dễ" | "Trung bình" | "Khó";

export type FeaturedHeroRecipe = {
  id: string;
  title: string;
  desc: string;
  timeMin: number;
  rating: number;
  image: ImageSourcePropType;
};

export type FeaturedRecipeItem = {
  id: string;
  title: string;
  desc: string;
  authorLine: string;
  timeMin: number;
  difficulty: DifficultyLabel;
  rating: number;
  image: ImageSourcePropType;
};

export const featuredHeroRecipe: FeaturedHeroRecipe = {
  id: "hot-title",
  title: "Tôm Rim Thịt",
  desc: "Sự kết hợp giữa tôm và thịt tạo ra...",
  timeMin: 30,
  rating: 5,
  image: require("../assets/images/hot-title.png"),
};

export const featuredRecipeList: FeaturedRecipeItem[] = [
  {
    id: "hot1",
    title: "Bún chả giò",
    desc: "Chả giò được chiên giòn, kết hợp cùng các loại rau...",
    authorLine: "Nấu bởi đầu bếp Đỗ An Khải",
    timeMin: 20,
    difficulty: "Dễ",
    rating: 5,
    image: require("../assets/images/hot1.png"),
  },
  {
    id: "hot2",
    title: "Thịt kho tàu",
    desc: "Sự kết hợp đậm đà giữa hương vị thịt và trứng...",
    authorLine: "Nấu bởi đầu bếp Nguyễn Thị Nga",
    timeMin: 60,
    difficulty: "Trung bình",
    rating: 5,
    image: require("../assets/images/hot2.png"),
  },
  {
    id: "hot3",
    title: "Bò bía Tam Kỳ",
    desc: "Những sợi đu đủ xanh giòn cùng miếng bò khô xé tơi cay...",
    authorLine: "Nấu bởi đầu bếp Trương Ngọc Lan",
    timeMin: 60,
    difficulty: "Trung bình",
    rating: 5,
    image: require("../assets/images/hot3.png"),
  },
  {
    id: "hot4",
    title: "Gà rim nước mắm",
    desc: "Vị mặn mòi của nước mắm, thấm đậm từng miếng gà...",
    authorLine: "Nấu bởi đầu bếp Nguyễn Phương Hằng",
    timeMin: 60,
    difficulty: "Trung bình",
    rating: 5,
    image: require("../assets/images/hot4.png"),
  },
  {
    id: "hot5",
    title: "Vịt kho gừng",
    desc: "Vịt được kho với gừng kết hợp với các loại gia vị",
    authorLine: "Nấu bởi đầu bếp Nguyễn Phương Uyên",
    timeMin: 60,
    difficulty: "Trung bình",
    rating: 5,
    image: require("../assets/images/hot5.png"),
  },
  {
    id: "hot6",
    title: "Canh chua cá lóc",
    desc: "Cá lóc được nấu cùng những nguyên liệu tạo nên tô canh...",
    authorLine: "Nấu bởi đầu bếp Trần Phương Thảo",
    timeMin: 30,
    difficulty: "Khó",
    rating: 5,
    image: require("../assets/images/hot6.png"),
  },
  {
    id: "hot7",
    title: "Bò xào ớt chuông",
    desc: "Bò xào kết hợp tạo hương vị độc trưng...",
    authorLine: "Nấu bởi đầu bếp Nguyễn Văn Tiến",
    timeMin: 60,
    difficulty: "Trung bình",
    rating: 5,
    image: require("../assets/images/hot7.png"),
  },
];
