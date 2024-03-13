import { Platform, StyleSheet, View } from "react-native";
import React from "react";

export const Divider = () => {
  return <View style={styles.dividerStyle} />;
};

const styles = StyleSheet.create({
  dividerStyle: {
    backgroundColor: "#DEDEDE",
    height: Platform.OS === "ios" ? 1 : 2,
    width: "100%",
  },
});
