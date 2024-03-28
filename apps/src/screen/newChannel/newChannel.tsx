import {
  Text,
  StyleSheet,
  View,
  Pressable,
  Platform,
  StatusBar,
  Switch,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
  chatStoreActions,
  createRoom,
  getChannels,
  getRoom,
  getUserColor,
  onInviteUser,
} from "../../../store";
import { NewChannelComponnent } from "./newChannelComponnent";
import { styles } from "./styles";
import { RootRoutes } from "../../navigation/routes";

export const NewChannnel = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [addUser, setAddUser] = useState(true);
  const [createButtonOnOff, setCreateButtonOnOff] = useState<boolean>(false);
  const dispatch = useDispatch<Dispatch<any>>();
  const [selectedPeople, setSelectedPeople] = useState<any>([]);
  const [createChannelId, setCreateChannelId] = useState<any>("");
  const [focus, setFocus] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  useFocusEffect(
    React.useCallback(() => {
      setFocus(true);
      return () => {
        setFocus(false);
      };
    }, [])
  );
  const {
    getInvitesData,
    createChannelData,
    usersColor,
    matrixUserId,
    channelData,
    newChannelData,
  } = useSelector((state: any) => ({
    getInvitesData: state.userStore.getInvitesData,
    createChannelData: state.chatStore.createChannelData,
    usersColor: state.userStore.usersColor,
    matrixUserId: state.userStore.matrixUserId,
    channelData: state.chatStore.channelData,
    newChannelData: state.chatStore.newChannelData,
  }));
  const DataofChannel =
    channelData.data.data.channels[channelData.data.data.channels.length - 1];
  const userList = getInvitesData?.data?.invites ?? [];
  let primeUserList = userList;
  let sortedUserList = primeUserList.filter(
    (item: any) =>
      "@" + item.matrixUsername + ":matrix.onetab.ai" !== matrixUserId
  );
  useEffect(() => {
    if (newChannelData._id !== undefined && focus) {
      // console.log(
      //   "createChannelData",
      //   createChannelData.data.createChannel._id
      // );
      console.log(
        "createChannelData",
        newChannelData._id
      );
      setCreateChannelId(newChannelData._id);
      // setCreateChannelId(createChannelData.data.createChannel._id);
      dispatch(getChannels());
      // setCreateButtonOnOff(false);
      // setAddUser(false);
      // addUserToChannel();
    }
  }, [ newChannelData]);
  useEffect(() => {
    if (DataofChannel._id === createChannelId) {
      console.log(DataofChannel.matrixRoomInfo.members);
      const num = selectedPeople.length + 1;
      if (DataofChannel.matrixRoomInfo.members.length === num) {
        setCreateButtonOnOff(false);
        navigation.goBack();
        // navigation.push(RootRoutes.Channel_Message,{})
      }
    }
  }, [DataofChannel]);
  const createChannel = () => {
    if (searchPhrase === "") {
      alert("Channel name can not be Empty");
    } else {
      setCreateButtonOnOff(true);
      dispatch(
        createRoom({
          name: searchPhrase,
          is_direct: false,
        })
      );
    }
  };
  const addUserToChannel = () => {
    console.log("addUserToChannel", selectedPeople);
    const room_id = createChannelData?.data?.createChannel?.matrixRoomId ?? "";
    const array = sortedUserList.filter((item) =>
      selectedPeople.find((data: any) => data === item._id)
    );
    console.log("addUserToChannel", array);
    dispatch(getRoom({ roomId: room_id }));
    array.map(async (item, index) => {
      await onInviteUser(room_id, item.matrixUsername);
    });
    // navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={{ padding: 2 }}
          >
            <Ionicons name="chevron-back" size={26} color="#171C26" />
          </Pressable>
          <Text style={styles.headertitle}>New Channel</Text>
        </View>
        <Pressable
          style={{ padding: 2 }}
          disabled={createButtonOnOff}
          onPress={() => {
            // addUser ? createChannel() : addUserToChannel();
            createChannel();
          }}
        >
          <Text
            style={{
              color: !createButtonOnOff ? "#3866E6" : "#656971",
              fontSize: 14,
              //fontFamily: "PlusJakartaSans-SemiBold",
            }}
          >
            {/* {addUser ? "Create" : "Add"} */}
            Create
          </Text>
        </Pressable>
      </View>
      <Divider />
      <NewChannelComponnent
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        createButtonOnOff={createButtonOnOff}
        sortedUserList={sortedUserList}
        getUserColor={getUserColor}
        usersColor={usersColor}
        selectedPeople={selectedPeople}
        setSelectedPeople={setSelectedPeople}
      />
      {createButtonOnOff && (
        <View
          style={{
            justifyContent: "center",
            alignSelf: "center",
            position: "absolute",
            alignItems: "center",
            width: "100%",
            height: "100%",
            // backgroundColor: "red",
          }}
        >
          <ActivityIndicator
            size={"large"}
            color={"#007AFF"}
            animating={createButtonOnOff}
            // animating={true}
          />
        </View>
      )}
    </View>
  );
};
