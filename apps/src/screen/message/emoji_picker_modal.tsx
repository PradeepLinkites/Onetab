import React, { Component, useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet
} from "react-native";

import Modal from "react-native-modal";

import EmojiSelector, { Categories } from "react-native-emoji-selector";

export const EmojiModal = ({
  showEmoji,
  setShowEmoji,
  setSelectedEmoji
}) => {
  
  //console.log("I am in emoji1 ",showEmoji)
  //console.log("I am in emoji2 ",setShowEmoji)
  return (
    <Modal
      isVisible={showEmoji}
      testID={"modal"}
      onSwipeComplete={() => {
        setShowEmoji(false);
      }}
      swipeDirection={["down"]}
      style={styles.view}
      backdropOpacity={0}
      onBackdropPress={() => {
        setShowEmoji(false);
      }}
      animationOut={"slideOutDown"}
      animationOutTiming={500}
      animationInTiming={500}
      animationIn={"slideInUp"}
      avoidKeyboard
      coverScreen={false}
    >
      <View style={{
        height:'60%',
        backgroundColor:'#FFFFFF'
      }}>
      <EmojiSelector
            onEmojiSelected={(emoji) => {
              setTimeout(()=>{setSelectedEmoji(emoji)},500)
              setShowEmoji(false);
            }}
            showSearchBar={false}
            columns={9}
            showSectionTitles={false}
            category={Categories.emotion}
          />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#FFFFFF",
  },
  view: {
    width: "100%",
    justifyContent: "flex-end",
    margin: 0,
  },

});
