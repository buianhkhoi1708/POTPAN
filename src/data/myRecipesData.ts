// src/data/myRecipesData.ts

export type MyHotRecipe = {
  id: string;
  title: string;
  timeMin: number;
  rating: number;
  image: any;
};

export type MyRecipeCard = {
  id: string;
  title: string;
  subtitle: string;
  timeMin: number;
  rating: number;
  image: any;
};

export const myHotToday: MyHotRecipe[] = [
  {
    id: "my-hot1",
    title: "Thịt Kho Tàu",
    timeMin: 30,
    rating: 5,
    image: require("../assets/images/my-hot1.png"),
  },
  {
    id: "my-hot2",
    title: "Gà rim nước mắm",
    timeMin: 25,
    rating: 5,
    image: require("../assets/images/my-hot2.png"),
  },
  {
    id: "my-hot3",
    title: "Canh Chua Cá",
    timeMin: 30,
    rating: 5,
    image: require("../assets/images/my-hot3.png"),
  },
  {
    id: "my-hot4",
    title: "Cá Kho Tộ",
    timeMin: 30,
    rating: 5,
    image: require("../assets/images/my-hot4.png"),
  },
  {
    id: "my-hot5",
    title: "Mực Xào",
    timeMin: 30,
    rating: 5,
    image: require("../assets/images/my-hot5.png"),
  },
];

export const myRecipeCards: MyRecipeCard[] = [
  {
    id: "my-recipe1",
    title: "Phở Hà Nội",
    subtitle: "Món ngon buổi sáng",
    timeMin: 55,
    rating: 5,
    image: require("../assets/images/my-recipe1.png"),
  },
  {
    id: "my-recipe2",
    title: "Bánh mì",
    subtitle: "Nổi tiếng mọi nơi",
    timeMin: 10,
    rating: 5,
    image: require("../assets/images/my-recipe2.png"),
  },
  {
    id: "my-recipe3",
    title: "Bún chả giò",
    subtitle: "Món ăn phổ biến",
    timeMin: 55,
    rating: 5,
    image: require("../assets/images/my-recipe3.png"),
  },
  {
    id: "my-recipe4",
    title: "Bánh xèo",
    subtitle: "Món ăn cho gia đình",
    timeMin: 30,
    rating: 4,
    image: require("../assets/images/my-recipe4.png"),
  },
];
