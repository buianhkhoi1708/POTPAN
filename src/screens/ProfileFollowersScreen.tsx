// src/screens/ProfileFollowersScreen.tsx

import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import FollowToggleButton from "../components/FollowToggleButton";

import BackArrow from "../assets/images/backarrow.svg";

import { AppLightColor } from "../styles/color";
import { PROFILE_USER } from "../data/profileScreenData";
import {
  PROFILE_FOLLOW_STATS,
  profileFollowerUsers,
} from "../data/profileFollowData";

const ProfileFollowersScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [q, setQ] = useState("");
  const [followMap, setFollowMap] = useState<Record<string, boolean>>({});

  const handleText = useMemo(() => {
    const h = (PROFILE_USER as any)?.handle ?? "@KhoiABui";
    return typeof h === "string" ? h : "@KhoiABui";
  }, []);

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return profileFollowerUsers;
    return profileFollowerUsers.filter((u: any) => {
      return u.handle.toLowerCase().includes(k) || u.fullName.toLowerCase().includes(k);
    });
  }, [q]);

  const renderRow = (u: any) => {
    const isFollowing = !!followMap[u.id];

    return (
      <View key={u.id} style={styles.row}>
        <Image source={u.avatar} style={styles.avatar} />

        <View style={styles.rowInfo}>
          <AppText variant="medium" style={styles.handle}>
            {u.handle}
          </AppText>
          <AppText variant="light" style={styles.name}>
            {u.fullName}
          </AppText>
        </View>

        <FollowToggleButton
          value={isFollowing}
          onToggle={() => setFollowMap((p) => ({ ...p, [u.id]: !p[u.id] }))}
          style={{ marginRight: 10 }}
        />

        <Pressable style={styles.removeBtn}>
          <AppText variant="medium" style={styles.removeText}>
            Xóa
          </AppText>
        </Pressable>
      </View>
    );
  };

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backCircle} onPress={() => navigation.navigate("ProfileScreen")}>
            <BackArrow width={18} height={18} />
          </Pressable>

          <View style={styles.headerTitleWrap} pointerEvents="none">
            <AppText variant="bold" style={styles.headerTitle}>
              {handleText}
            </AppText>
          </View>

          <View style={styles.headerRightStub} />
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={styles.tabItem}
            onPress={() => navigation.replace("ProfileFollowingScreen")}
          >
            <AppText variant="medium" style={styles.tabText}>
              {PROFILE_FOLLOW_STATS.followingCount} Lượt theo dõi
            </AppText>
          </Pressable>

          <Pressable style={styles.tabItem}>
            <AppText variant="medium" style={styles.tabTextActive}>
              {PROFILE_FOLLOW_STATS.followersCount} Người theo dõi
            </AppText>
            <View style={styles.tabUnderline} />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Tìm kiếm"
            placeholderTextColor="#777"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {list.map(renderRow)}
        </ScrollView>
      </View>
    </AppSafeView>
  );
};

export default ProfileFollowersScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 44,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "900", color: AppLightColor.primary_color },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppLightColor.primary_color,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRightStub: { width: 32, height: 32 },

  tabs: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    marginTop: 6,
  },
  tabItem: { flex: 1, alignItems: "center" },
  tabTextActive: { fontSize: 12, fontWeight: "800", color: "#111" },
  tabText: { fontSize: 12, fontWeight: "700", color: "#111", opacity: 0.75 },
  tabUnderline: {
    marginTop: 8,
    height: 2,
    width: "72%",
    borderRadius: 99,
    backgroundColor: AppLightColor.primary_color,
  },

  searchWrap: { paddingHorizontal: 20, paddingTop: 6 },
  searchInput: {
    height: 34,
    borderRadius: 999,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 12,
    color: "#111",
  },

  list: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18 },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#ddd" },
  rowInfo: { flex: 1, paddingLeft: 12 },
  handle: { color: AppLightColor.primary_color, fontSize: 12, fontWeight: "800" },
  name: { marginTop: 2, color: "#111", fontSize: 12, opacity: 0.85 },

  removeBtn: {
    height: 28,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: { color: "#fff", fontSize: 12, fontWeight: "800" },
});
