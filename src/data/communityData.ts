// src/data/communityData.ts

export type CommunityTabKey = "hot" | "new" | "old";

export type CommunityPost = {
  id: string;
  title: string;
  desc: string;
  authorLine: string;
  timeMin: number;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  rating: number;
  image: any;
};

export const COMMUNITY_TABS: { key: CommunityTabKey; label: string }[] = [
  { key: "hot", label: "Nổi bật" },
  { key: "new", label: "Mới nhất" },
  { key: "old", label: "Cũ nhất" },
];

export const COMMUNITY_DATA: Record<CommunityTabKey, CommunityPost[]> = {
  hot: [
    {
      id: "hot-1",
      title: "Bún chả giò",
      desc: "Chả giò được chiên giòn, kết hợp cùng các loại rau...",
      authorLine: "Nấu bởi đầu bếp An Khải",
      timeMin: 20,
      difficulty: "Dễ",
      rating: 5,
      image: require("../assets/images/com-hot1.png"),
    },
    {
      id: "hot-2",
      title: "Thịt kho tàu",
      desc: "Sự kết hợp đậm đà giữa hương vị thịt và trứng...",
      authorLine: "Nấu bởi đầu bếp Nguyễn Thị Nga",
      timeMin: 60,
      difficulty: "Trung bình",
      rating: 5,
      image: require("../assets/images/com-hot2.png"),
    },
    {
      id: "hot-3",
      title: "Bò bía Tam Kỳ",
      desc: "Những sợi bò bía xanh giòn cùng miếng bò khô xé tay...",
      authorLine: "Nấu bởi đầu bếp Trương Ngọc Lan",
      timeMin: 15,
      difficulty: "Trung bình",
      rating: 5,
      image: require("../assets/images/com-hot3.png"),
    },
    {
      id: "hot-4",
      title: "Gà rim nước mắm",
      desc: "Vị mặn mòi của nước mắm, thấm đậm từng miếng gà...",
      authorLine: "Nấu bởi đầu bếp Nguyễn Phương Hằng",
      timeMin: 45,
      difficulty: "Trung bình",
      rating: 5,
      image: require("../assets/images/com-hot4.png"),
    },
  ],

  new: [
    {
      id: "new-1",
      title: "Mì trộn",
      desc: "Mì trộn cùng với các loại đồ ăn kèm như bò viên, chả, rau...",
      authorLine: "Nấu bởi đầu bếp Đỗ Thanh Bình",
      timeMin: 20,
      difficulty: "Dễ",
      rating: 5,
      image: require("../assets/images/com-new1.png"),
    },
    {
      id: "new-2",
      title: "Bánh kẹp",
      desc: "Sự kết hợp đậm đà giữa hương vị mật ong và trứng...",
      authorLine: "Nấu bởi đầu bếp Nguyễn Thị Quý",
      timeMin: 60,
      difficulty: "Trung bình",
      rating: 4,
      image: require("../assets/images/com-new2.png"),
    },
    {
      id: "new-3",
      title: "Hamburger",
      desc: "Một món bánh kẹp nhiều loại đồ ăn như thịt bò, trứng...",
      authorLine: "Nấu bởi đầu bếp Trương Anh Minh",
      timeMin: 40,
      difficulty: "Trung bình",
      rating: 4,
      image: require("../assets/images/com-new3.png"),
    },
    {
      id: "new-4",
      title: "Salad trộn",
      desc: "Sự trộn lẫn của các loại rau lại với nhau",
      authorLine: "Nấu bởi đầu bếp Nguyễn Minh Khang",
      timeMin: 25,
      difficulty: "Dễ",
      rating: 4,
      image: require("../assets/images/com-new4.png"),
    },
  ],

  old: [
    {
      id: "old-1",
      title: "Phở Hà Nội",
      desc: "Nước dùng đậm đà được hầm cùng xương và bánh phở",
      authorLine: "Nấu bởi đầu bếp Nguyễn Anh Long",
      timeMin: 20,
      difficulty: "Dễ",
      rating: 5,
      image: require("../assets/images/com-old1.png"),
    },
    {
      id: "old-2",
      title: "Bánh mì",
      desc: "Vỏ bánh giòn rụm cùng nhiều nguyên liệu được thêm vào",
      authorLine: "Nấu bởi đầu bếp Nguyễn Đỗ Bình",
      timeMin: 10,
      difficulty: "Trung bình",
      rating: 4,
      image: require("../assets/images/com-old2.png"),
    },
    {
      id: "old-3",
      title: "Canh chua cá lóc",
      desc: "Cá lóc được nấu cùng những nguyên liệu tạo nên vị canh...",
      authorLine: "Nấu bởi đầu bếp Trần Phương Trinh",
      timeMin: 30,
      difficulty: "Dễ",
      rating: 5,
      image: require("../assets/images/com-old3.png"),
    },
    {
      id: "old-4",
      title: "Bánh xèo miền tây",
      desc: "Vị mặn mòi của nước mắm cùng với vỏ bánh giòn rụm",
      authorLine: "Nấu bởi đầu bếp Trần Từ Long",
      timeMin: 25,
      difficulty: "Trung bình",
      rating: 4,
      image: require("../assets/images/com-old4.png"),
    },
  ],
};
