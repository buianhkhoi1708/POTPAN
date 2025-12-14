import React from "react";
import { View } from "react-native";

const BottomNavSpacer = ({ height = 60 }: { height?: number }) => {
  return <View style={{ height }} />;
};

export default BottomNavSpacer;
