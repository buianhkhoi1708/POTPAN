import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Logo from "../../assets/images/Logo2-cropped.svg";
import styles from "../styles/screens/page1-1.styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Page1-1">;

export default function Page1_1({ navigation }: Props) {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.navigate("Page1-2");
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <View style={styles.container}>
      <View >
        <Logo width={292} height={219} />
      </View>
      <Text style={styles.text}>PotPan</Text>
    </View>
  );
}
