// Nhóm 9 - IE307.Q12
import React from "react";
import {
  Pressable,
  Image,
  View,
  StyleSheet,
  Platform,
  ViewStyle,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppText from "./AppText";
import { useThemeStore } from "../store/useThemeStore";

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
}

const AppChefCard = ({ item, style }: ChefCardProps) => {
  const navigation = useNavigation<any>();
  const { theme } = useThemeStore();
  const displayName = item.full_name?.split(" ")[0] || "Chef";
  const handlePress = () => {
    navigation.navigate("ChefProfileScreen", {
      chefId: item.id,
      chefName: item.full_name,
      chefAvatar: item.avatar_url,
    });
  };

  return (
    <Pressable style={[styles.container, style]} onPress={handlePress}>
      <View
        style={[
          styles.imageWrap,
          {
            backgroundColor: theme.background_contrast,
            borderColor: theme.border,
          },
        ]}
      >
        <Image
          source={{
            uri: item.avatar_url || `https://i.pravatar.cc/150?u=${item.id}`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <AppText
        variant="bold"
        style={[styles.name, { color: theme.primary_text }]}
        numberOfLines={1}
      >
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
    marginBottom: 6,
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 12,
    textAlign: "center",
    width: "120%",
  },
});
