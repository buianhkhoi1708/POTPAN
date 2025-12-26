import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import AppText from "./AppText";
import { AppLightColor } from "../styles/color";
import NextIcon from "../assets/images/setting-next.svg";

const ROBOTO_SLAB_BOLD = "RobotoSlab-Bold";

interface SettingItemProps {
  title: string;
  Icon: React.ComponentType<any>;
  showNext?: boolean;
  onPress?: () => void;
}

const AppSettingItem = React.memo(({ title, Icon, showNext, onPress }: SettingItemProps) => (
  <Pressable style={styles.itemRow} onPress={onPress}>
    <View style={styles.leftGroup}>
      <View style={styles.iconCircle}>
        <Icon width={18} height={18} />
      </View>
      <AppText variant="bold" style={styles.itemText}>{title}</AppText>
    </View>
    {showNext && (
      <View style={styles.nextWrap}>
        <NextIcon width={16} height={16} />
      </View>
    )}
  </Pressable>
));

const styles = StyleSheet.create({
  itemRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  leftGroup: { flexDirection: "row", alignItems: "center", columnGap: 14 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppLightColor.primary_color,
  },
  itemText: {
    fontSize: 20,
    fontWeight: "900",
    color: AppLightColor.primary_color,
    fontFamily: ROBOTO_SLAB_BOLD,
  },
  nextWrap: { width: 24, alignItems: "flex-end" },
});

export default AppSettingItem;