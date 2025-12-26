import React from "react";
import {
  Pressable,
  Image,
  View,
  StyleSheet,
  Platform,
  ViewStyle,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // 1. Import hook navigation
import AppText from "./AppText";

export type Chef = {
  id: any;
  avatar_url: string | null;
  full_name: string;
};

const IMAGE_SIZE = Platform.select({ ios: 80, android: 75 });
const CONTAINER_WIDTH = IMAGE_SIZE;

interface ChefCardProps {
  item: Chef;
  style?: ViewStyle;
  // onPress?: () => void; // Không bắt buộc truyền onPress từ ngoài nữa
}

const AppChefCard = ({ item, style }: ChefCardProps) => {
  const navigation = useNavigation<any>(); // 2. Khởi tạo navigation

  const displayName = item.full_name?.split(" ")[0] || "Chef";

  // 3. Hàm xử lý chuyển trang
  const handlePress = () => {
    navigation.navigate("ChefProfileScreen", {
      chefId: item.id,
      chefName: item.full_name,
      chefAvatar: item.avatar_url,
    });
  };

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={handlePress} // 4. Gắn hàm xử lý vào đây
    >
      <View style={styles.imageWrap}>
        <Image
          source={{
            uri: item.avatar_url || `https://i.pravatar.cc/150?u=${item.id}`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <AppText variant="bold" style={styles.name} numberOfLines={1}>
        {displayName}
      </AppText>
    </Pressable>
  );
};

export default AppChefCard;

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_WIDTH,
    alignItems: "center",
  },
  imageWrap: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: (IMAGE_SIZE || 80) / 2,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    width: "120%",
  },
});