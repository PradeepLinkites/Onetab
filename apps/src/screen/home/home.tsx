import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, Image } from "react-native";
import {
  AddMemberModal,
  Divider,
  NewMessageBubble,
  SearchBar,
} from "../../components";

import { Icon_Saved, Icon_Mention, Icon_Thread } from "../../assets/svg";
import { BottomRoutes, RootRoutes } from "../../navigation/routes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
  fetchAllMessages,
  getCircularReplacer,
  resetStatus,
  resetThreadStatus,
  userStoreActions,
} from "../../../store";
import { styles } from "./styles";
import { NewMessageScreen } from "../newMessage";
import { AppList, ChannelList, DirectList, UnReadList } from "./partials";

export enum status {
  active = "active",
  inActive = "inActive",
}
export enum channelStatus {
  active = "active",
  locked = "locked",
}

interface appData {
  id: string;
  name: string;
  status: status;
}

const appData: appData[] = [
  {
    id: "#98",
    name: "Trello",
    status: status.active,
  },
  {
    id: "#56",
    name: "Jira",
    status: status.inActive,
  },
];

var roomArray: any = [];
export const Home = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<Dispatch<any>>();
  const [clicked, setClicked] = React.useState(false);
  const [modalIsTrue, setModalIsTrue] = React.useState<boolean>(false);
  const [searchPhrase, setSearchPhrase] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [isInvited, setIsInvited] = React.useState(false);
  const [unreadMessageList, setUnreadMessageList] = React.useState<any>([]);
  const [channelMessageList, setChannelMessageList] = React.useState<any>([]);
  const [directMessageList, setDirectMessageList] = React.useState<any>([]);
  const [updateWorkSpace, setUpdateWorkSpace] = React.useState<boolean>(true);
  const [selectedItem, setSelectedItem] = React.useState<any>();
  const [isDirsct, setIsDirect] = React.useState<boolean>(false);
  const [focus, setFocus] = React.useState(false);
  const [loader, setloader] = useState(false);
  const [member, setMember] = React.useState("");
  const {
    getUserData,
    channelData,
    updateUserStatus,
    resetStatusKey,
    matrixUserId,
    createInvitesData,
    createInvitesStatus,
    error,
  } = useSelector((state: any) => ({
    channelData: state.chatStore.channelData,
    updateUserStatus: state.userStore.updateUserStatus,
    getUserData: state.userStore.getUserData,
    resetStatusKey: state.chatStore.resetStatusKey,
    matrixUserId: state.userStore.matrixUserId,
    createInvitesData: state.userStore.createInvitesData,
    createInvitesStatus: state.userStore.createInvitesStatus,
    error: state.userStore.error,
  }));
  useFocusEffect(
    React.useCallback(() => {
      setFocus(true);
      return () => {
        setFocus(false);
      };
    }, [])
  );

  useEffect(() => {
    if (updateWorkSpace === true) {
      if (
        channelData.data !== undefined &&
        channelData.data.data !== undefined
      ) {
        const channelListing = channelData.data.data.channels;
        let myDirectChannels = channelListing?.filter((mychannels: any) => {
          return mychannels?.matrixRoomInfo?.members?.includes(matrixUserId);
        });

        var unreadDirect: any = [];
        var msgDirect: any = [];
        var msgChannel: any = [];
        myDirectChannels.map((item: any) => {
          if (item.is_direct) {
            roomArray.push(item.matrixRoomId);
            if (item.matrixRoomEvent !== null) {
              if (item.matrixRoomEvent.notificationCounts.total > 0) {
                unreadDirect.push(item);
              } else {
                msgDirect.push(item);
              }
            }
          } else {
            msgChannel.push(item);
          }
        });
        dispatch(fetchAllMessages(roomArray));
        setTimeout(() => {
          setUnreadMessageList(unreadDirect);
        }, 100);
        setDirectMessageList(msgDirect);
        setChannelMessageList(msgChannel);
      }
    }
  }, [channelData]);

  useEffect(() => {
    if (updateUserStatus === "not loaded" || updateUserStatus === "loaded") {
      setUpdateWorkSpace(true);
    } else if (updateUserStatus === "loading") {
      setUnreadMessageList([]);
      setDirectMessageList([]);
      setChannelMessageList([]);
      setUpdateWorkSpace(false);
    }
  }, [updateUserStatus]);
  useEffect(() => {
    if (createInvitesStatus === "loading") {
      setloader(true);
    }
    if (createInvitesStatus === "loaded") {
      setloader(false);
      if (createInvitesData.data !== undefined) {
        setIsInvited(true);
        setTimeout(() => {
          setIsVisible(false);
          setIsInvited(false);
          setMember("");
        }, 5000);
      }
    }
    if (createInvitesStatus === "error") {
      Alert.alert("Invite Failed", error, [
        {
          text: "Okay",
          onPress: () => {
            setloader(false);
            dispatch(userStoreActions.setCreateInvitesStatus("not loaded"));
            setIsVisible(false);
            setMember("");
          },
        },
      ]);
    }
  }, [createInvitesStatus]);

  const toggle = () => {
    setIsVisible(!isVisible);
  };

  const openChannel = (item: any) => {
    setIsDirect(false);
    setSelectedItem(item);
    dispatch(resetStatus({}));
  };

  const openDirect = (item: any) => {
    setIsDirect(true);
    setSelectedItem(item);
    dispatch(resetStatus({}));
  };

  useEffect(() => {
    console.log("home 4 ", resetStatusKey);
    if (
      resetStatusKey === "loaded" &&
      selectedItem !== undefined &&
      focus === true
    ) {
      if (isDirsct === true) {
        navigation.navigate(RootRoutes.Message, {
          item: JSON.stringify(selectedItem ?? {}, getCircularReplacer()) ?? "",
        });
      } else {
        navigation.navigate(RootRoutes.Channel_Message, {
          item: JSON.stringify(selectedItem ?? {}, getCircularReplacer()) ?? "",
        });
      }
    }
  }, [resetStatusKey]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollStyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentViewStyle}>
          <SearchBar
            clicked={clicked}
            setClicked={setClicked}
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            navigation={navigation}
          />
          <View style={styles.segementView}>
            {/* <Pressable
              style={styles.pressableText}
              onPress={() => navigation.navigate(BottomRoutes.Mentions)}
            >
              <Icon_Mention />
              <Text style={[styles.textStyle, { fontSize: 15 }]}>Mentions</Text>
            </Pressable> */}
            {/* <Pressable
              style={styles.pressableText}
              onPress={() => {
                dispatch(resetThreadStatus({}));
                navigation.navigate(RootRoutes.Thread);
              }}
            >
              <Icon_Thread />
              <Text style={[styles.textStyle, { fontSize: 15 }]}>Threads</Text>
            </Pressable> */}
            <Pressable
              style={styles.pressableText}
              onPress={() => navigation.navigate(RootRoutes.Saved)}
            >
              <Image
                source={require("../../assets/icons/fileIcon.png")}
                style={styles.image}
              />
              <Text style={[styles.textStyle, { fontSize: 15, color:'#171C26' }]}>Files</Text>
            </Pressable>
          </View>
        </View>
        {unreadMessageList.length > 0 && <Divider />}
        {unreadMessageList.length > 0 && (
          <UnReadList
            unreadMessageList={unreadMessageList}
            openDirect={openDirect}
          />
        )}
        <Divider />
        <ChannelList
          openChannel={openChannel}
          navigation={navigation}
          channelMessageList={channelMessageList}
        />
        <Divider />
        <DirectList
          directMessageList={directMessageList}
          setIsVisible={setIsVisible}
          openDirect={openDirect}
        />
        <Divider />
        <AppList appData={appData} />
      </ScrollView>
      <NewMessageBubble setModalIsTrue={setModalIsTrue} />
      <NewMessageScreen
        modalIsTrue={modalIsTrue}
        setModalIsTrue={setModalIsTrue}
        openDirect={openDirect}
      />
      <AddMemberModal
        isVisible={isVisible}
        toggle={toggle}
        isInvited={isInvited}
        setIsInvited={setIsInvited}
        setIsVisible={setIsVisible}
        loader={loader}
        setloader={setloader}
        member={member ?? ""}
        setMember={setMember}
      />
    </View>
  );
};
