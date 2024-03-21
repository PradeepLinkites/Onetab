import { split } from "@apollo/client";
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
  mention,
}) => {
  const newArray = Object.keys(memberData).map((mention) => ({
    mention: mention,
    name: memberData[mention],
  }));
  console.log("data====>>>", newArray, mention[0]?.split("@")[1]);
  const dataArray = newArray.filter(
    (item) =>
      item.name
        ?.toLowerCase()
        .includes(mention[0]?.split("@")[1]?.toLowerCase()) &&
      item.name !== "onetabadmin"
  );
  const renderUserItem = (item: any, index: number) => (
    <View
      style={{
        paddingVertical: 6,
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
    // <Modal
    //   isVisible={showModal}
    //   testID={"modal"}
    //   onSwipeComplete={() => {
    //     setShowModal(false);
    //   }}
    //   swipeDirection={["down"]}
    //   style={[styles.view, {}]}
    //   hasBackdrop={false}
    //   animationOut={"slideOutDown"}
    //   animationOutTiming={500}
    //   animationInTiming={500}
    //   animationIn={"slideInUp"}
    //   // avoidKeyboard
    //   coverScreen={false}
    // >
    <React.Fragment>
      {showModal ? (
        <View
          style={[
            {
              width: "100%",
              backgroundColor: "#FAF9F6",
              position: "relative",
              zIndex: 999,
              padding: 10,
              bottom: 0,
            },
          ]}
        >
          <FlatList
            data={dataArray}
            renderItem={({ item, index }) => renderUserItem(item, index)}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    width: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 1,
                    backgroundColor: "black",
                  }}
                />
              );
            }}
          />
        </View>
      ) : null}
    </React.Fragment>
    // </Modal>
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
    fontSize: 16,
    fontWeight: "600",
    // borderBottomWidth: 1,
    // borderBottomColor: 'red',
  },
});
