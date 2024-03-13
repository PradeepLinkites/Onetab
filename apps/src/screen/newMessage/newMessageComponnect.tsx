import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Divider } from "../../components";

import { RootRoutes } from "../../navigation/routes";
import { useSelector } from "react-redux";
import { styles } from "./styles";
enum status {
  active = "active",
  inActive = "inActive",
}
export const NewMessageComponnect = ({
  searchPhrase,
  setSearchPhrase,
  sortedUserList,
  getUserColor,
  usersColor,
  roomCreateOrNot,
  loader,
}) => {
  const { createChannelData } = useSelector((state: any) => ({
    createChannelData: state.chatStore.createChannelData,
  }));

  useEffect(() => {
    if (
      createChannelData.data !== undefined &&
      createChannelData.data.data !== undefined
    ) {
      // navigation.navigate(RootRoutes.Message, { item: item })
    }
  }, [createChannelData]);

  const directMessage = ({ item, index }: any) => {
    let matrixId = "@" + item.matrixUsername + ":matrix.onetab.ai";
    return (
      <Pressable
        onPress={async () => {
          const user: string = item.matrixUsername;
          const name: string =
            item.firstName +
            "  " +
            (item.lastName === null ? "" : item.lastName);
          await roomCreateOrNot({ user, matrixId, name });
        }}
      >
        <View key={item.id} style={{ flexDirection: "row", height: 35 }}>
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
              <Text>{item.firstName.substring(0, 1).toUpperCase()}</Text>
            </View>
          ) : (
            <Image
              source={require("../../assets/images/user5.png")}
              style={{ width: 25, height: 25, resizeMode: "contain" }}
            />
          )}
          <View
            style={[
              styles.badgeStyle,
              {
                backgroundColor:
                  item.status === status.active ? "#5BDA15" : "#FF8E29",
                top: 18.5,
                left: 18.5,
              },
            ]}
          ></View>
          <Text
            style={{
              marginLeft: 12,
              color: "#171C26",
              //fontFamily: "PlusJakartaSans-Regular",
              fontSize: 14,
            }}
          >
            {item.firstName +
              "  " +
              (item.lastName === null ? "" : item.lastName)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.textstyle}>To: </Text>
        <TextInput
          style={styles.input}
          returnKeyType={"search"}
          placeholder="Type the name of a channel or person"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          placeholderTextColor={"#656971"}
          onSubmitEditing={(e) => console.log("pressed", e.nativeEvent.text)}
        />
      </View>
      <Divider />
      <View style={styles.contentViewStyle}>
        <FlatList
          data={sortedUserList}
          renderItem={({ item, index }) => directMessage({ item, index })}
        />
        <ActivityIndicator
          size={"large"}
          color={"#007AFF"}
          animating={loader}
        />
      </View>
    </View>
  );
};
