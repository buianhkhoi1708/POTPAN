// src/screens/ProfileShareQrScreen.tsx
// chỉ cần đổi các hằng số kích thước + qrImage

import React, { useMemo, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppSafeView from "../components/AppSafeView";
import AppText from "../components/AppText";
import AppToast from "../components/AppToast";
import { AppLightColor } from "../styles/color";

import ArrowQrIcon from "../assets/images/arrowQR.svg";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// TO hơn: card rộng hơn, QR box gần full card
const CARD_W = Math.min(SCREEN_W - 28, 420);
const QR_BOX = CARD_W - 28; // gần full card (trừ padding 14*2)

const ProfileShareQrScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const displayName = useMemo(() => "KhoiABui", []);

  return (
    <AppSafeView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backCircle} onPress={() => navigation.goBack()}>
            <ArrowQrIcon width={18} height={18} />
          </Pressable>
        </View>

        <View style={styles.centerWrap}>
          <View style={styles.card}>
            <AppText variant="bold" style={styles.nameText}>
              {displayName}
            </AppText>

            <View style={styles.qrWrap}>
              <Image
                source={require("../assets/images/QR.png")}
                style={styles.qrImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Pressable style={styles.actionPill} onPress={() => showToast("Đã chia sẻ")}>
              <AppText variant="medium" style={styles.actionTextPrimary}>
                Chia Sẻ
              </AppText>
            </Pressable>

            <Pressable style={styles.actionPill} onPress={() => showToast("Đã sao chép")}>
              <AppText variant="medium" style={styles.actionText}>
                Sao Chép
              </AppText>
            </Pressable>

            <Pressable style={styles.actionPill} onPress={() => showToast("Đã tải xuống")}>
              <AppText variant="medium" style={styles.actionText}>
                Tải Xuống
              </AppText>
            </Pressable>
          </View>
        </View>

        <AppToast
          visible={toastVisible}
          message={toastMessage}
          durationMs={2500}
          bottomOffset={Math.max(90, Math.round(SCREEN_H * 0.12))}
          onHide={() => setToastVisible(false)}
        />
      </View>
    </AppSafeView>
  );
};

export default ProfileShareQrScreen;

const styles = StyleSheet.create({
  safeArea: { backgroundColor: AppLightColor.primary_color },
  container: {
    flex: 1,
    backgroundColor: AppLightColor.primary_color,
    paddingHorizontal: 14, // giảm padding để card/QR to hơn
    paddingTop: 8,
  },

  headerRow: {
    height: 44,
    justifyContent: "center",
  },
  backCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },

  card: {
    width: CARD_W,
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 18,
    alignItems: "center",
  },

  nameText: {
    fontSize: 22,
    color: AppLightColor.primary_color,
    fontWeight: "800",
    marginBottom: 12,
  },

  qrWrap: {
    width: QR_BOX,
    height: QR_BOX,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  qrImage: {
    width: "98%",
    height: "98%",
  },

  actionsRow: {
    marginTop: 16,
    width: CARD_W,
    flexDirection: "row",
    columnGap: 12,
    justifyContent: "space-between",
  },
  actionPill: {
    flex: 1,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffd1d0",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  actionTextPrimary: {
    fontSize: 12,
    fontWeight: "700",
    color: AppLightColor.primary_color,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
  },
});
