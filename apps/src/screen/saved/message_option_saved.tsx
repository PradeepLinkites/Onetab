import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";

import Modal from "react-native-modal";

import { updateChannel } from "../../../store";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

export const MessageOptionModalSaved = ({
  showModal,
  setShowModal,
  workspace_id,
  _id,
  matrixRoomId,
  save_messages,
  event_Id,
}) => {
  const dispatch = useDispatch<Dispatch<any>>();
  return (
    <Modal
      isVisible={showModal}
      testID={"modal"}
      onSwipeComplete={() => {
        setShowModal(false);
      }}
      swipeDirection={["down"]}
      style={styles.view}
      backdropOpacity={0}
      onBackdropPress={() => {
        setShowModal(false);
      }}
      animationOut={"slideOutDown"}
      animationOutTiming={500}
      animationInTiming={500}
      animationIn={"slideInUp"}
      avoidKeyboard
      coverScreen={false}
    >
      <View>
        <View style={styles.headerContainer}>
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 100,
                height: 4,
                backgroundColor: "#3866E6",
                borderRadius: 2,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
          </View>

          <Pressable
            onPress={() => {
              setShowModal(false);
              // setShowEmoji(true);
            }}
            style={styles.menuListItemView}
          >
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Text style={styles.settingItemTitle}>Send Emoji</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              setShowModal(false);
              // setShowEmoji(true);
            }}
            style={styles.menuListItemView}
          >
            <Pressable
              style={{
                alignItems: "center",
              }}
              onPress={() => {
                const NewArray = save_messages.filter(
                  (item: any) => item.event_id !== event_Id
                );
                const input = {
                  workspace_id: workspace_id,
                  _id: _id,
                  matrixRoomId: matrixRoomId,
                  save_messages: NewArray,
                };
                // console.log("Reply", JSON.stringify(input));
                // console.log("Reply", input);
                dispatch(updateChannel(input));
                setShowModal(false);
              }}
            >
              <Text style={styles.settingItemTitle}>Unsave message</Text>
            </Pressable>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    width: "100%",
    justifyContent: "flex-end",
    margin: 0,
  },
  settingItemTitle: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 14,
    ////fontFamily: "PlusJakartaSans-Bold",
    color: "#3866E6",
  },
  settingItemTitleDelete: {
    marginTop: 5,
    fontSize: 14,
    ////fontFamily: "PlusJakartaSans-Bold",
    color: "red",
  },
  headerContainer: {
    width: "100%",
    marginTop: "auto",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.25)",
    borderWidth: 1,
    paddingBottom: 20,
  },
  menuListItemView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
});
