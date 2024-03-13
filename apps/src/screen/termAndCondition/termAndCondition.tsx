import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import WebView from "react-native-webview";

export const TermsAndUseWebVeiw = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={{ width: "100%" }}
        source={{ uri: "https://wynn.io/terms-and-conditions.html" }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});
