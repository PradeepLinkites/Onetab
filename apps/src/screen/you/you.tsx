import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  Switch,
  Pressable,
  Alert,
} from "react-native";

import {
  Logout,
  Away,
  PauseNotification,
  Preferences,
  Email,
  Phone,
  MessageEmoji,
} from "../../assets";
import { Divider } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { RootRoutes } from "../../navigation/routes";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { authStoreActions, getUserColor } from "../../../store";
import { saveDeviceTokenToStorage } from "../../../utils/setUpContext";

export const You = () => {
  const dispatch = useDispatch<Dispatch<any>>();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const navigation = useNavigation<any>();
  const { getUserData, matrixUserId, usersColor } = useSelector(
    (state: any) => ({
      getUserData: state.userStore.getUserData,
      matrixUserId: state.userStore.matrixUserId,
      usersColor: state.userStore.usersColor,
    })
  );

  const settingOptions = [
    {
      type: "notification",
      title: "Pause Notification",
      onPress: () => {
        navigation.navigate(RootRoutes.Pause_Notification);
      },
    },
    {
      type: "preferences",
      title: "Preferences",
      onPress: () => {
        navigation.navigate(RootRoutes.Preferences);
      },
    },
    {
      type: "away",
      title: "Set yourself as away",
      onPress: () => {
        toggleSwitch();
      },
    },
    {
      type: "logout",
      title: "Logout",
      onPress: () => {
        Alert.alert(
          "Confirm SignOut",
          "Are you sure you want to logout from the app?",
          [
            {
              text: "Cancel",
            },
            {
              text: "Logout",
              onPress: async () => {
                await saveDeviceTokenToStorage("");
                dispatch(authStoreActions.setVerifyOtpStatus("not loaded"));
                dispatch(authStoreActions.setVerifyData({}));
                navigation.navigate(RootRoutes.SignIn_Screen);
              },
            },
          ]
        );
      },
    },
  ];
  const renderItem = ({ item }) => {
    return (
      <>
        <Pressable
          style={styles.settingItemView}
          onPress={() => item.onPress()}
        >
          {
            {
              notification: <PauseNotification />,
              preferences: <Preferences />,
              away: <Away />,
              logout: <Logout />,
            }[item.type]
          }

          <Text style={styles.settingItemTitle}>{item.title}</Text>
          {item.type === "away" && (
            <Switch
              trackColor={{ false: "#767577", true: "#65CD53" }}
              thumbColor={"white"}
              ios_backgroundColor="#B4B4B4"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{
                position: "absolute",
                right: 20,
                transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
              }}
            />
          )}
        </Pressable>
      </>
    );
  };

  const firstName = getUserData.data.userByToken.firstName; // Splitting the full name by space and getting the first element
  const lastName = getUserData.data.userByToken.lastName; // Splitting the full name by space and getting the second element
  const userImageUrl = getUserData.data.userByToken.profileImageUrl;
  const result = firstName.slice(0, 1) + " " + lastName.slice(0, 1); // Output: A D

  return (
    <View style={styles.container}>
      {/*Info*/}
      <View style={styles.info}>
        <View>
          {/* <Image
            style={styles.userImage}
            source={require("../../assets/images/profile.png")}
            resizeMode="contain"
          /> */}
          <Pressable
            style={[
              styles.userImage,
              {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: getUserColor(matrixUserId, usersColor),
                borderRadius: 45,
              },
            ]}
          >
            {userImageUrl !== null ? (
              <Image
                source={{ uri: userImageUrl }}
                style={{ height: "100%", width: "100%" }}
                defaultSource={require("../../assets/images/app_logo.png")}
              />
            ) : (
              <Text
                style={{
                  //fontFamily: "PlusJakartaSans-ExtraBold",
                  fontSize: 30,
                  letterSpacing: -1.5,
                }}
              >
                {result}
              </Text>
            )}
          </Pressable>

          <View style={styles.status} />
        </View>

        <View style={styles.aboutView}>
          <Text style={styles.name}>
            {`${getUserData.data.userByToken.firstName ?? ""} ${
              getUserData.data.userByToken.lastName ?? ""
            }`}
          </Text>
          {/* <Text style={styles.designate}>Solution Architect</Text> */}
        </View>
      </View>

      {/*Status*/}
      {/* 
      <View style={styles.statusView}>
        <MessageEmoji
          width={14}
          height={14}
          marginLeft={10}
          onPress={() => console.log("PRESSED")}
        />

        <TextInput
          onChangeText={(e: string) => {}}
          style={styles.statusInput}
          placeholderTextColor={"#656971"}
          placeholder="Update your status"
          allowFontScaling={false}
          autoFocus={false}
        />
      </View> */}

      {/*Contact*/}

      <View style={styles.contactMainView}>
        <View style={styles.contactView}>
          <Text style={styles.contactTitle}>Contact information</Text>
          <Pressable
            onPress={() =>
              navigation.navigate(RootRoutes.EditProfile, {
                userFirstName: `${getUserData.data.userByToken.firstName}`,
                userLastName: `${getUserData.data.userByToken.lastName}`,
                userEmailAddress: getUserData.data.userByToken.email,
                userImageUrl: userImageUrl,
              })
            }
          >
            <Text style={styles.editInfo}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.contactSubView}>
          {/* <View style={styles.contactPhone}>
            <Phone style={{ marginRight: 5 }} />
            <Text style={styles.contactNumber}>1 (747) 220-3367</Text>
          </View> */}

          <View style={styles.contactEmailView}>
            <Email style={{ marginRight: 5 }} />
            <Text style={styles.contactEmail}>
              {getUserData.data.userByToken.email}
            </Text>
          </View>
        </View>
      </View>

      {/*Divider*/}

      <Divider />

      {/*Setting*/}

      <View>
        <View style={styles.settingView}>
          <Text style={styles.settingTitle}>Settings</Text>
        </View>

        <FlatList
          style={styles.settingFlat}
          keyExtractor={(item: any) => item.title}
          data={settingOptions}
          renderItem={({ item, index }) => renderItem({ item })}
          bounces={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  info: {
    // padding: 20,
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 20,
    flexDirection: "row",
  },
  userImage: {
    width: 90,
    height: 90,
  },
  status: {
    width: 16,
    height: 16,
    backgroundColor: "#5BDA15",
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: "#ffffff",
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 10,
  },
  aboutView: {
    justifyContent: "center",
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    ////fontFamily: "PlusJakartaSans-Bold",
    color: "#171C26",
    marginBottom: 8,
  },
  designate: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
  },
  statusView: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#F0F4F6",
    height: 40,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    width: 14,
    height: 14,
    marginLeft: 10,
  },
  statusInput: {
    marginLeft: 10,
    marginRight: 33,
  },
  contactView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactTitle: {
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Medium",
    color: "#1E1F21",
  },
  editInfo: {
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Medium",
    color: "#176FFC",
  },
  contactSubView: {
    marginLeft: 28,
  },
  // contactPhone: {
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  // contactNumber: {
  //   fontSize: 14,
  //   //fontFamily: "PlusJakartaSans-Regular",
  //   color: "#656971",
  //   marginLeft: 10,
  // },
  contactEmailView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contactEmail: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginLeft: 10,
  },
  contactMainView: {
    marginBottom: 15,
  },
  settingView: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingTitle: {
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Medium",
    color: "#171C26",
  },
  settingFlat: {
    marginLeft: 28,
  },
  settingItemView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 8,
  },
  settingItemTitle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginLeft: 20,
  },
});
