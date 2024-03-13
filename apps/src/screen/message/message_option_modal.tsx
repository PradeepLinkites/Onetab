import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  Pressable,
  Platform,
} from "react-native";

import Modal from "react-native-modal";
import { RootRoutes } from "../../navigation/routes";
import { updateChannel } from "../../../store";

export const MessageOptionModal = ({
  showModal,
  setShowModal,
  userId,
  event,
  selectEvent,
  navigation,
  isFromThread,
  setShowEmoji,
  setDeleteMessage,
  workspace_id,
  channnel_id,
  timeline,
  dispatch,
  channelData,
}) => {
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
              setShowEmoji(true);
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

          {isFromThread === false && (
            <Pressable
              onPress={() => {
                setShowModal(false);
                navigation.navigate(RootRoutes.MessageThread, {
                  item: JSON.stringify(event),
                });

                selectEvent(undefined);
              }}
              style={styles.menuListItemView}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text style={styles.settingItemTitle}>Reply on thread</Text>
              </View>
            </Pressable>
          )}
          <Pressable
            onPress={() => {
              var NewArray: Array<any> = [];
              if (
                channelData.every(
                  (item: any) => item.event_id !== event?.eventId
                )
              ) {
                const data = {
                  ...JSON.parse(JSON.stringify(timeline[0])),
                  matrixUserId: userId,
                  date: new Date().toLocaleString(),
                };
                NewArray = channelData.concat([data]);
              } else {
                NewArray = channelData.filter(
                  (item: any) => item.event_id !== event?.eventId
                );
                console.log("Reply", JSON.stringify(NewArray));
              }
              const input = {
                workspace_id: workspace_id,
                _id: channnel_id,
                matrixRoomId: event.roomId,
                save_messages: NewArray,
              };
              // console.log("Reply", JSON.stringify(input));
              console.log("Reply", input);
              dispatch(updateChannel(input));
              setShowModal(false);
            }}
            style={styles.menuListItemView}
          >
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Text style={styles.settingItemTitle}>
                {channelData.every(
                  (item: any) => item.event_id !== event?.eventId
                )
                  ? "Save the Message"
                  : "UnSave the Message"}
              </Text>
            </View>
          </Pressable>
          {event !== undefined && userId === event.sender && (
            <Pressable
              onPress={() => {
                setShowModal(false);
                setDeleteMessage(true);
              }}
              style={styles.menuListItemView}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text style={styles.settingItemTitleDelete}>
                  Delete Message
                </Text>
              </View>
            </Pressable>
          )}
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
