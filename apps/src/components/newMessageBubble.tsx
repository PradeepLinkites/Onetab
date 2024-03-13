import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { NewMessage } from "../assets";

export const NewMessageBubble = ({ setModalIsTrue }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setModalIsTrue(true);
      }}
      style={styles.container}
    >
      <NewMessage />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderColor: "black",
    backgroundColor: "#171C26",
    borderWidth: 1,
    borderRadius: 30,
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
