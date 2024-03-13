import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, Foundation } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Divider } from "../../components";
import { Lock, Recent } from "../../assets";
export const UserProfile = (props: any) => {
  const { userName, userImage } = props?.route?.params;
  console.log("UserProfile", userName, userImage);
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [emailAddress, setEmailAddress] = useState<string>();
  const [phoneNum, setPhoneNum] = useState<string>();
  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.headertitle}>User Profile</Text>
        </View>
        {/* <Pressable>
          <Text style={styles.saveStyle}>Save</Text>
        </Pressable> */}
      </View>
      <Divider />

      <Image
        source={
          userImage === " "
            ? { uri: userImage }
            : require("../../assets/images/app_logo.png")
        }
        defaultSource={require("../../assets/images/app_logo.png")}
        style={{
          alignSelf: "center",
          height: 276,
          width: "92%",
          margin: 22,
          borderRadius: 8,
        }}
      />

      <View style={{ width: "90%", alignSelf: "center" }}>
        <Text style={styles.name}>{userName}</Text>

        <View style={styles.statusContainer}>
          <View style={styles.status} />
          <Text style={styles.statusText}>Active</Text>
        </View>

        <View style={styles.statusContainer}>
          <Recent style={styles.clock} />
          <Text style={styles.statusText}>12:36 PM local time</Text>
        </View>

        <TouchableOpacity style={styles.messageButton} onPress={() => {}}>
          <Text allowFontScaling={false} style={styles.messageText}>
            Message
          </Text>
        </TouchableOpacity>
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
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 2,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between",
  },
  saveStyle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Medium",
    color: "#176FFC",
  },
  messageButton: {
    width: "100%",
    backgroundColor: "#3866E6",
    marginTop: 22,
    alignItems: "center",
    borderRadius: 5,
    height: 42,
    justifyContent: "center",
  },
  headertitle: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
    color: "#171C26",
    marginLeft: 4,
  },
  name: {
    fontSize: 16,
    ////fontFamily: "PlusJakartaSans-Bold",
    color: "#171C26",
    marginBottom: 14,
  },
  clock: {
    width: 14,
    height: 14,
    // // backgroundColor: "#5BDA15",
    // borderRadius: 4.5,
    // position: "absolute",
    bottom: 3,
    marginRight: 9,
    marginLeft: 7,
    // right: 0,
    // marginRight: 10,
  },
  status: {
    width: 9,
    height: 9,
    backgroundColor: "#5BDA15",
    borderRadius: 4.5,
    // position: "absolute",
    bottom: 3,
    marginRight: 14,
    // right: 0,
    marginLeft: 7,
  },
  statusText: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageText: {
    color: "#ffffff",
    fontSize: 14,
    ////fontFamily: "PlusJakartaSans-Bold",
  },
});
