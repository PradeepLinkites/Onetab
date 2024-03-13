import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  getUser,
  getUserColor,
  updateUser,
  uploadProfilePic,
  userStoreActions,
} from "../../../store";
import { Dispatch } from "redux";
import { Divider } from "../../components";
import { Lock } from "../../assets";
import { ProfilePicEditoer } from "./profilePicComponnect";

export const EditProfile = ({ route }) => {
  const { userFirstName, userLastName, userEmailAddress, userImageUrl } =
    route?.params;
  const dispatch = useDispatch<Dispatch<any>>();
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState<string>(userFirstName);
  const [firstNameEmpty, setFirstNameEmpty] = useState<boolean>(false);
  const [lastName, setLastName] = useState<string>(userLastName);
  const [lastNameEmpty, setLastNameEmpty] = useState<boolean>(false);
  const [selectedUrl, setSelectedUrl] = useState<any>("");
  const [emailAddress, setEmailAddress] = useState<string>(userEmailAddress);
  const {
    getUserData,
    updateUserData,
    uploadProfilePicData,
    matrixUserId,
    usersColor,
  } = useSelector((state: any) => ({
    updateUserData: state.userStore.updateUserData,
    getUserData: state.userStore.getUserData,
    uploadProfilePicData: state.userStore.uploadProfilePicData,
    matrixUserId: state.userStore.matrixUserId,
    usersColor: state.userStore.usersColor,
  }));
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (updateUserData.data !== undefined) {
      dispatch(getUser());
    }
  }, [updateUserData]);

  useEffect(() => {
    console.log(uploadProfilePicData);
    if (uploadProfilePicData.Location !== undefined) {
      setSelectedUrl(uploadProfilePicData.Location);
      dispatch(userStoreActions.setuploadProfilePicData({}));
    }
  }, [uploadProfilePicData]);
  useEffect(() => {
    if (getUserData.data !== undefined) {
      if (
        (userFirstName !== firstName || userLastName !== lastName) &&
        (firstName === getUserData.data.userByToken.firstName ||
          lastName === getUserData.data.userByToken.lastName)
      ) {
        navigation.goBack();
        dispatch(userStoreActions.setUpdateUserData({}));
        dispatch(userStoreActions.setUpdateUserStatus("not loaded"));
      }
    }
  }, [getUserData]);

  const validation = () => {
    if (firstNameEmpty === false && lastNameEmpty === false) {
      UpdateUserInfo();
    }
    navigation.goBack();
  };

  console.log("getUserData.data", getUserData.data.userByToken.profileImageUrl);

  var imageUrl = getUserData.data.userByToken.profileImageUrl;

  // const firstNamefrom = getUserData.data.userByToken.firstName // Splitting the full name by space and getting the first element
  // const lastName = getUserData.data.userByToken.lastName // Splitting the full name by space and getting the second element

  const UpdateUserInfo = async () => {
    if (userFirstName !== firstName || userLastName !== lastName)
      dispatch(
        updateUser({
          firstName: firstName,
          lastName: lastName,
          profileImageUrl: selectedUrl,
        })
      );
  };

  const result = firstName.slice(0, 1) + " " + lastName.slice(0, 1);
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
          <Text style={styles.headertitle}>Edit Profile</Text>
        </View>
        <Pressable
          onPress={() => {
            // UpdateUserInfo();

            validation();
          }}
        >
          <Text style={styles.saveStyle}>Save</Text>
        </Pressable>
      </View>
      <Divider />
      <>
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            backgroundColor: getUserColor(matrixUserId, usersColor),
            borderRadius: 55,
            alignSelf: "center",
            height: 110,
            width: 110,
            margin: 22,
          }}
        >
          {userImageUrl !== null ? (
            <Image
              source={{ uri: selectedUrl !== "" ? selectedUrl : userImageUrl }}
              style={{ height: "100%", width: "100%" }}
              defaultSource={require("../../assets/images/app_logo.png")}
            />
          ) : (
            <Text
              style={{
                //fontFamily: "PlusJakartaSans-ExtraBold",
                fontSize: 35,
                letterSpacing: -1.5,
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              {result}
            </Text>
          )}
        </Pressable>

        <TouchableOpacity
          onPress={() => toggleModal()}
          style={{
            // alignSelf: "flex-end",
            alignSelf: "center",
            bottom: "5.5%",
            left: "9%",
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: "#176FFC",
            justifyContent: "center",
            borderWidth: 1.5,
            borderColor: "white",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <MaterialIcons name="edit" size={16} color="white" />
        </TouchableOpacity>
      </>
      <View style={{ width: "90%", alignSelf: "center" }}>
        <Text style={styles.textStyle}>First name</Text>
        <TextInput
          onChangeText={(e: string) => {
            e.trim().length === 0
              ? setFirstNameEmpty(true)
              : setFirstNameEmpty(false);
            setFirstName(e.trimStart());
          }}
          defaultValue={userFirstName}
          placeholderTextColor={"#8AA2CE"}
          placeholder="Enter first name"
          style={styles.input}
          allowFontScaling={false}
          textContentType={"name"}
          contextMenuHidden={true}
          value={firstName}
        />

        <Text style={styles.firstNameErrorMessage}>
          {firstNameEmpty ? "Please enter valid first name" : " "}
        </Text>

        <Text style={[styles.textStyle, { marginTop: 5 }]}>Last name</Text>
        <TextInput
          onChangeText={(e: string) => {
            e.trim().length === 0
              ? setLastNameEmpty(true)
              : setLastNameEmpty(false);
            setLastName(e.trimStart());
          }}
          defaultValue={userLastName}
          placeholderTextColor={"#8AA2CE"}
          placeholder="Enter last name"
          style={styles.input}
          allowFontScaling={false}
          textContentType={"name"}
          contextMenuHidden={true}
          value={lastName}
        />
        <Text style={styles.lastNameErrorMessage}>
          {lastNameEmpty ? "Please enter valid last name" : ""}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "baseline",
          }}
        >
          <Lock
            style={{
              marginHorizontal: 5,
              justifyContent: "center",
              marginTop: "2%",
            }}
          />
          <Text style={[styles.textStyle, { marginTop: 4 }]}>
            Email address
          </Text>
        </View>
        <TextInput
          onChangeText={(e: string) => {
            setEmailAddress(e);
          }}
          editable={false}
          defaultValue={userEmailAddress}
          placeholderTextColor={"#8AA2CE"}
          placeholder="Enter email address"
          style={styles.input}
          allowFontScaling={false}
          textContentType={"name"}
          contextMenuHidden={true}
          value={emailAddress}
        />
        <ProfilePicEditoer
          isModalVisible={isModalVisible}
          dispatch={dispatch}
          styles={styles}
          uploadProfilePic={uploadProfilePic}
          UpdateUserInfo={UpdateUserInfo}
          toggleModal={toggleModal}
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
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 2,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between",
  },
  headertitle: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
    color: "#171C26",
    marginLeft: 4,
  },
  saveStyle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Medium",
    color: "#176FFC",
  },
  input: {
    borderColor: "#FFFFFF",
    borderRadius: 5,
    //fontFamily: "PlusJakartaSans-Regular",
    paddingLeft: 10,
    height: 42,
    fontSize: 15,
    color: "#000000",
    backgroundColor: "#F0F4F6",
    marginTop: 5,
  },
  modalButton: {
    height: 60,
    width: 80,
    borderRadius: 10,
    backgroundColor: "#F0FBFF",
    // opacity: 0.15,
    justifyContent: "center",
    shadowColor: "#F0FBFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    alignSelf: "center",
  },
  textStyle: {
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Medium",
    color: "#171C26",
    marginTop: 20,
  },
  firstNameErrorMessage: {
    color: "red",
    marginTop: 1,
    //fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
  },
  lastNameErrorMessage: {
    color: "red",
    marginTop: 1,
    //fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
  },
});
