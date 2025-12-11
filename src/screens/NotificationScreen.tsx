// src/screens/NotificationScreen.tsx

import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import MainBottomNav, { MainTabKey } from "../components/MainBottomNav";
import { notificationStyles as styles } from "../styles/NotificationScreenStyles";

import BackArrow from "../assets/images/backarrow.svg";
import UpdateIcon from "../assets/images/update.svg";
import WarnIcon from "../assets/images/warn.svg";
import StarNotiIcon from "../assets/images/star-noti.svg";

type NotiType = "update" | "warn" | "star";

interface NotiItem {
  id: string;
  type: NotiType;
  title: string;
  message: string;
  timeLabel: string;
}

const todayList: NotiItem[] = [
  {
    id: "t1",
    type: "update",
    title: "Cập nhật công thức mới",
    message: "Công thức của bạn đã được cập nhật",
    timeLabel: "2 phút trước",
  },
  {
    id: "t2",
    type: "warn",
    title: "Nhắc nhở",
    message: "Tới giờ vào bếp rồi!",
    timeLabel: "12 phút trước",
  },
  {
    id: "t3",
    type: "star",
    title: "Chúc mừng",
    message: "Bạn đã đạt chuỗi 7 ngày nấu ăn!",
    timeLabel: "50 phút trước",
  },
];

const yesterdayList: NotiItem[] = [
  {
    id: "y1",
    type: "update",
    title: "Cập nhật công thức mới",
    message: "Công thức của bạn đã cập nhật thành công",
    timeLabel: "6 giờ trước",
  },
  {
    id: "y2",
    type: "warn",
    title: "Nhắc nhở",
    message: "Sẵn sàng để vào bếp chưa nào",
    timeLabel: "20 giờ trước",
  },
];

const otherDays: { dateLabel: string; items: NotiItem[] }[] = [
  {
    dateLabel: "31/08/2025",
    items: [
      {
        id: "d1",
        type: "warn",
        title: "Nhắc nhở",
        message: "Đừng quên chuẩn bị bữa bạn nhé",
        timeLabel: "1 ngày trước",
      },
    ],
  },
  {
    dateLabel: "30/08/2025",
    items: [
      {
        id: "d2",
        type: "warn",
        title: "Nhắc nhở",
        message: "Tới giờ vào bếp rồi!",
        timeLabel: "2 ngày trước",
      },
    ],
  },
  {
    dateLabel: "29/08/2025",
    items: [
      {
        id: "d3",
        type: "update",
        title: "Cập nhật công thức mới",
        message: "Công thức của bạn đã được cập nhật",
        timeLabel: "3 ngày trước",
      },
      {
        id: "d4",
        type: "star",
        title: "Chúc mừng",
        message: "Công thức của bạn đã được chọn",
        timeLabel: "3 ngày trước",
      },
    ],
  },
  {
    dateLabel: "28/08/2025",
    items: [
      {
        id: "d5",
        type: "warn",
        title: "Nhắc nhở",
        message: "Đừng bỏ lỡ thời khắc phát triển công thức mới",
        timeLabel: "4 ngày trước",
      },
    ],
  },
  {
    dateLabel: "27/08/2025",
    items: [
      {
        id: "d6",
        type: "update",
        title: "Cập nhật công thức mới",
        message: "Công thức của bạn đã được cập nhật",
        timeLabel: "5 ngày trước",
      },
      {
        id: "d7",
        type: "star",
        title: "Chúc mừng",
        message: "Bạn đã trở thành thành viên của cộng đồng công thức",
        timeLabel: "5 ngày trước",
      },
      {
        id: "d8",
        type: "star",
        title: "Nhắc nhở",
        message: "Cập nhật món ăn mới nào",
        timeLabel: "5 ngày trước",
      },
    ],
  },
];

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<MainTabKey>("home");

  const renderIcon = (type: NotiType) => {
    switch (type) {
      case "update":
        return <UpdateIcon width={22} height={22} />;
      case "warn":
        return <WarnIcon width={22} height={22} />;
      case "star":
        return <StarNotiIcon width={22} height={22} />;
      default:
        return null;
    }
  };

  const renderItem = (item: NotiItem) => (
    <View key={item.id} style={styles.itemWrapper}>
      <View style={styles.itemRow}>
        <View style={styles.itemLeft}>
          <View style={styles.iconCircle}>{renderIcon(item.type)}</View>
          <View style={styles.itemTextCol}>
            <AppText variant="medium" style={styles.notiTitle}>
              {item.title}
            </AppText>
            <AppText variant="light" style={styles.notiMessage}>
              {item.message}
            </AppText>
          </View>
        </View>
      </View>
      <AppText variant="light" style={styles.notiTime}>
        {item.timeLabel}
      </AppText>
    </View>
  );

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackArrow width={18} height={18} />
          </Pressable>

          <AppText variant="title" style={styles.headerTitle}>
            Thông báo
          </AppText>

          <View style={styles.headerSpacer} />
        </View>

        {/* BODY */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AppText variant="medium" style={styles.sectionLabel}>
            Hôm nay
          </AppText>
          {todayList.map(renderItem)}

          <AppText variant="medium" style={styles.sectionLabel}>
            Hôm qua
          </AppText>
          {yesterdayList.map(renderItem)}

          {otherDays.map((group) => (
            <View key={group.dateLabel} style={styles.dateGroup}>
              <AppText variant="medium" style={styles.dateLabel}>
                {group.dateLabel}
              </AppText>
              {group.items.map(renderItem)}
            </View>
          ))}
        </ScrollView>

        <MainBottomNav
          activeTab={activeTab}
          onTabPress={(tab) => setActiveTab(tab)}
        />
      </View>
    </AppSafeView>
  );
};

export default NotificationScreen;
