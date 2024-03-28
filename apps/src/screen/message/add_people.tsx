import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
  FlatList,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { BackIcon, Check, UnCheck } from "../../assets";
import { status } from "../home";
import { useDispatch, useSelector } from "react-redux";
import { getChannels, getRoom, getUserColor, onInviteUser } from "../../../store";
import { Dispatch } from "redux";
import { BottomRoutes, RootRoutes } from "../../navigation/routes";

export const AddPeople = (props) => {
  const { getInvitesData, usersColor } = useSelector((state: any) => ({
    getInvitesData: state.userStore.getInvitesData,
    usersColor: state.userStore.usersColor,
  }));
  const ChannelInfo = props.route.params.item;
  const sortedUserList = getInvitesData.data.invites;
  const ChannelMembers = ChannelInfo.matrixRoomInfo.members;
  let primeList = sortedUserList.filter((item: any) =>
    ChannelMembers.every(
      (data: any) => data !== "@" + item.matrixUsername + ":matrix.onetab.ai"
    )
  );

  const dispatch = useDispatch<Dispatch<any>>();
  const result = primeList.map((item: any) => {
    return {
      id: `${item._id}`,
      name: `${item.firstName} ${item.lastName || ""}`,
      url: "",
      status: item.status ? status.active : status.inActive,
      matrixUsername: item.matrixUsername,
    };
  });

  const navigation = useNavigation<any>();
  const refContainer = useRef<TextInput>(null);
  const [input, setInput] = useState<string>("");
  const [selectedPeople, setSelectedPeople] = useState<any>([]);
  const [userList, setUserList] = useState<any>(result);
  const [userSelectionUpdate, setUserSelectionUpdate] =
    useState<boolean>(false);
  // **** to Select All Invites ****

  // const [selectedItems, setSelectedItems] = useState([]);

  // const toggleItemSelection = (item) => {
  //   if (selectedItems.includes(item)) {
  //     setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
  //   } else {
  //     setSelectedItems([...selectedItems, item]);
  //   }
  // };

  // const toggleSelectAll = () => {
  //   if (selectedItems.length === array.length) {
  //     setSelectedItems([]);
  //   } else {
  //     setSelectedItems([...array]);
  //   }
  // };

  //   <View>
  //   {array.map((item) => (
  //     <View key={item.id}>
  //       <CheckBox
  //         value={selectedItems.includes(item)}
  //         onValueChange={() => toggleItemSelection(item)}
  //       />
  //       <Text>{item.name}</Text>
  //     </View>
  //   ))}
  //   <Button title="Select All" onPress={toggleSelectAll} />
  // </View>
  const addUserToChannel = () => {
    console.log("addUserToChannel", selectedPeople);
    const room_id = ChannelInfo.matrixRoomId ?? "";
    const array = sortedUserList.filter((item: any) =>
      selectedPeople.find((data: any) => data === item._id)
    );
    console.log("addUserToChannel", array);
    dispatch(getRoom({ roomId: room_id }));
    const usernames = array.map(item => {return item.matrixUsername})
    // array.map(async (item: any, index: number) => {
    //   await onInviteUser(room_id, item.matrixUsername);
    // });
    onInviteUser(room_id, usernames)
    // navigation.goBack();
    navigation.navigate(BottomRoutes.Home)
  };

  const renderItem = ({ item }) => {
    return (
      <>
        <View style={styles.topView}>
          <Pressable
            onPress={() => {
              if (selectedPeople.find((data) => data === item.id)) {
                let current = selectedPeople;
                var index = current.indexOf(item.id);
                if (index !== -1) {
                  current.splice(index, 1);
                  setSelectedPeople(current);
                }
              } else {
                let current = selectedPeople;
                current.push(item.id);
                setSelectedPeople(current);
              }
              setUserSelectionUpdate(!userSelectionUpdate);
            }}
          >
            <View style={styles.userContainer}>
              <View style={styles.userInfo}>
                <View style={styles.userPicView}>
                  {item.url !== "" ? (
                    <Image
                      style={[styles.userPic]}
                      source={{ uri: item.url }}
                    />
                  ) : (
                    <View
                      style={[
                        styles.initialView,
                        {
                          backgroundColor: getUserColor(
                            "@" + item.matrixUsername + ":matrix.onetab.ai",
                            usersColor
                          ),
                        },
                      ]}
                    >
                      <Text style={styles.initial}>
                        {item.name.substring(0, 1).toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.statusView,
                      {
                        backgroundColor:
                          item.status === status.active ? "#5BDA15" : "#FF8E29",
                      },
                    ]}
                  ></View>
                </View>

                <Text style={styles.userName}>{item.name}</Text>
              </View>
              {selectedPeople.find((data: any) => data === item.id) ? (
                <Check />
              ) : (
                <UnCheck />
              )}
            </View>
          </Pressable>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" />

      <View
        style={{
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Header */}
        <View>
          <View style={styles.headerContainer}>
            <View style={styles.headerLeftView}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  alignItems: "center",
                }}
              >
                <BackIcon />
              </TouchableOpacity>

              <Text style={styles.titleText}>Add people</Text>
            </View>
            <Pressable
              onPress={() => {
                addUserToChannel();
                // console.log("selected user list ==> ", selectedPeople);
              }}
            >
              <Text style={styles.addButtonTextView}>Add</Text>
            </Pressable>
          </View>
          <View style={styles.divider} />
        </View>

        <View>
          <View style={styles.inputView}>
            <TextInput
              ref={refContainer}
              value={input}
              placeholder="Type the name or mail id"
              multiline={true}
              onChangeText={(text) => {
                setInput(text);
                if (text.length > 0) {
                  var newArray = userList.filter(function (el) {
                    return el.name.toLowerCase().includes(text.toLowerCase());
                  });
                  setUserList(newArray);
                } else {
                  setUserList(result);
                }
              }}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {input.length > 0 && (
              <Pressable
                onPress={() => {
                  setInput("");
                  setUserList(result);
                }}
              >
                <MaterialIcons
                  name="cancel"
                  size={24}
                  color="black"
                  style={{
                    marginLeft: 10,
                  }}
                />
              </Pressable>
            )}
          </View>

          <View style={styles.divider} />
        </View>

        <FlatList
          keyExtractor={(item: any) => item.id}
          data={userList}
          extraData={userSelectionUpdate}
          renderItem={({ item, index }) => renderItem({ item })}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  imageMainView: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginLeft: 10,
  },
  status: {
    width: 10,
    height: 10,
    backgroundColor: "#5BDA15",
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 8,
  },
  topView: {
    marginTop: 1,
    backgroundColor: "",
    justifyContent: "center",
  },
  bodyView: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 5,
  },
  chatImageMainView: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  infoView: {
    width: "100%",
  },
  bodyViewElse: {
    marginLeft: 60,
    marginTop: 5,
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
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userPicView: {
    width: 27,
    height: 27,
    justifyContent: "center",
    borderRadius: 5,
  },
  userPic: {
    width: 23,
    height: 23,
    borderRadius: 5,
    resizeMode: "cover",
  },
  initialView: {
    width: 23,
    height: 23,
    borderRadius: 5,
    backgroundColor: "#5A5A5A",
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    color: "#FFFFFF",
    fontSize: 12,
    ////fontFamily: "PlusJakartaSans-Bold",
  },
  statusView: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 0,
  },
  userName: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#171C26",
    marginLeft: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  headerLeftView: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#171C26",
    marginLeft: 5,
  },
  addButtonTextView: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#3866E6",
    marginLeft: 5,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#DEDEDE",
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "85%",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
