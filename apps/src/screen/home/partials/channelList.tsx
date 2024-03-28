import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { styles } from "../styles";

interface ChannelListPropType {
  channelMessageList: any;
  openChannel: any;
  navigation: any;
  dispatch: any;
}
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Hash_Icon } from "../../../assets";
import { RootRoutes } from "../../../navigation/routes";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { createRoom, getChannels } from "../../../../store";
import { useSelector } from "react-redux";
export const ChannelList = (props: ChannelListPropType) => {
  const { channelMessageList, openChannel, navigation, dispatch } = props;
  const [isOpenChannels, setOpenChannels] = React.useState(true);
  const [isCreateChannelmodalVisible, setIsCreateChannelmodalVisible] =
    React.useState(false);
  const [newChannelName, setNewChannelName] = React.useState("");
  const { newChannelData } = useSelector((state: any) => ({
    newChannelData: state.chatStore.newChannelData,
    channelList: state.chatStore,
  }));
  const channelProgress = useSharedValue(1);
  React.useEffect(() => {
    channelProgress.value = withTiming(isOpenChannels ? 1 : 0, {
      duration: 200,
    });
  }, [isOpenChannels]);
  const animatedChannelIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${channelProgress.value * -180}deg` }],
      marginRight: 8,
    };
  });
  const animatedChannnellistStyle = useAnimatedStyle(() => {
    return {
      opacity: channelProgress.value,
      height: 35 * channelProgress.value * (channelMessageList.length + 1),
      paddingLeft: 12,
    };
  });

  const getChannelsDetail = async () => {
    try {
      console.log("createChannelData", newChannelData);
      await dispatch(getChannels());
      setIsCreateChannelmodalVisible(false);
    } catch (error) {}
  };
  useEffect(() => {
    console.log("%%%%%%%%%%%%: ", newChannelData);
    if (newChannelData._id !== undefined) {
      getChannelsDetail();
    }
  }, [newChannelData]);
  const createChannel = async () => {
    try {
      if (newChannelName === "") {
        alert("Channel name can not be Empty");
      } else {
        await dispatch(
          createRoom({
            name: newChannelName,
            is_direct: false,
          })
        );
        setNewChannelName("");
        // dispatch(setNewChannelData({}))
      }
    } catch (error) {
      console.log("Error in creating channel: ", error);
    }
  };
  return (
    <View style={styles.contentViewStyle}>
      <Pressable
        onPress={() => setOpenChannels(!isOpenChannels)}
        style={styles.headerPressableStyle}
      >
        <Text style={styles.headingStyle}>{"Channels"}</Text>
        <Animated.View style={animatedChannelIconStyle}>
          <Ionicons name="chevron-down" size={22} color="black" />
        </Animated.View>
      </Pressable>
      <Animated.View style={animatedChannnellistStyle}>
        {channelMessageList.map((item: any, index: number) => {
          return (
            <Pressable
              key={item.name + index}
              style={[styles.itemContainerStyle, { paddingLeft: 5 }]}
              onPress={() => {
                channelProgress.value === 1 && openChannel(item)
                
              }}
            >
              {/* <Hash_Icon /> */}
              {item.name === "public channel" ? (
                <Image
                  source={require("../../../assets/icons/onetabIcon.png")}
                  style={{ height: 18, width: 20, marginLeft: -5 }}
                />
              ) : (
                <Image
                  source={require("../../../assets/icons/hash.png")}
                  style={styles.image}
                />
              )}

              {/* {item.status === channelStatus.active ? (
              <Octicons name="hash" size={20} color="#656971" />
            ) : (
              <Octicons name="lock" size={20} color="#656971" />
            )} */}
              <Text style={styles.textStyle}>{item.name}</Text>
            </Pressable>
          );
        })}
        <Pressable
          style={styles.addElementContainerStyle}
          onPress={() =>
            channelProgress.value === 1 &&
            // navigation.navigate(RootRoutes.NewChannel)
            setIsCreateChannelmodalVisible(true)
          }
        >
          <Octicons
            name="plus"
            size={20}
            color="#171C26"
            style={{
              paddingHorizontal: 3.5,
              paddingVertical: 2.5,
            }}
          />
          <Text style={styles.textStyle}>Add Channnel</Text>
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCreateChannelmodalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setIsCreateChannelmodalVisible(!isCreateChannelmodalVisible);
          }}
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              {/* <Text style={modalStyles.modalText}>Hello World!</Text>
              <Pressable
                style={[modalStyles.button, modalStyles.buttonClose]}
                onPress={() =>
                  setIsCreateChannelmodalVisible(!isCreateChannelmodalVisible)
                }
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable> */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  Create a channel
                </Text>
                <Text onPress={() => setIsCreateChannelmodalVisible(false)}>
                  Close
                </Text>
              </View>
              <View>
                <Text
                  style={{ paddingVertical: 15, fontSize: 14, color: "grey" }}
                >
                  Channels are where your team communicates. They’re best when
                  organized around a topic — #marketing, for example.
                </Text>
                <Text
                  style={{
                    paddingVertical: 15,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  Name
                </Text>
                <TextInput
                  placeholder="E.g Plan-budget"
                  value={newChannelName}
                  onChangeText={(channelName) => setNewChannelName(channelName)}
                  style={modalStyles.channelNameInput}
                />
                <Text
                  style={{ paddingVertical: 15, fontSize: 14, color: "grey" }}
                >
                  Channels serve as hubs for discussions on specific topics.
                  Choose a name that's easily searchable and clear.
                </Text>
              </View>
              <View style={modalStyles.modalFooter}>
                <TouchableOpacity
                  style={modalStyles.cancelButton}
                  onPress={() => {
                    setIsCreateChannelmodalVisible(false);
                    setNewChannelName("");
                  }}
                >
                  <Text style={{ color: "#000", fontWeight: "bold" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={modalStyles.createButton}
                  onPress={() => {
                    createChannel();
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Create
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </View>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "#00000050",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "88%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#F0F2F4",
  },
  createButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#34785C",
  },
  channelNameInput: {
    fontSize: 16,
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 10,
  },
});
