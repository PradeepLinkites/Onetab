import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";

import Modal from "react-native-modal";

export const TaggingModal = ({
  showModal,
  setShowModal,
  memberData,
  textMessage,
  setTextMessage,
  onDataChanged,
}) => {
  // console.log("data", textMessage);
  const dataArray = Object.keys(memberData).map((mention) => ({
    mention: mention,
    name: memberData[mention],
  }));
  const renderUserItem = (item: any, index: number) => (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: "#bcbcbc",
        paddingVertical: 4,
      }}
    >
      <Text
        style={styles.userItem}
        onPress={() => {
          console.log(
            "[[[[[[[[[[[[[[: ",
            item,
            `<a class=mention_click id=${item.mention} href=_blank target=_blank>@${item.name}</a>`
          );
          const tagUser = `<a class=mention_click id=${item.mention} href=${item.mention} target=_blank>@${item.name}</a>`;
          onDataChanged(tagUser);
          setShowModal(false);
        }}
      >
        {item.name}
      </Text>
    </View>
  );
  return (
    <Modal
      isVisible={showModal}
      testID={"modal"}
      onSwipeComplete={() => {
        setShowModal(false);
      }}
      swipeDirection={["down"]}
      style={[styles.view, {}]}
      hasBackdrop={false}
      animationOut={"slideOutDown"}
      animationOutTiming={500}
      animationInTiming={500}
      animationIn={"slideInUp"}
      // avoidKeyboard
      coverScreen={false}
    >
      <View style={styles.modalContent}>
        <FlatList
          data={dataArray}
          renderItem={({ item, index }) => renderUserItem(item, index)}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={false}
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
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    // maxHeight: 200,
    height: 150,
    // bottom: 10,
    // borderRadius: 10,
  },
  searchInput: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
  },
  userItem: {
    paddingVertical: 3,
    // borderBottomWidth: 1,
    // borderBottomColor: 'red',
  },
});
