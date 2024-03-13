import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Share,
  Linking,
} from "react-native";
import { Back, Logo } from "../../assets";

import { Entypo, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootRoutes } from "../../navigation/routes";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
  authStoreActions,
  createRoom,
  createWorkspace,
  fetchCurrentWorkspace,
  onCreateChannel,
  workspaceStoreActions,
} from "../../../store";

import * as Contacts from "expo-contacts";
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from "react-native-image-picker";
import axios from "axios";
import { ContactModal } from "./partials";
enum RootMap {
  Started = "Started",
  Workspace = "Workspace",
  Share = "Share",
  Project = "Project",
  Done = "Done",
}
interface ContactDataType {
  id: string;
  name: string;
  phoneNumber: string;
}
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

export const CreateworkSpace = ({ route }) => {
  const [currentItem, setCurrentItem] = useState<RootMap>(RootMap.Started);
  const [workSpaceName, setWorkSpaceName] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [contactList, setContactList] = useState<any>([]);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<any>(undefined);
  const [selectMimeType, setSelectMimeType] = useState<string>("");
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const userEmail = route.params?.userEmail;
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<Dispatch<any>>();
  const { createWorkspaceData, createChannelData } = useSelector(
    (state: any) => ({
      createWorkspaceData: state.workspaceStore.createWorkspaceData,
      createChannelData: state.chatStore.createChannelData,
    })
  );
  useEffect(() => {
    console.log("Current Item ==> ", currentItem);
    return;
  }, [currentItem]);
  useEffect(() => {
    if (selectedContact !== undefined) {
      try {
        Linking.openURL(
          `sms:${selectedContact.phoneNumber}${
            Platform.OS === "ios" ? "&" : "?"
          }body=${`Your teammates Invited you to Slack workspace${workSpaceName}.`}`
        );
      } catch (error) {
        console.log("sms Error", error);
      }
    }
    return;
  }, [selectedContact]);
  useEffect(() => {
    if (createWorkspaceData.data !== undefined) {
      dispatch(
        fetchCurrentWorkspace(createWorkspaceData.data.createWorkspace._id)
      );
      setCurrentItem(RootMap.Share);
    }
  }, [createWorkspaceData]);
  useEffect(() => {
    if (createChannelData.data !== undefined) {
      setCurrentItem(RootMap.Done);
    }
    return;
  }, [createChannelData]);
  const pickImage = async ({ type }) => {
    const pickImage = async ({ type }) => {
      let options: ImageLibraryOptions = {
        includeBase64: true,
        mediaType: type === "gallery" ? "mixed" : "photo",
      };
      const result = await launchImageLibrary(options);
      if (result.didCancel) {
        console.log("User cancelled the slection");
      } else {
        if (result.assets !== undefined) {
          let photo = result.assets[0];
          if (photo.type?.includes("image/")) {
            console.log("Here 1");
            setSelectMimeType("image");
          } else {
            console.log("Here 2");
            setSelectMimeType("video");
          }
          console.log("Type ==> create_workspace ", result);
          setSelectedUrl(photo.uri ?? "");
          const formData = new FormData();
          photo?.base64 &&
            formData.append("file", "data:image/png;base64," + photo?.base64);
          const res = await axios.post(
            "https://services.wynn.io/file-upload/buffer",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("UPLOAD RESPONSE : ", res.data);
        }
      }
    };
  };
  const onShare = async ({ title }) => {
    try {
      const result = await Share.share({
        message: `${title} \n ${"https://wynn.io/"}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log("THIS THE ONSHARE LOG", error);
    }
  };
  const requestContact = async () => {
    console.log("request");
    const { status } = await Contacts.requestPermissionsAsync();
    console.log(status);
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        let contacts: any = [];
        for (let index = 0; index < data.length; index++) {
          //console.log("Contact ===> ",data[index])
          const element = data[index];
          if (element.phoneNumbers !== undefined) {
            let item: ContactDataType = {
              id: element.id,
              name: element.name,
              phoneNumber: element.phoneNumbers[0].number!!,
            };
            contacts.push(item);
          }
        }
        //console.log("Contact list count before ==> ", contacts.length);
        let namesArr = contacts.filter(
          (ele: any, ind: any) =>
            ind ===
            contacts.findIndex(
              (elem: any) => elem.phoneNumber === ele.phoneNumber
            )
        );
        //console.log("Contact list count after ==> ", namesArr.length);
        setContactList(namesArr);
        setTimeout(() => {
          setShowContactModal(true);
        }, 100);
      }
    }
  };

  const channelCreation = () => {
    dispatch(
      createRoom({
        name: channelName,
        is_direct: false,
        visibility: true,
        preset: "trusted_private_chat",
        topic: "",
      })
    );
    // dispatch(
    //   onCreateChannel({
    //     name: channelName,
    //     description: "",
    //     matrixRoomInfo: {
    //       name: channelName,
    //     },
    //     workspace_id: createWorkspaceData.data.createWorkspace._id,
    //   })
    // );
  };

  return (
    <View style={styles.container}>
      <MyStatusBar
        backgroundColor={currentItem !== RootMap.Done ? "#3866E6" : "#FFFFFF"}
      />
      <View
        style={{
          height: "100%",
        }}
      >
        {currentItem !== RootMap.Done && (
          <View
            style={{
              height: 60,
              backgroundColor: "#3866E6",
              paddingStart: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Pressable
                style={{ padding: 8 }}
                onPress={() => {
                  dispatch(authStoreActions.setVerifyOtpStatus("not loaded"));
                  dispatch(authStoreActions.setVerifyData({}));
                  dispatch(
                    workspaceStoreActions.setFetchWorkspaceStatus("not loaded")
                  );
                  dispatch(workspaceStoreActions.setFetchWorkspaceData({}));
                  dispatch(
                    workspaceStoreActions.setCurrentWorkspaceStatus(
                      "not loaded"
                    )
                  );
                  dispatch(workspaceStoreActions.setCurrentWorkspaceData({}));
                  navigation.navigate(RootRoutes.SignIn_Screen);
                }}
              >
                <Back tintColor="#FFFFFF" />
              </Pressable>

              {currentItem === RootMap.Started && (
                <Text
                  style={{
                    color: "#FFFFFF",
                    //fontFamily: "PlusJakartaSans-Regular",
                    fontSize: 16,
                    marginLeft: 15,
                  }}
                >
                  Get Started
                </Text>
              )}
            </View>
            {currentItem === RootMap.Share && (
              <Pressable
                onPress={() => {
                  setCurrentItem(RootMap.Project);
                  setIsFocused(false);
                }}
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    //fontFamily: "PlusJakartaSans-Regular",
                    fontSize: 16,
                    marginLeft: 20,
                  }}
                >
                  Skip
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {currentItem !== RootMap.Done && (
          <View
            style={{
              width: "100%",
              height: 3,
              backgroundColor: "#DEDEDE",
            }}
          >
            <View
              style={{
                width:
                  currentItem === RootMap.Started
                    ? "0%"
                    : currentItem === RootMap.Workspace
                    ? "25%"
                    : currentItem === RootMap.Share
                    ? "50%"
                    : currentItem === RootMap.Project
                    ? "75%"
                    : "100%",
                height: 3,
                backgroundColor: "#3866E6",
              }}
            />
          </View>
        )}

        {currentItem === RootMap.Started ? (
          <View
            style={{
              justifyContent: "space-between",
              flex: 1,
              marginBottom: 70,
            }}
          >
            <View
              style={{
                alignItems: "center",
                width: "100%",
                marginTop: 60,
              }}
            >
              {/* <Logo /> */}
              <Image
                source={require("../../assets/images/app_logo.png")}
                style={{
                  width: 250,
                  height: 250,
                }}
              />
              <Text
                allowFontScaling={false}
                style={{
                  color: "#000000",
                  ////fontFamily: "PlusJakartaSans-Bold",
                  fontSize: 25,
                  marginTop: 40,
                }}
              >
                Ready to launch
              </Text>

              <Text
                allowFontScaling={false}
                style={{
                  color: "#000000",
                  //fontFamily: "PlusJakartaSans-Medium",
                  fontSize: 15,
                  paddingHorizontal: 50,
                  alignSelf: "center",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                You're all ready to start a new workspace for your organisation
              </Text>

              <Pressable
                onPress={() => {
                  setCurrentItem(RootMap.Workspace);
                }}
              >
                <View
                  style={{
                    backgroundColor: "#3866E6",
                    borderRadius: 10,
                    paddingHorizontal: 60,
                    paddingVertical: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: "#FFFFFF",
                      ////fontFamily: "PlusJakartaSans-Bold",
                      fontSize: 16,
                    }}
                  >
                    Create a workspace
                  </Text>
                </View>
              </Pressable>
            </View>

            <View
              style={{
                width: "100%",
              }}
            >
              <View
                style={{
                  width: "90%",
                  height: 1,
                  backgroundColor: "#DEDEDE",
                  marginLeft: 20,
                }}
              />
              <Text
                allowFontScaling={false}
                style={{
                  color: "#000000",
                  //fontFamily: "PlusJakartaSans-Medium",
                  fontSize: 15,
                  textAlign: "center",
                  paddingHorizontal: 40,
                  marginTop: 10,
                }}
              >
                {`We couldn't find existing workspace for. If that's a mistake, ask your admin ${userEmail} for an invitation or`}
                <Text
                  style={{
                    color: "#3866E6",
                  }}
                >
                  {" "}
                  try another email address
                </Text>
              </Text>
            </View>
          </View>
        ) : currentItem === RootMap.Workspace ? (
          <View
            style={{
              flex: 1,
              marginBottom: 70,
              paddingHorizontal: 10,
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  ////fontFamily: "PlusJakartaSans-Bold",
                  lineHeight: 24,
                  textAlign: "center",
                }}
              >
                What's the name of your company or team?
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  //fontFamily: "PlusJakartaSans-Medium",
                  lineHeight: 14,
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                This will be the name of your slack workspace.
              </Text>

              <View
                style={{
                  width: "80%",
                  marginTop: 20,
                }}
              >
                <View>
                  <View style={styles.labelContainer}>
                    {isFocused === true && (
                      <Text
                        style={{
                          color: "#3866E6",
                        }}
                      >
                        {"e.g. A1 or A2 Marketing"}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 8,
                      zIndex: 0,
                      borderColor: isFocused === true ? "#3866E6" : "#000000",
                    }}
                  >
                    <TextInput
                      onChangeText={(e: string) => {
                        setWorkSpaceName(e);
                      }}
                      placeholder={
                        isFocused === false ? "e.g. A1 or A2 Marketing" : ""
                      }
                      placeholderTextColor={
                        isFocused === true ? "#3866E6" : "#DEDEDE"
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      style={{
                        fontSize: 15,
                        color: "#000000",
                        //fontFamily: "PlusJakartaSans-Regular",
                      }}
                    />
                  </View>
                </View>
              </View>

              <Pressable
                style={{
                  width: "80%",
                  backgroundColor:
                    workSpaceName.length > 0 ? "#3866E6" : "#DEDEDE",
                  marginTop: 20,
                  alignItems: "center",
                  borderRadius: 8,
                  height: 56,
                  justifyContent: "center",
                }}
                onPress={() => {
                  if (workSpaceName.length > 0) {
                    dispatch(createWorkspace({ name: workSpaceName }));
                    // setCurrentItem(RootMap.Share);
                  }
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    color: "#ffffff",
                    fontSize: 14,
                    ////fontFamily: "PlusJakartaSans-Bold",
                  }}
                >
                  Next
                </Text>
              </Pressable>
              <Text
                style={{
                  fontSize: 13,
                  //fontFamily: "PlusJakartaSans-Regular",
                  lineHeight: 14,
                  marginTop: 20,
                  paddingHorizontal: 35,
                }}
              >
                By continuing, you're agreeing to our
                <Text
                  style={{
                    color: "#3866E6",
                  }}
                >
                  {" "}
                  Main service aggrement
                </Text>
                ,
                <Text
                  style={{
                    color: "#3866E6",
                  }}
                >
                  {" "}
                  User term of services
                </Text>
                ,
                <Text
                  style={{
                    color: "#3866E6",
                  }}
                >
                  {" "}
                  Privacy policy
                </Text>
                ,
                <Text
                  style={{
                    color: "#3866E6",
                  }}
                >
                  {" "}
                  Cookie policy
                </Text>{" "}
                and
                <Text
                  style={{
                    color: "#3866E6",
                  }}
                >
                  {" "}
                  Slack supplemental terms
                </Text>
                .
              </Text>
            </KeyboardAvoidingView>
          </View>
        ) : currentItem === RootMap.Share ? (
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                ////fontFamily: "PlusJakartaSans-Bold",
                lineHeight: 24,
                textAlign: "center",
              }}
            >
              Who else is on the {workSpaceName} team?
            </Text>
            <Text
              style={{
                fontSize: 14,
                //fontFamily: "PlusJakartaSans-Medium",
                lineHeight: 14,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Invite your teammates to Slack.
            </Text>

            <Pressable
              style={{
                width: "80%",
                backgroundColor: "#3866E6",
                marginTop: 20,
                alignItems: "center",
                borderRadius: 8,
                height: 56,
                justifyContent: "center",
              }}
              onPress={() => {
                onShare({ title: workSpaceName });
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Entypo name="share-alternative" size={16} color="#FFFFFF" />
                <Text
                  allowFontScaling={false}
                  style={{
                    color: "#ffffff",
                    fontSize: 14,
                    ////fontFamily: "PlusJakartaSans-Bold",
                    marginLeft: 5,
                  }}
                >
                  Share a link
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={{
                width: "80%",
                backgroundColor: "#FFFFFF",
                marginTop: 20,
                alignItems: "center",
                borderRadius: 8,
                height: 56,
                justifyContent: "center",
                borderColor: "#DEDEDE",
                borderWidth: 1,
              }}
              onPress={() => {
                requestContact();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign name="contacts" size={20} color="black" />
                <Text
                  allowFontScaling={false}
                  style={{
                    color: "#000000",
                    fontSize: 14,
                    ////fontFamily: "PlusJakartaSans-Bold",
                    marginLeft: 5,
                  }}
                >
                  Add from contacts
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={{
                width: "80%",
                backgroundColor: "#FFFFFF",
                marginTop: 20,
                alignItems: "center",
                borderRadius: 8,
                height: 56,
                justifyContent: "center",
                borderColor: "#DEDEDE",
                borderWidth: 1,
              }}
              onPress={() => {
                try {
                  Linking.openURL(
                    `mailto:?subject= Your teammates Invited you to Slack workspace${workSpaceName}.`
                  );
                } catch (error) {
                  console.log("email error", error);
                }
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="email-box"
                  size={20}
                  color="black"
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    color: "#000000",
                    fontSize: 14,
                    ////fontFamily: "PlusJakartaSans-Bold",
                    marginLeft: 5,
                  }}
                >
                  Add by email
                </Text>
              </View>
            </Pressable>
            <ContactModal
              showContactModal={showContactModal}
              setShowContactModal={setShowContactModal}
              contact={contactList}
              setSelectedContact={setSelectedContact}
            />
          </View>
        ) : currentItem === RootMap.Project ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              paddingBottom: 20,
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{
                alignItems: "center",
                width: "100%",
                flex: 1,
                paddingVertical: 50,
                marginBottom: 40,
              }}
            >
              {selectedUrl === "" ? (
                <>
                  <Pressable
                    style={{
                      height: 100,
                      width: 100,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#808080",
                      marginBottom: 10,
                    }}
                    onPress={() => pickImage({ type: "photo" })}
                  >
                    <MaterialCommunityIcons
                      name="image-plus"
                      size={24}
                      color="black"
                    />
                  </Pressable>
                  <Text
                    style={{
                      marginBottom: 40,
                      fontSize: 20,
                      //fontFamily: "PlusJakartaSans-SemiBold",
                    }}
                  >
                    Organization Logo
                  </Text>
                </>
              ) : (
                <Image
                  source={{ uri: selectedUrl }}
                  style={{
                    height: 100,
                    width: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 70,
                  }}
                />
              )}
              <View style={{ alignItems: "center", width: "100%" }}>
                <Text
                  style={{
                    fontSize: 24,
                    ////fontFamily: "PlusJakartaSans-Bold",
                    lineHeight: 24,
                    textAlign: "center",
                  }}
                >
                  What's a project your team are working on?
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    //fontFamily: "PlusJakartaSans-Medium",
                    lineHeight: 14,
                    textAlign: "center",
                    marginTop: 20,
                    paddingHorizontal: 25,
                  }}
                >
                  This could be anything: a project, campaign event or the deal
                  that you're trying to close.
                </Text>

                <View
                  style={{
                    width: "80%",
                    marginTop: 25,
                  }}
                >
                  <View>
                    <View style={styles.labelContainer}>
                      {isFocused === true && (
                        <Text
                          style={{
                            color: "#3866E6",
                          }}
                        >
                          {"e.g. Q4 budget, Website update..."}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 8,
                        zIndex: 0,
                        borderColor: isFocused === true ? "#3866E6" : "#000000",
                      }}
                    >
                      <TextInput
                        onChangeText={(e: string) => {
                          setChannelName(e);
                        }}
                        placeholder={
                          isFocused === false
                            ? "e.g. Q4 budget, Website update..."
                            : ""
                        }
                        placeholderTextColor={
                          isFocused === true ? "#3866E6" : "#DEDEDE"
                        }
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        style={{
                          fontSize: 15,
                          color: "#000000",
                          //fontFamily: "PlusJakartaSans-Regular",
                        }}
                      />
                    </View>
                  </View>
                </View>

                <Pressable
                  style={{
                    width: "80%",
                    // backgroundColor:
                    //   channelName.length > 0 ? "#3866E6" : "#DEDEDE",
                    backgroundColor: "#3866E6",
                    marginTop: 20,
                    alignItems: "center",
                    borderRadius: 8,
                    height: 56,
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    if (channelName.length === 0) {
                      setCurrentItem(RootMap.Done);
                    } else {
                      channelCreation();
                    }
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: "#ffffff",
                      fontSize: 14,
                      ////fontFamily: "PlusJakartaSans-Bold",
                    }}
                  >
                    Next
                  </Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                height: 150,
                paddingTop: 50,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  ////fontFamily: "PlusJakartaSans-Bold",
                  lineHeight: 24,
                  textAlign: "center",
                }}
              >
                Tada! Meet your team's first channel: #{channelName}
              </Text>
            </View>
            <View
              style={{
                marginBottom: 200,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/images/final.png")}
                style={{
                  height: 450,
                  resizeMode: "contain",
                }}
              />
            </View>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                height: 200,
                width: "100%",
                alignItems: "center",
                paddingHorizontal: 20,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  //fontFamily: "PlusJakartaSans-Medium",
                  lineHeight: 15,
                  textAlign: "center",
                  marginTop: 20,
                  paddingHorizontal: 20,
                }}
              >
                A channel brings together every part of your project so your
                team can get more done.
              </Text>

              <Pressable
                style={{
                  width: "90%",
                  backgroundColor: "#3866E6",
                  marginTop: 20,
                  alignItems: "center",
                  borderRadius: 8,
                  height: 56,
                  justifyContent: "center",
                }}
                onPress={() => {
                  navigation.navigate(RootRoutes.Drawer);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: "#ffffff",
                      fontSize: 14,
                      ////fontFamily: "PlusJakartaSans-Bold",
                      marginLeft: 5,
                    }}
                  >
                    See your channel in Slack
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
  },
  statusBar: {
    height: StatusBar.currentHeight,
  },
  labelContainer: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    paddingHorizontal: 3,
    marginStart: 10,
    zIndex: 1,
    elevation: 1,
    shadowColor: "white",
    position: "absolute",
    top: -12,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    zIndex: 0,
  },
});
