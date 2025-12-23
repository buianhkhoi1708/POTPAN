// src/data/profileFollowData.ts

export type FollowUser = {
  id: string;
  avatar: any;
  handle: string;
  fullName: string;
};

export const PROFILE_FOLLOW_STATS = {
  followingCount: 120,
  followersCount: 250,
};

export const profileFollowingUsers: FollowUser[] = [
  {
    id: "fo-1",
    avatar: require("../assets/images/follow1.png"),
    handle: "@LeslieGilliams",
    fullName: "Leslie Gilliams",
  },
  {
    id: "fo-2",
    avatar: require("../assets/images/follow2.png"),
    handle: "@Nijigama",
    fullName: "Nijigama Saitama",
  },
  {
    id: "fo-3",
    avatar: require("../assets/images/follow3.png"),
    handle: "@ballack36",
    fullName: "Micheal Ballack",
  },
  {
    id: "fo-4",
    avatar: require("../assets/images/follow4.png"),
    handle: "@cia_food",
    fullName: "Cia Rodriguez",
  },
  {
    id: "fo-5",
    avatar: require("../assets/images/follow5.png"),
    handle: "@hieutran",
    fullName: "Trần Trung Hiếu",
  },
  {
    id: "fo-6",
    avatar: require("../assets/images/follow6.png"),
    handle: "@khoaitravelfood",
    fullName: "Khoai Lang Thang",
  },
];

export const profileFollowerUsers: FollowUser[] = [
  {
    id: "fr-1",
    avatar: require("../assets/images/follower1.png"),
    handle: "@yosuke",
    fullName: "Godai Yosuke",
  },
  {
    id: "fr-2",
    avatar: require("../assets/images/follower2.png"),
    handle: "@hino",
    fullName: "Hino Eji",
  },
  {
    id: "fr-3",
    avatar: require("../assets/images/follower3.png"),
    handle: "@ng_lili",
    fullName: "Nguyễn Tuyết Ly",
  },
  {
    id: "fr-4",
    avatar: require("../assets/images/follower4.png"),
    handle: "@hao_ce",
    fullName: "Trần Cường Hao",
  },
  {
    id: "fr-5",
    avatar: require("../assets/images/follower5.png"),
    handle: "@gudb",
    fullName: "Nigeri Aldof",
  },
  {
    id: "fr-6",
    avatar: require("../assets/images/follower6.png"),
    handle: "@kzari",
    fullName: "Unemiko Kanzari",
  },
  {
    id: "fr-7",
    avatar: require("../assets/images/follower7.png"),
    handle: "@anh_tuyet",
    fullName: "Đặng Ánh tuyết",
  },
  {
    id: "fr-8",
    avatar: require("../assets/images/follower8.png"),
    handle: "@DuongLong_wibu",
    fullName: "Long Hân Dương",
  },
  {
    id: "fr-9",
    avatar: require("../assets/images/follower9.png"),
    handle: "@kanao",
    fullName: "Wakada Kanao",
  },
];
