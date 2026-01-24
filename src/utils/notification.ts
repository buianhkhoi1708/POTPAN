// Nhóm 9 - IE307.Q12
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    const savedSetting = await AsyncStorage.getItem("SHOW_POPUP_IN_APP");

    const shouldShow = savedSetting === "true" || savedSetting === null;

    return {
      shouldShowAlert: shouldShow,
      shouldPlaySound: shouldShow,
      shouldSetBadge: false,
      shouldShowBanner: shouldShow,
      shouldShowList: shouldShow,
    };
  },
});
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      console.log("Không tìm thấy Project ID trong app.json");
    }

    try {
      const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      token = pushTokenData.data;
      console.log("Token lấy được:", token);
    } catch (e) {
      console.log("Lỗi lấy token:", e);
    }
  } else {
    console.log(
      "Phải chạy trên thiết bị thật (Physical Device) mới có Push Notification"
    );
  }

  return token;
}
