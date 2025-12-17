import React from "react";
import { View } from "react-native";

const AppBottomSpace = ({ height = 60 }: { height?: number }) => {
  return <View style={{ height }} />;
};

export default AppBottomSpace;