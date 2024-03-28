import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "../../components";
import { status } from "../home";
import RenderHtml from "react-native-render-html";
import { useSelector } from "react-redux";
import { MessageOptionModalSaved } from "./message_option_saved";

export const Saved = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { channelData } = useSelector((state: any) => ({
    channelData: state.chatStore.channelData?.data,
  }));

  const channelDataArray = channelData?.data?.channels;
  // console.log("$$$$$$$$$$$: ", channelDataArray);
  const filterMemberData = channelDataArray?.filter(
    (item: any) => item.matrixRoomInfo !== undefined
  );
  const getMemberData = filterMemberData?.map((item: any) => {
    // console.log("^^^^^^^^: ", item.matrixRoomInfo);
    return item.matrixRoomInfo.membersInfo;
  });

  const [value, setValue] = useState<any>();
  const [showOptionModal, setShowOptionModal] = React.useState<boolean>(false);

  const getUniqueKeyValuePairs = (getMemberData: any) => {
    if(getMemberData) {
      const flattenedDict = getMemberData.reduce(
        (accumulator: any, data: any) => {
          if (typeof data === "object" && data !== null) {
            Object.entries(data).forEach(([key, value]) => {
              accumulator[key] = value;
            });
          }
          return accumulator;
        },
        {}
      );
  
      const uniquePairs = {};
      for (const [key, value] of Object.entries(flattenedDict)) {
        uniquePairs[key] = value;
      }
      return uniquePairs;
    } else {
      return {}
    }
  };

  const uniquePairs = getUniqueKeyValuePairs(getMemberData);

  const getValueByKey = (jsonObj: any, key: any) => {
    for (const [jsonKey, value] of Object.entries(jsonObj)) {
      if (jsonKey === key) {
        return value;
      }
    }
    return null; // Return null if the key is not found
  };

  const savedMessage = channelDataArray?.map((channel: any) => {
    const saveMessages = channel?.save_messages?.map((saveMessage: any) => {
      return {
        ...saveMessage,
        channelName: channel.name,
        channelId: channel._id,
      };
    });
    return {
      channelName: channel.name,
      saveMessages: saveMessages,
      channelId: channel._id,
    };
  });

  const filteredSavedMessage = savedMessage?.filter(
    (obj: any) => obj.saveMessages.length > 0
  );

  const savedListArray = filteredSavedMessage.flatMap((channel: any) =>
    channel.saveMessages?.map((message: any, index: number) => ({
      _id: message.event_id,
      mentionBy: getValueByKey(uniquePairs, message.sender),
      channelName: channel.channelName || "",
      userImage: "https://picsum.photos/250", // Assuming you have the path to the user image
      message: message.content.body || "",
      link: message.content.url || "",
      time: message.date,
      status: status.active,
      roomId: message.room_id,
      workspace_id: message?.content?.info?.workspace_id,
      matrixUserId: message?.matrixUserId,
      channel_id: channel?.channelId,
    }))
  );

  const openLink = async (link: any) => {
    const supported = await Linking.canOpenURL(link);

    if (supported) {
      await Linking.openURL(link);
    } else {
      Alert.alert(`Don't know how to open this URL: ${link}`);
    }
  };

  const baseStyles = {
    //fontFamily: "PlusJakartaSans-Medium",
    fontSize: 14,
    color: "#656971",
    marginTop: 5,
  };

  const replaceSubString = (
    mainString: string,
    oldString: string,
    newString: string
  ) => {
    const re = new RegExp(oldString, "g");
    var new_str = mainString.replace(re, newString);
    return new_str;
  };
  const updateText = (text: any) => {
    const aa = replaceSubString(text, "<p", "<div");
    const bb = replaceSubString(aa, "</p>", "</div>");
    return bb;
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const moment = require("moment");

  function formatDateTime(utcTimestamp) {
    // const inputDateTime = moment(input, 'M/D/YYYY, h:mm:ss A');
    // const currentDateTime = moment();

    // const inputWeek = inputDateTime.isoWeek();
    // const currentWeek = currentDateTime.isoWeek();

    // if (inputWeek !== currentWeek) {
    //   return inputDateTime.format('MMM D, YYYY  h:mmA');
    // } else if (inputDateTime.isSame(currentDateTime, 'day')) {
    //   return inputDateTime.fromNow();
    // } else {
    //   return inputDateTime.format('ddd');
    // }

    const date = new Date(utcTimestamp);
    const localDateTimeString = date.toLocaleString();
    return localDateTimeString;
  }

  const renderItem = ({ item, index }) => {
    console.log("renderItem ITEM TIME", item.time);
    return (
      <View key={item._id} style={styles.topView}>
        {/*mention title*/}
        <TouchableOpacity onPress={() => console.log("NAVIGATE")}>
          <Pressable style={styles.titleView}>
            <Text
              style={{
                fontSize: 12,
                //fontFamily: "PlusJakartaSans-Medium",
                color: "#171C26",
              }}
            >
              {"#" + item.channelName}
            </Text>

            <Text
              style={{
                fontSize: 12,
                //fontFamily: "PlusJakartaSans-Regular",
                color: "#656971",
                position: "absolute",
                right: 0,
              }}
            >
              {/* {formatDateTime(item.time)} */}
              {formatDateTime(item.time)}
              {/* {item.time
               === undefined || item.time === ""
                ? ""
                : timeSince(item.time)} */}
            </Text>
          </Pressable>
        </TouchableOpacity>

        {/*mention body*/}
        <View style={styles.bodyView}>
          <View style={styles.imageMainView}>
            <Image
              style={{
                width: 35,
                height: 35,
                borderRadius: 6,
              }}
              source={{ uri: item.userImage }}
              resizeMode="contain"
            />

            <View
              style={[
                styles.status,
                {
                  backgroundColor:
                    item.status === status.active ? "#5BDA15" : "#FF8E29",
                },
              ]}
            ></View>
          </View>
          <TouchableOpacity
            onLongPress={() => {
              setValue(item), setShowOptionModal(true);
            }}
            style={styles.infoView}
          >
            <Text style={styles.mentionedBy}>{item.mentionBy}</Text>

            <RenderHtml
              contentWidth={Dimensions.get("window").width}
              source={{ html: updateText(item.message) }}
            />

            {item.link !== "" && (
              <TouchableOpacity onPress={() => openLink(item.link)}>
                <Text
                  style={{
                    fontSize: 14,
                    //fontFamily: "PlusJakartaSans-Regular",
                    color: "#3C5DB9",
                    marginTop: 5,
                  }}
                  numberOfLines={1}
                >
                  {item.link}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        <Divider />
      </View>
    );
  };

  const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  const CustomHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{ flexDirection: "row", marginTop: "5%" }}
        >
          <Ionicons name="chevron-back" size={27} color="#ffffff" />
          <Text style={styles.headertitle}>Saved</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MyStatusBar backgroundColor="#3866E6" />
      {/* <CustomHeader /> */}
      {savedListArray.length > 0 ? (
        <FlatList
          keyExtractor={(item: any) => item._id}
          data={savedListArray}
          renderItem={({ item, index }) => renderItem({ item, index })}
        />
      ) : (
        <Animated.View style={[styles.noDataView, { opacity: fadeAnim }]}>
          <Image source={require("../../assets/images/no_saved_message.png")} />
          <Text style={styles.noData}>You don’t have any saved messages.</Text>
        </Animated.View>
      )}
      <MessageOptionModalSaved
        showModal={showOptionModal}
        setShowModal={setShowOptionModal}
        workspace_id={value?.workspace_id}
        _id={value?.channel_id}
        matrixRoomId={value?.roomId}
        save_messages={
          channelDataArray.filter(
            (item: any) => item.matrixRoomId === value?.roomId
          )[0]?.save_messages ?? []
        }
        event_Id={value?._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  noData: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  noDataView: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    marginTop: "20%",
  },
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
    height: "8%",
    bottom: "6%",
    backgroundColor: "#3866E6",
    flexDirection: "row",
  },
  headertitle: {
    ////fontFamily: "PlusJakartaSans-Bold",
    fontSize: 20,
    color: "#ffffff",
    marginLeft: 4,
  },
  status: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    position: "absolute",
    bottom: -1,
    right: -6,
    marginRight: 8,
  },
  topView: {
    marginTop: 10,
  },
  titleView: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
  },
  bodyView: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  imageMainView: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  infoView: {
    marginRight: 60,
    marginLeft: "2.5%",
  },
  mentionedBy: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#171C26",
  },
  statusBar: {
    height: StatusBar.currentHeight,
  },
});
