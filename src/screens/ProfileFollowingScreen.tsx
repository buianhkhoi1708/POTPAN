// src/screens/ProfileFollowingScreen.tsx

import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppActionSheet from "../components/AppActionSheet";
import FollowToggleButton from "../components/FollowToggleButton";

import BackArrow from "../assets/images/backarrow.svg";
import SetupIcon from "../assets/images/setup.svg";
import ToggleOnIcon from "../assets/images/button-active.svg";
import ToggleOffIcon from "../assets/images/button-off.svg";

import { AppLightColor } from "../styles/color";
import { PROFILE_USER } from "../data/profileScreenData";
import {
  PROFILE_FOLLOW_STATS,
  profileFollowingUsers,
  type FollowUser,
} from "../data/profileFollowData";

type SheetMode = "actions" | "manage" | "mute" | null;

const ProfileFollowingScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [q, setQ] = useState("");
  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [selected, setSelected] = useState<FollowUser | null>(null);

  const [followMap, setFollowMap] = useState<Record<string, boolean>>({});

  const [notiOn, setNotiOn] = useState(true);
  const [blockOn, setBlockOn] = useState(false);
  const [announceOn, setAnnounceOn] = useState(true);

  const handleText = useMemo(() => {
    const h = (PROFILE_USER as any)?.handle ?? "@KhoiABui";
    return typeof h === "string" ? h : "@KhoiABui";
  }, []);

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return profileFollowingUsers;
    return profileFollowingUsers.filter((u) => {
      return u.handle.toLowerCase().includes(k) || u.fullName.toLowerCase().includes(k);
    });
  }, [q]);

  const openActions = (u: FollowUser) => {
    setSelected(u);
    setSheetMode("actions");
  };

  const closeSheet = () => setSheetMode(null);

  const ToggleIcon = ({ value }: { value: boolean }) => {
    const Icon = value ? ToggleOnIcon : ToggleOffIcon;
    return <Icon width={40} height={22} />;
  };

  const ToggleRow = ({
    label,
    value,
    onToggle,
  }: {
    label: string;
    value: boolean;
    onToggle: () => void;
  }) => {
    return (
      <View style={styles.sheetRow}>
        <AppText variant="bold" style={styles.sheetRowLabel}>
          {label}
        </AppText>
        <Pressable onPress={onToggle} hitSlop={10} style={styles.sheetToggleBtn}>
          <ToggleIcon value={value} />
        </Pressable>
      </View>
    );
  };

  const renderRow = (u: FollowUser) => {
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

        <Pressable style={styles.moreBtn} onPress={() => openActions(u)}>
          <SetupIcon width={18} height={18} />
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
          <Pressable style={styles.tabItem}>
            <AppText variant="medium" style={styles.tabTextActive}>
              {PROFILE_FOLLOW_STATS.followingCount} Lượt theo dõi
            </AppText>
            <View style={styles.tabUnderline} />
          </Pressable>

          <Pressable
            style={styles.tabItem}
            onPress={() => navigation.replace("ProfileFollowersScreen")}
          >
            <AppText variant="medium" style={styles.tabText}>
              {PROFILE_FOLLOW_STATS.followersCount} Người theo dõi
            </AppText>
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

        <AppActionSheet
          visible={sheetMode !== null}
          onClose={closeSheet}
          sheetHeight={sheetMode === "actions" ? 260 : sheetMode === "manage" ? 320 : 260}
        >
          {selected && sheetMode === "actions" && (
            <View>
              <View style={styles.sheetHeader}>
                <Image source={selected.avatar} style={styles.sheetAvatar} />
                <View>
                  <AppText variant="medium" style={styles.sheetHandle}>
                    {selected.handle}
                  </AppText>
                  <AppText variant="light" style={styles.sheetName}>
                    {selected.fullName}
                  </AppText>
                </View>
              </View>

              <Pressable style={styles.sheetItem} onPress={() => setSheetMode("manage")}>
                <AppText variant="medium" style={styles.sheetItemText}>
                  Quản lý thông báo
                </AppText>
              </Pressable>

              <Pressable style={styles.sheetItem} onPress={() => setSheetMode("mute")}>
                <AppText variant="medium" style={styles.sheetItemText}>
                  Tắt thông báo
                </AppText>
              </Pressable>
            </View>
          )}

          {selected && sheetMode === "manage" && (
            <View>
              <View style={styles.sheetHeader}>
                <Image source={selected.avatar} style={styles.sheetAvatar} />
                <View>
                  <AppText variant="medium" style={styles.sheetHandle}>
                    {selected.handle}
                  </AppText>
                  <AppText variant="light" style={styles.sheetName}>
                    {selected.fullName}
                  </AppText>
                </View>
              </View>

              <ToggleRow label="Thông báo" value={notiOn} onToggle={() => setNotiOn((v) => !v)} />
              <ToggleRow label="Chặn acc này" value={blockOn} onToggle={() => setBlockOn((v) => !v)} />

              <Pressable style={styles.sheetItem} onPress={closeSheet}>
                <AppText variant="medium" style={styles.sheetItemText}>
                  Báo cáo
                </AppText>
              </Pressable>
            </View>
          )}

          {selected && sheetMode === "mute" && (
            <View>
              <View style={styles.sheetHeader}>
                <Image source={selected.avatar} style={styles.sheetAvatar} />
                <View>
                  <AppText variant="medium" style={styles.sheetHandle}>
                    {selected.handle}
                  </AppText>
                  <AppText variant="light" style={styles.sheetName}>
                    {selected.fullName}
                  </AppText>
                </View>
              </View>

              <AppText variant="bold" style={styles.muteTitle}>
                Tắt thông báo
              </AppText>

              <ToggleRow label="Công bố" value={announceOn} onToggle={() => setAnnounceOn((v) => !v)} />
            </View>
          )}
        </AppActionSheet>
      </View>
    </AppSafeView>
  );
};

export default ProfileFollowingScreen;

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

  moreBtn: { width: 26, height: 26, alignItems: "center", justifyContent: "center" },

  sheetHeader: { flexDirection: "row", alignItems: "center", paddingBottom: 14 },
  sheetAvatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  sheetHandle: { color: AppLightColor.primary_color, fontSize: 14, fontWeight: "900" },
  sheetName: { marginTop: 3, color: "#111", fontSize: 12, opacity: 0.85 },

  sheetItem: { paddingVertical: 12 },
  sheetItemText: { fontSize: 13, fontWeight: "700", color: "#111" },

  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  sheetRowLabel: { fontSize: 16, fontWeight: "900", color: AppLightColor.primary_color },
  sheetToggleBtn: { width: 46, height: 28, alignItems: "flex-end", justifyContent: "center" },

  muteTitle: { marginTop: 2, marginBottom: 4, fontSize: 18, fontWeight: "900", color: "#111" },
});
