import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { Divider } from "../../components";
import { get } from "lodash";
import { Check, UnCheck } from "../../assets";
import { status } from "../home";
import { styles } from "./styles";

export const NewChannelComponnent = ({
  searchPhrase,
  setSearchPhrase,
  createButtonOnOff,

  sortedUserList,
  getUserColor,
  usersColor,
  setSelectedPeople,
  selectedPeople,
}) => {
  const [userSelectionUpdate, setUserSelectionUpdate] =
    useState<boolean>(false);

  const userAdded = ({ item, index }: any) => {
    if (selectedPeople.find((data: any) => data === item._id)) {
      let current = selectedPeople;
      var index = current.indexOf(item._id);
      if (index !== -1) {
        current.splice(index, 1);
        setSelectedPeople(current);
      }
    } else {
      let current = selectedPeople;
      current.push(item._id);
      setSelectedPeople(current);
    }
    setUserSelectionUpdate(!userSelectionUpdate);
  };

  const addUserRenderList = ({ item, index }) => {
    let matrixId = "@" + item.matrixUsername + ":matrix.onetab.ai";

    return (
      <View key={index}>
        <View style={styles.topView}>
          <Pressable
            onPress={() => {
              userAdded({ item, index });
            }}
          >
            <View style={styles.userContainer}>
              <View style={styles.userInfo}>
                <View style={styles.userPicView}>
                  {item.url === undefined ? (
                    <View
                      style={{
                        width: 25,
                        height: 25,
                        backgroundColor: getUserColor(matrixId, usersColor),
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 5,
                      }}
                    >
                      <Text>
                        {item.firstName.substring(0, 1).toUpperCase()}
                      </Text>
                    </View>
                  ) : (
                    <Image
                      source={require("../../assets/images/user5.png")}
                      style={{ width: 25, height: 25, resizeMode: "contain" }}
                    />
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

                <Text style={styles.userName}>
                  {item.firstName +
                    "  " +
                    (item.lastName === null ? "" : item.lastName)}
                </Text>
              </View>
              {selectedPeople.find((data: any) => data === item._id) ? (
                <Check />
              ) : (
                <UnCheck />
              )}
            </View>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        returnKeyType={"search"}
        placeholder="# e.g.  Marketing"
        value={searchPhrase}
        onChangeText={setSearchPhrase}
        placeholderTextColor={"#656971"}
        onSubmitEditing={(e) => console.log("pressed", e.nativeEvent.text)}
      />

      <Divider />
      {/* <View style={styles.contentViewStyle}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.textstyle}>Make private</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#65CD53" }}
            thumbColor={"#D9D9D9"}
            ios_backgroundColor="#B4B4B4"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <Text style={styles.subTitleStyle}>
          When a channel is set to private, it can only be joined by invitation.
        </Text>
      </View> */}
      {/* {!createButtonOnOff ? ( */}
      <FlatList
        keyExtractor={(item: any, index: number) => item._id}
        data={sortedUserList}
        extraData={sortedUserList}
        renderItem={({ item, index }) => addUserRenderList({ item, index })}
        style={{ marginTop: 12 }}
      />
      {/* ) : ( */}

      {/* )} */}
    </View>
  );
};
