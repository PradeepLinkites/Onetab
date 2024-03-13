import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from "react-native";
import React from "react";
import { Octicons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { channelStatus } from "../home";
import {
  AddUser,
  BackIcon,
  LeaveChannel,
  PauseNotification,
  Search,
} from "../../assets";
import { BottomRoutes, RootRoutes } from "../../navigation/routes";
import { getUserColor, removeMember } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";

export const ChannnelInfo = (props) => {
  const ChannelInfo = props?.route?.params?.item;
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<Dispatch<any>>();
  const ChannelMembers = ChannelInfo.matrixRoomInfo.membersInfo;
  const { usersColor, room, matrixUserId, getInvitesData } = useSelector(
    (state: any) => ({
      usersColor: state.userStore.usersColor,
      room: state.chatStore.room,
      matrixUserId: state.userStore.matrixUserId,
      getInvitesData: state.userStore.getInvitesData,
    })
  );

  const sortedUserList = getInvitesData.data.invites;
  const ChannelMember = ChannelInfo.matrixRoomInfo.members;
  let primeList = sortedUserList.filter((item: any) =>
    ChannelMember.every(
      (data: any) => data !== "@" + item.matrixUsername + ":matrix.onetab.ai"
    )
  );
  const result = Object.entries(ChannelMembers).map(([key, value], index) => {
    return {
      id: `#${index + 1}`,
      name: value,
      url: "",
      matrixId: key,
    };
  });
  const createrId = room.currentState
    .getStateEvents("m.room.create")[0]
    .getContent().creator;

  const removeMembers = (item: any) => {
    Alert.alert(
      "Remove Member",
      `Are you sure to remove ${item.name} from Channel?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => dispatch(removeMember(item.matrixId)),
        },
      ]
    );
  };
  const leaveChannnel = () => {
    Alert.alert(
      "Leave Channel",
      `Are you sure you want to leave the Channel?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            dispatch(removeMember(matrixUserId));
            navigation.navigate(BottomRoutes.Home);
          },
        },
      ]
    );
  };
  const renderMember = ({ item, index }) => {
    return (
      <View key={index} style={styles.memberViewContainer}>
        {item.url !== "" ? (
          <Image style={styles.userPic} source={{ uri: item.url }} />
        ) : (
          <View
            style={[
              styles.userPic,
              {
                alignContent: "center",
                justifyContent: "center",
                backgroundColor: getUserColor(item.matrixId, usersColor),
              },
            ]}
          >
            <Text
              style={{
                fontSize: 22,
                ////fontFamily: "PlusJakartaSans-Bold",
                color: "#ffffff",
                textAlign: "center",
              }}
              adjustsFontSizeToFit
              allowFontScaling
            >
              {item.name.substring(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.userNameView}>
          <Text
            style={styles.userName}
            // adjustsFontSizeToFit
            // allowFontScaling
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </View>
        {(createrId === matrixUserId || createrId === item.matrixId) && (
          <Pressable
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              top: 0,
              right: -5,
              backgroundColor: "#CDDAED",
              padding: 2,
              borderRadius: 20,
            }}
            onPress={() => {
              console.log("Press close", item.name, item.matrixId);
              removeMembers(item);
            }}
          >
            <Ionicons name="close" size={20} color="black" />
          </Pressable>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <StatusBar backgroundColor="#ffffff" />
      <View>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <BackIcon />
          </TouchableOpacity>

          <View style={styles.headerLeftView}>
            {ChannelInfo.status === channelStatus.active ? (
              <Octicons name="hash" size={20} color="#656971" />
            ) : (
              <Octicons name="lock" size={20} color="#656971" />
            )}

            <Text style={styles.headerTitle}>{ChannelInfo.name}</Text>
          </View>
        </View>

        <View style={styles.divider}></View>
      </View>
      <View style={styles.channelInfoContainer}>
        <View style={styles.addPeopleView}>
          <Pressable
            onPress={() => {
              primeList.length > 0
                ? navigation.navigate(RootRoutes.Add_People, {
                    item: ChannelInfo,
                  })
                : Alert.alert(
                    "",
                    "All members of the WorkSpace have been already add to the channel"
                  );
            }}
            style={styles.addPeopleContainer}
          >
            <View>
              <AddUser />
              <Text style={styles.addPeopleText}>Add</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.searchContainer}
            onPress={() =>
              navigation.navigate(RootRoutes.Search_People, {
                item: ChannelInfo,
              })
            }
          >
            <Search />
            <Text style={styles.addPeopleText}>Search</Text>
          </Pressable>
        </View>

        <View style={styles.dividerWithMargin} />

        <View style={styles.memberView}>
          <Text style={styles.memberText}>Members</Text>

          <FlatList
            keyExtractor={(item: any) => item.id}
            data={result}
            horizontal={true}
            style={{
              marginTop: 10,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => renderMember({ item, index })}
          />
        </View>

        <View style={styles.dividerWithMargin} />

        <Text style={styles.settingsText}>Settings</Text>

        <View style={styles.settingItemView}>
          <PauseNotification />
          <Text style={styles.settingItemTitle}>Pause Notification</Text>
        </View>

        <Pressable
          style={styles.leaveChannelView}
          onPress={() => {
            leaveChannnel();
          }}
        >
          <LeaveChannel />
          <Text style={styles.leaveChannelText}>Leave Channel</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 30 : 0,
    backgroundColor: "#ffffff",
  },
  divider: {
    height: 1,
    backgroundColor: "#DEDEDE",
    marginTop: 4,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 4,
  },
  headerLeftView: {
    marginLeft: 10,
    justifyContent: "center",
    flexDirection: "row",
  },
  headerTitle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#171C26",
    marginLeft: 8,
  },
  channelInfoContainer: {
    flex: 1,
  },
  addPeopleView: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  addPeopleContainer: {
    width: "48%",
    height: 90,
    borderRadius: 20,
    backgroundColor: "#E8F1FF",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addPeopleText: {
    color: "#3866E6",
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-SemiBold",
  },
  searchContainer: {
    width: "48%",
    height: 90,
    borderRadius: 20,
    backgroundColor: "#E8F1FF",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  dividerWithMargin: {
    width: "100%",
    height: 1,
    backgroundColor: "#DEDEDE",
    marginTop: 10,
  },
  memberViewContainer: {
    width: 65,
    // backgroundColor: "red",
    // alignItems: "center",
    // justifyContent: "center",
    marginRight: 15,
    paddingTop: 5,
  },
  userPic: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 5,
  },
  userNameView: {
    width: 65,
    alignItems: "center",
  },
  userName: {
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#171C26",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  memberView: {
    paddingLeft: 20,
    marginTop: 10,
  },
  memberText: {
    color: "#171C26",
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Medium",
  },
  settingsText: {
    color: "#171C26",
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Medium",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  leaveChannelView: {
    height: 40,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#931726",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  leaveChannelText: {
    color: "#F3F5F5",
    fontSize: 14,
    ////fontFamily: "PlusJakartaSans-Bold",
    paddingLeft: 10,
  },
  settingItemView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  settingItemTitle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginLeft: 10,
  },
});
