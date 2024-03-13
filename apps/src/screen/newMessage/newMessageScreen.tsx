import {
  Text,
  StyleSheet,
  View,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
  chatStoreActions,
  createRoom,
  getUserColor,
  resetStatus,
} from "../../../store";
import { NewMessageComponnect } from "./newMessageComponnect";
import { RootRoutes } from "../../navigation/routes";
import { styles } from "./styles";

export const NewMessageScreen = ({
  modalIsTrue,
  setModalIsTrue,
  openDirect,
}) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [loader, setloader] = useState(false);
  const navigation = useNavigation<any>();
  const {
    getInvitesData,
    usersColor,
    channelData,
    matrixUserId,
    createRoomStatus,
  } = useSelector((state: any) => ({
    getInvitesData: state.userStore.getInvitesData,
    matrixUserId: state.userStore.matrixUserId,
    usersColor: state.userStore.usersColor,
    channelData: state.chatStore.channelData,
    createRoomStatus: state.chatStore.createRoomStatus,
  }));
  const dispatch = useDispatch<Dispatch<any>>();
  const userList = getInvitesData?.data?.invites ?? [];

  let primeUserList = userList;
  let sortedUserList = primeUserList.filter(
    (item: any) =>
      "@" + item.matrixUsername + ":matrix.onetab.ai" !== matrixUserId
  );
  const channelsData = channelData?.data?.data ?? [];
  let directMessageSortedData = channelsData?.channels?.filter(
    (item: any) => item?.is_direct === true
  );

  let myDirectChannels = directMessageSortedData?.filter((mychannels: any) => {
    return mychannels?.matrixRoomInfo?.members?.includes(matrixUserId);
  });
  useEffect(() => {
    if (createRoomStatus === "loading") {
      setloader(true);
    }
    if (createRoomStatus === "loaded") {
      setloader(false);
      dispatch(chatStoreActions.setCreateRoomStatus("not loaded"));
      setModalIsTrue(false);
    }
  }, [createRoomStatus]);

  const roomCreateOrNot = async ({ user, matrixId, name }) => {
    let data = myDirectChannels?.filter((mychannels: any) =>
      mychannels?.matrixRoomInfo?.members?.includes(matrixId)
    );
    try {
      if (data.length > 0) {
        setTimeout(() => {
          openDirect(data[0]);
        }, 550);
        setModalIsTrue(false);
        console.log("THIS USER HAVE A DIRECT ROOM ");
      } else {
        console.log("THIS USER DO NOT HAVE A DIRECT ROOM ", user);
        dispatch(
          createRoom({
            name: "direct_chat",
            is_direct: true,
            visibility: true,
            invite: [user],
            preset: "trusted_private_chat",
            topic: "",
            otherUserName: name,
          })
        );
      }
    } catch (error) {
      console.log("roomCreateOrNot Error ", error);
    }
  };
  return (
    <Modal
      isVisible={modalIsTrue}
      swipeDirection={"down"}
      style={styles.container}
      animationOut={"slideOutDown"}
      animationOutTiming={500}
      animationInTiming={500}
      animationIn={"slideInUp"}
      onSwipeComplete={async () => {
        setModalIsTrue(false);
      }}
      swipeThreshold={10}
    >
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => {
            setModalIsTrue(false);
          }}
          style={{ padding: 2 }}
        >
          <Ionicons name="chevron-back" size={26} color="#171C26" />
        </Pressable>
        <Text style={styles.headertitle}>New Message</Text>
      </View>
      <Divider />
      <NewMessageComponnect
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        sortedUserList={sortedUserList}
        getUserColor={getUserColor}
        usersColor={usersColor}
        roomCreateOrNot={roomCreateOrNot}
        loader={loader}
      />
    </Modal>
  );
};
