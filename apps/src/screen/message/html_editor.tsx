import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  PermissionsAndroid,
  Linking,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";

import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { Attachment, MessageEmoji } from "../../assets";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { photo, PhotoListDataType } from "./Photodata";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  AntDesign,
  Octicons,
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import {
  onError,
  onHeightLoad,
  onHeightLoadEnd,
  onHeightLoadStart,
  onShouldStartLoadWithRequest,
} from "./html_view";
import {
  autoDetectLinkScript,
  AutoHeightWebView,
  BinkingMic,
  inlineBodyStyle,
} from "../../components";
import { useKeyboard } from "./keyBoardHeight";
import { Audio } from "expo-av";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { chatStoreActions, sendTypingEvent, uploadFiles } from "../../../store";
import { get } from "lodash";
import { TaggingModal } from "./taggingModel";
const ActionList = [
  actions.setBold,
  actions.setItalic,
  actions.setStrikethrough,
  actions.insertLink,
  actions.setUnderline,
  actions.insertBulletsList,
  // actions.insertOrderedList,
  // actions.removeFormat,
  // actions.undo,
  // actions.redo,
  // actions.heading1,
  // actions.insertImage,
  // actions.insertVideo,
  // actions.checkboxList,
  // actions.keyboard,
];

export const HtmlEditorView = (props) => {
  const {
    isAudio,
    isKeyboardVisible,
    textMessage,
    setSendShowButton,
    setTextMessage,
    setKeyboardVisible,
    setShowEmoji,
    setImageData,
    setShowModal,
    sendShowButton,
    setMsgSent,
    msgSent,
    setIsAudio,
    setAudioFile,
    uploadData,
    setUploadData,
    setSelectedUrl,
    setDocResult,
    ChannelInfo,
    // setTaggingModal,
    changedData,
    setChangedData,
    fromThread,
    mention,
    setMention,
    memberData,
  } = props;

  const richText = useRef<any>();
  const scrollViewRef = useRef<any>();
  const dispatch = useDispatch<Dispatch<any>>();
  const [editorAttached, setEditorAttached] = React.useState<boolean>(false);
  const [recording, setRecording] = React.useState<any>();
  const [pauseState, setPauseState] = React.useState<any>(false);
  const [recordingStart, setRecordingStart] = React.useState<any>();
  const [msg, setMsg] = useState("");
  const [startTagIndex, setStartTagIndex] = useState(-1);
  // const [changedData, setChangedData] = useState("");
  const [taggingModal, setTaggingModal] = useState<boolean>(false);

  const handleDataChange = (newData: React.SetStateAction<string>) => {
    console.log("DIRECT MESSAGE WALA CONSOLE", newData);
    setChangedData(newData);
  };
  // const regex=/(?<!\b">|")@(\w+)/
  const regex = /(?<!["|<|">])@(\w+)/;
  // const regex = /@[a-zA-Z]+(?![\w\s])/;
  const { uploadFilesStatus, uploadedFiles, room, typingEvent } = useSelector(
    (state: any) => ({
      uploadFilesStatus: state.chatStore.uploadFilesStatus,
      uploadedFiles: state.chatStore.uploadedFiles,
      room: state.chatStore.room,
      typingEvent: state.chatStore.typingEvent,
    })
  );

  useEffect(() => {
    console.log("$$$$$$$$$$: ", msg);
  }, [msg]);

  const getTypingStatus = () => {
    const typeStatus: any = [];
    Object.keys(get(room, "currentState.members", {})).forEach((data) => {
      if (
        data !== get(room, "myUserId", "") &&
        get(room.currentState.members[data], "typing", false) === true
      ) {
        typeStatus.push(room.currentState.members[data]);
      }
    });
    //console.log("Typing users ==> ", typeStatus);
    return typeStatus;
  };

  const renderTypingStatus = () =>
    getTypingStatus().map((data, key) => (
      <Text
        key={data + key}
        style={{
          fontFamily: "PlusJakartaSans-Bold",
          fontSize: 14,
          color: "#000000",
          paddingLeft: 10,
          paddingTop: 5,
          paddingBottom: 5,
          borderColor: "#DEDEDE",
          borderWidth: 1,
        }}
      >
        {get(data, "rawDisplayName", "")}
        {getTypingStatus().length !== 1 &&
        getTypingStatus().length !== key + 1 ? (
          <Text
            style={{
              fontFamily: "PlusJakartaSans-Regular",
              fontSize: 14,
              color: "#000000",
            }}
          >
            , &nbsp; is typing...
          </Text>
        ) : (
          <Text
            style={{
              fontFamily: "PlusJakartaSans-Regular",
              fontSize: 14,
              color: "#000000",
            }}
          >
            {" "}
            is typing...
          </Text>
        )}
      </Text>
    ));

  // const renderTypingStatus = () => {
  //   console.log("renderTypingStatus ==> ",getTypingStatus().length)
  //   if(getTypingStatus().length < 1){
  //     return(<></>)
  //   }else if(getTypingStatus().length === 1){
  //     <Text
  //       style={{
  //         fontFamily: "PlusJakartaSans-Bold",
  //         fontSize: 14,
  //         color: "#000000",
  //         paddingLeft: 10,
  //         paddingTop:5,
  //         paddingBottom:5,
  //         borderColor: "#DEDEDE",
  //         borderWidth:1
  //       }}
  //     >
  //       {getTypingStatus()[0].rawDisplayName}
  //        <Text
  //           style={{
  //             fontFamily: "PlusJakartaSans-Regular",
  //             fontSize: 14,
  //             color: "#000000",
  //           }}
  //         >
  //           {" is typing..."}
  //         </Text>
  //     </Text>
  //   }else{
  //     <Text
  //       style={{
  //         fontFamily: "PlusJakartaSans-Bold",
  //         fontSize: 14,
  //         color: "#000000",
  //         paddingLeft: 10,
  //         paddingTop:5,
  //         paddingBottom:5,
  //         borderColor: "#DEDEDE",
  //         borderWidth:1
  //       }}
  //     >
  //       {getTypingStatus().length + " Peoples"}
  //        <Text
  //           style={{
  //             fontFamily: "PlusJakartaSans-Regular",
  //             fontSize: 14,
  //             color: "#000000",
  //           }}
  //         >
  //           {" are typing..."}
  //         </Text>
  //     </Text>
  //   }
  // }

  useEffect(() => {
    getTypingStatus();
  }, [typingEvent]);

  const [loading, setLoading] = React.useState<boolean>(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        try {
          //console.log('log1')
          if (
            richText !== null &&
            richText.current !== undefined &&
            richText.current !== null
          ) {
            richText.current?.focusContentEditor();
          }
          setKeyboardVisible(true);
        } catch (error) {
          console.log("Oops something wrong keyboardDidShow ", error);
        }
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        try {
          //console.log('log3')
          if (richText !== null && richText.current !== undefined) {
            //console.log('log4')
            Platform.OS === "android" && richText.current.blurContentEditor();
          }
          Platform.OS === "android" && setKeyboardVisible(false);
        } catch (error) {
          console.log("Oops something wrong keyboardDidHide ", error);
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  useEffect(() => {
    if (uploadFilesStatus !== "not loaded") {
      console.log(uploadFilesStatus);
      if (uploadFilesStatus === "loaded") {
        {
          setLoading(false);
        }
        if (uploadFilesStatus === "loading") {
          setLoading(true);
        }
        if (uploadFilesStatus === "error") {
          setUploadData([]);
        }
      }
    }
  }, [uploadFilesStatus]);

  const [{ widthStyle, heightStyle }, setStyle] = useState({
    heightStyle: null,
    widthStyle: inlineBodyStyle,
  });

  const [heightSize, setHeightSize] = useState({ height: 0, width: 0 });
  const keyboardHeight = useKeyboard();
  const [{ widthScript, heightScript }, setScript] = useState({
    heightScript: autoDetectLinkScript,
    widthScript: null,
  });

  const getImageData = () => {
    let mime = ["image/jpeg"];
    CameraRoll.getPhotos({
      first: 20,
      assetType: "Photos",
      mimeTypes: mime,
    })
      .then((r) => {
        let photo: any = [];
        for (let index = 0; index < r.edges.length; index++) {
          const element = r.edges[index];
          let PhotoItem: PhotoListDataType = {
            id: element.node.timestamp,
            url: element.node.image.uri,
          };
          photo.push(PhotoItem);
        }
        setImageData(photo);
        setShowModal(true);
      })
      .catch((err) => {});
  };

  const openSettings = () => {
    Linking.openSettings();
  };
  const getImageDataiOS = () => {
    CameraRoll.getPhotos({ first: 20 })
      .then((res) => {
        let pictureArray = res.edges;
        const convertedData = pictureArray.map((item, index) => {
          const node = item.node;
          const imageURL = node.image.uri;
          return {
            id: index + 1,
            url: imageURL,
            fileName: node.image.filename,
            fileSize: node.image.fileSize,
            type: node.type + "/" + node.image.extension,
            uri: node.image.uri,
          };
        });
        setImageData(convertedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Wynn App Permission",
          message:
            "Wynn needs READ EXTERNAL STORAGE permission to access the gallery",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the storage");
        getImageData();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        openSettings();
      } else {
        console.log("READ_EXTERNAL_STORAGE permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      setRecordingStart(true);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setPauseState(false);
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setRecordingStart(false);
    setIsAudio(false);
    console.log("Recording stopped and stored at", recording);
    const item = {
      uri: uri,
      name: "audio.mp4",
      type: "audio/x-m4a",
      size: "",
    };
    const audio = JSON.stringify(item);
    dispatch(
      uploadFiles({
        file: {
          type: item?.type,
          name: item.name,
          uri:
            Platform.OS === "ios" ? item.uri?.replace("file://", "") : item.uri,
          size: item.size,
        },
        roomId: ChannelInfo.matrixRoomInfo.roomId,
        id: item.name,
      })
    );
    setUploadData([item]);
    // setAudioFile(audio);
  }
  async function pauseRecording() {
    setPauseState(true);
    const res = await recording.pauseAsync();
    setRecordingStart(false);
  }
  async function resumeRecording() {
    setRecordingStart(true);
    setPauseState(false);
    const res = await recording.startAsync();
  }
  function moveCursorAfterInsertedHTML(insertedHTML) {
    const input = richText.current;

    if (!input || !insertedHTML) {
      return;
    }
    const text = input.props.initialContentHTML;
    console.log("====free", text, insertedHTML);
    const index = text.indexOf(insertedHTML);

    if (index !== -1) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(input.firstChild, index + insertedHTML.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
  const handleAddString = () => {
    // const stringData = changedData;
    // richText.current?.insertHTML(stringData);
    // setChangedData('')

    console.log("RICH TEXT MODIFIER =====>", msg);
    if (changedData !== "") {
      const newMsg = msg.replace(regex, changedData);
      // const newMsg = msg.replace(mention[0], changedData);
      console.log("RICH TEXT MODIFIER", changedData);
      console.log("RICH TEXT MODIFIER******", newMsg);
      setMsg(newMsg);
      // richText.current?.focusContentEditor();
      setTimeout(() => {
        richText.current?.setContentHTML("");
        richText.current?.insertHTML(newMsg);
        // richText.current?.setContentHTML(newMsg);

        setTextMessage(newMsg);
        // richText.current.commandDOM(moveCursorAfterInsertedHTML(changedData))
        setChangedData("");
      }, 250);

      setTimeout(() => {
        richText.current?.focusContentEditor();
      }, 500);
    }
  };

  useEffect(() => {
    handleAddString();
  }, [changedData]);

  const UploadView = () => {
    console.log("UploadView", uploadedFiles);
    return (
      <View
        style={{
          height: 60,
          backgroundColor: "transparent",
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingVertical: 5,
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <ScrollView
          style={{
            flexDirection: "row",
            width: "85%",
            // backgroundColor: 'red',
            paddingRight: "10%",
            marginRight: 10,
            borderRadius: 5,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {uploadData.map((item: any, index: number) => {
            return item.type?.includes("image") ? (
              <Pressable
                key={index}
                style={{ alignItems: "center", justifyContent: "center" }}
                onLongPress={() =>
                  Alert.alert(
                    "Delete Upload",
                    "Do You want To Delete the Upload?",
                    [
                      {
                        text: "Cancel",
                      },
                      {
                        style: "destructive",
                        text: "Delete Upload",
                        onPress: () => {
                          setUploadData([]);
                        },
                      },
                    ]
                  )
                }
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{ height: 50, width: 50 }}
                />
                <ActivityIndicator
                  size="small"
                  color="#0000ff"
                  style={{ position: "absolute" }}
                  animating={uploadedFiles[0]?.status === "uploading"}
                />
              </Pressable>
            ) : item.type?.includes("video") && Platform.OS === "android" ? (
              <View key={index}>
                <ImageBackground
                  source={{ uri: item?.fileCopyUri ?? item?.uri }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  resizeMode="cover"
                >
                  {/* <View
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: "#3866E6",
                      padding: 1,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AntDesign name="caretright" size={8} color="#FFFFFF" />
                  </View> */}
                  <ActivityIndicator
                    size="small"
                    color="#0000ff"
                    style={{}}
                    animating={uploadedFiles[index]?.status === "uploading"}
                  />
                </ImageBackground>
              </View>
            ) : (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 15,
                  borderWidth: 3,
                  borderColor: "#CDDAED",
                  borderRadius: 5,
                  paddingLeft: 10,
                  backgroundColor: "#CDDAED",
                  shadowColor: "#CDDAED",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                {
                  {
                    // "*/*": <FontAwesome name="file" size={25} color="black" />,
                    "application/zip": (
                      <MaterialCommunityIcons
                        name="zip-box"
                        size={24}
                        color="black"
                      />
                    ),
                    "application/file": (
                      <FontAwesome name="file" size={25} color="black" />
                    ),
                    "text/plain": (
                      <AntDesign name="filetext1" size={25} color="black" />
                    ),
                    "image/*": <Entypo name="images" size={25} color="black" />,
                    "application/pdf": (
                      <FontAwesome5 name="file-pdf" size={24} color="red" />
                    ),
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                      <FontAwesome5 name="file-word" size={25} color="black" />,
                    "application/msword": (
                      <FontAwesome5 name="file-word" size={25} color="black" />
                    ),
                    "audio/*": (
                      <MaterialIcons
                        name="audiotrack"
                        size={25}
                        color="black"
                      />
                    ),
                    "video/*": (
                      <FontAwesome5 name="video" size={25} color="black" />
                    ),
                    "application/vnd.ms-excel": (
                      <MaterialCommunityIcons
                        name="microsoft-excel"
                        size={25}
                        color="black"
                      />
                    ),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                      (
                        <MaterialCommunityIcons
                          name="microsoft-excel"
                          size={25}
                          color="black"
                        />
                      ),
                    "application/vnd.ms-powerpoint": (
                      <MaterialCommunityIcons
                        name="microsoft-powerpoint"
                        size={25}
                        color="black"
                      />
                    ),
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                      (
                        <MaterialCommunityIcons
                          name="microsoft-powerpoint"
                          size={25}
                          color="black"
                        />
                      ),
                  }[item?.type]
                }
                <Text
                  numberOfLines={5}
                  style={{
                    fontSize: 14,
                    color: "blue",
                    marginLeft: 10,
                    fontWeight: "900",
                    width: 150,
                    fontFamily: "PlusJakartaSans-SemiBold",
                  }}
                  allowFontScaling
                >
                  {item.name}
                </Text>
                <Pressable
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    bottom: 3,
                    height: 20,
                    width: 20,
                    alignSelf: "flex-start",
                    left: 30,
                    opacity: 0.8,
                  }}
                  onPress={() => console.log("close")}
                >
                  <AntDesign name="closecircleo" size={15} color="black" />
                </Pressable>
                <ActivityIndicator
                  size="small"
                  color="black"
                  style={{ right: 10 }}
                  animating={uploadedFiles[index]?.status === "uploading"}
                />
              </View>
            );
          })}
        </ScrollView>
        <Ionicons
          name="send"
          size={24}
          disabled={
            !uploadedFiles.every((item: any) => item.status === "uploaded")
          }
          color={
            uploadedFiles.every((item: any) => item.status === "uploaded")
              ? "blue"
              : "black"
          }
          onPress={() => {
            setUploadData([]);
            dispatch(chatStoreActions.setUploadStatus("not loaded"));
            console.log("uploadedFiles", uploadedFiles[0].file.type);
            uploadedFiles[0].file.type.includes("image")
              ? setSelectedUrl(uploadedFiles[0])
              : setDocResult(uploadedFiles);
            dispatch(chatStoreActions.setUploadedFiles([]));
          }}
        />
      </View>
    );
  };

  return (
    <View
      style={
        Platform.OS === "ios"
          ? [styles.inputContainer, { bottom: keyboardHeight * 0.88 }]
          : styles.inputContainer
      }
    >
      {fromThread !== undefined && fromThread === false && (
        <View>{renderTypingStatus()}</View>
      )}
      <View style={styles.inputDivider}></View>
      {!isAudio ? (
        isKeyboardVisible === true ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <View style={{}}>
              <TaggingModal
                showModal={taggingModal}
                setShowModal={setTaggingModal}
                memberData={memberData}
                textMessage={textMessage}
                setTextMessage={setTextMessage}
                onDataChanged={handleDataChange}
                mention={mention}
              />
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 15,
                  alignItems: "center",
                }}
              >
                <Pressable
                  onPress={() => {
                    setTimeout(() => {
                      setShowEmoji(true);
                    }, 100);
                    try {
                      if (richText !== null && richText.current !== undefined) {
                        richText.current.blurContentEditor();
                        //console.log('log6')
                      }
                      setKeyboardVisible(false);
                    } catch (error) {
                      console.log(
                        "Oops something wrong keyboardDidHide ",
                        error
                      );
                    }
                  }}
                >
                  <MessageEmoji />
                </Pressable>
                {/*Switch user end*/}
                <Pressable
                  onPress={() => {
                    if (Platform.OS === "android") {
                      if (Platform.Version < 33) {
                        requestStoragePermission();
                      } else {
                        getImageData();
                      }
                    } else {
                      getImageDataiOS();
                      //We need to maintain for ios
                      // setImageData(photo);
                      setShowModal(true);
                    }

                    try {
                      if (richText !== null && richText.current !== undefined) {
                        richText.current.blurContentEditor();
                        //console.log('log5')
                      }
                      setKeyboardVisible(false);
                    } catch (error) {
                      console.log(
                        "Oops something wrong keyboardDidHide ",
                        error
                      );
                    }
                  }}
                  style={{
                    marginLeft: 20,
                  }}
                >
                  <Attachment />
                </Pressable>
                <View
                  style={{
                    marginLeft: 10,
                  }}
                >
                  {richText !== null &&
                    richText !== undefined &&
                    editorAttached && (
                      <RichToolbar
                        editor={richText}
                        actions={ActionList}
                        selectedButtonStyle={{
                          backgroundColor: "#FFFFFF",
                        }}
                        unselectedButtonStyle={{
                          backgroundColor: "#FFFFFF",
                        }}
                        selectedIconTint={"#000000"}
                        iconTint={"#B0B1B1"}
                        iconSize={20}
                      />
                    )}
                </View>
              </View>
              <View style={styles.inputMainView}>
                <ScrollView
                  ref={scrollViewRef}
                  style={{
                    width: "100%",
                    padding: 5,
                  }}
                >
                  {richText !== null && richText !== undefined && (
                    <RichEditor
                      ref={richText}
                      initialContentHTML={textMessage}
                      editorInitializedCallback={() => {
                        richText.current?.registerToolbar(function (items) {
                          setEditorAttached(true);
                        });
                      }}
                      onChange={(descriptionText) => {
                        // var cleanText = descriptionText.replace(/<\/?[^>]+(>|$)/g, "");
                        // cleanText = cleanText.replace(/&nbsp;/g, '');
                        // console.log("cleanText ==> ",cleanText)
                        // console.log("descriptionText ==> ",descriptionText)
                        if (
                          descriptionText !== "<div><br></div>" &&
                          descriptionText !== ""
                        ) {
                          setSendShowButton(true);
                          setTextMessage(descriptionText);
                          // setFormattedMsg(descriptionText);
                          setMsg(descriptionText);
                          const replacedText = descriptionText.replace(
                            /&nbsp;/g,
                            " "
                          );
                          const mentions = replacedText.match(regex);
                          console.log("match===>>", mentions, descriptionText);
                          const newArray = Object.keys(memberData).map(
                            (mention) => ({
                              mention: mention,
                              name: memberData[mention],
                            })
                          );
                          console.log(
                            "data====>>>",
                            newArray,
                            mention[0]?.split("@")[1]
                          );
                          const dataArray = newArray.filter(
                            (item) =>
                              item.name
                                ?.toLowerCase()
                                .includes(
                                  mentions[0]?.split("@")[1]?.toLowerCase()
                                ) && item.name !== "onetabadmin"
                          );
                          if (mentions !== null && dataArray.length > 0) {
                            setTaggingModal(true);
                            setTextMessage(descriptionText);
                            // richText.current.setContentHTML(`${descriptionText.replace(mentions[0], changedData)}`)
                            setMention(mentions);
                            // richText.current.setContentHTML(textMessage)
                            // console.log("descriptionText", textMessage);
                          } else {
                            // console.log("changed way");
                            setTaggingModal(false);
                            setMention([]);
                          }

                          dispatch(
                            sendTypingEvent(ChannelInfo.matrixRoomInfo.roomId)
                          );
                        } else {
                          setSendShowButton(false);
                          setTaggingModal(false);
                          setTextMessage("");
                          richText.current?.setContentHTML("");
                        }
                      }}
                      placeholder={"Messgae"}
                      initialFocus={isKeyboardVisible}
                      onBlur={() => {
                        //console.log("Lost focus ",richText)
                        Platform.OS !== "ios" && setKeyboardVisible(false);
                        // try {
                        //   if (
                        //     richText !== null &&
                        //     richText.current !== undefined
                        //   ) {
                        //     //console.log("Lost focus 1")
                        //     richText.current.focusContentEditor();
                        //     console.log('log7')
                        //   }
                        //   setKeyboardVisible(true);
                        // } catch (error) {
                        //   console.log(
                        //     "Oopss something wrong keyboardDidBlur",
                        //     error
                        //   );
                        // }
                      }}
                      onFocus={() => {
                        //console.log("Gain focus ",richText)
                      }}
                    />
                  )}
                </ScrollView>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
              >
                {sendShowButton === true ? (
                  <TouchableOpacity
                    style={styles.sendButtonView}
                    onPress={() => {
                      setMsgSent(!msgSent);
                      richText.current?.setContentHTML("");
                    }}
                  >
                    <View style={styles.sendButton}>
                      <MaterialIcons name="send" size={18} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.sendButtonDisable}>
                    <MaterialIcons name="send" size={18} color="#B0B1B1" />
                  </View>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View>
            {uploadData?.length > 0 && <UploadView />}
            <View style={styles.inputMainView}>
              <View style={styles.inputView}>
                <AutoHeightWebView
                  customStyle={heightStyle}
                  onError={onError}
                  onLoad={onHeightLoad}
                  onLoadStart={onHeightLoadStart}
                  onLoadEnd={onHeightLoadEnd}
                  onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                  onSizeUpdated={setHeightSize}
                  source={{
                    html:
                      textMessage === ""
                        ? `<p style="font-weight: 100;font-style: normal;font-size: 14px;">Enter here...</p>`
                        : textMessage,
                  }}
                  customScript={heightScript}
                  onMessage={(e) => {
                    //console.log("Clicked done ", e);
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    setKeyboardVisible(true);
                  }}
                  style={{
                    backgroundColor: "#FFFFFF00",
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  <View />
                </TouchableOpacity>
              </View>
              <View style={styles.attachmentView}>
                <Pressable
                  onPress={() => {
                    setShowEmoji(true);
                  }}
                >
                  <MessageEmoji />
                </Pressable>
                {/*Switch user end*/}
                <Pressable
                  onPress={() => {
                    if (Platform.OS === "android") {
                      if (Platform.Version < 33) {
                        requestStoragePermission();
                      } else {
                        getImageData();
                      }
                    } else {
                      getImageDataiOS();
                      //We need to maintain for ios
                      // setImageData(photo);
                      setShowModal(true);
                    }
                  }}
                >
                  <Attachment />
                </Pressable>
              </View>
            </View>
          </View>
        )
      ) : (
        <View style={styles.inputMainView}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",

              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Pressable onPress={recording ? stopRecording : startRecording}>
                {recording ? (
                  <Ionicons name="stop" size={24} color="red" />
                ) : (
                  <Ionicons name="play" size={24} color="green" />
                )}
              </Pressable>
              {recording && (
                <Pressable
                  style={{ marginLeft: 4, paddingHorizontal: 3 }}
                  onPress={pauseState ? resumeRecording : pauseRecording}
                >
                  {pauseState ? (
                    <Ionicons name="play" size={24} color="green" />
                  ) : (
                    <Ionicons name="pause" size={24} color="red" />
                  )}
                </Pressable>
              )}
            </View>
            <BinkingMic
              recordingStart={recordingStart}
              setRecordingStart={setRecordingStart}
              pauseState={pauseState}
              recording={recording}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginLeft: 10,
  },
  memberViewContainer: {
    width: 80,
  },
  userPic: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  userNameView: {
    width: 60,
    alignItems: "center",
  },
  userName: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#171C26",
  },
  msgUserPic: {
    width: 30,
    height: 30,
  },
  userNameViewM: {
    flexDirection: "row",
    alignItems: "center",
  },
  userNameM: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171C26",
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  dateView: {
    fontSize: 10,
    fontWeight: "600",
    color: "#B0B1B1",
    marginLeft: 5,
    justifyContent: "center",
    fontFamily: "PlusJakartaSans-Semibold",
  },
  highlightedText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#656971",
    fontFamily: "PlusJakartaSans-Regular",
  },
  emojiContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  emojiView: {
    borderRadius: 20,
    backgroundColor: "#F3F5F5",
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 10,
  },
  emoji: {
    width: 20,
    height: 20,
  },
  emojiCount: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1E1F21",
    marginLeft: 4,
  },
  addEmojiContainerView: {
    borderRadius: 20,
    backgroundColor: "#F3F5F5",
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: "center",
  },
  sectionContainer: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  timeSlotView: {
    color: "#B0B1B1",
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "PlusJakartaSans-Semibold",
    textTransform: "uppercase",
  },
  halfDivider: {
    width: "75%",
    height: 1,
    backgroundColor: "#DEDEDE",
    marginLeft: 10,
    marginRight: 20,
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
    fontWeight: "600",
    color: "#171C26",
    marginLeft: 8,
    fontFamily: "PlusJakartaSans-Semibold",
  },
  headerDetailView: {
    fontSize: 10,
    fontWeight: "400",
    color: "#171C26",
    paddingHorizontal: 40,
    paddingVertical: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#DEDEDE",
    marginTop: 4,
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
    fontFamily: "PlusJakartaSans-SemiBold",
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
  memberView: {
    paddingLeft: 20,
    marginTop: 10,
  },
  memberText: {
    color: "#171C26",
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
  },
  settingsText: {
    color: "#171C26",
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
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
    fontFamily: "PlusJakartaSans-Bold",
    paddingLeft: 10,
  },
  msgListView: {
    position: "absolute",
    bottom: 60,
    top: 60,
  },
  sectionListStyle: {
    width: "100%",
    height: "100%",
    marginBottom: 10,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#FFFFFF",
  },
  inputDivider: {
    height: 1,
    backgroundColor: "#DEDEDE",
  },
  inputMainView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  inputView: {
    width: "80%",
    padding: 10,
    backgroundColor: "#F0F4F6",
    borderRadius: 5,
  },
  sendButtonView: {
    //width: "20%",
    //flexDirection: "row",
    justifyContent: "center",
    paddingRight: 20,
  },
  sendButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#3866E6",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisable: {
    // width: "20%",
    // flexDirection: "row",
    justifyContent: "center",
    paddingRight: 20,
  },
  attachmentView: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  highlightedTextStyle: {
    backgroundColor: "#3C5DB940",
    color: "#3C5DB9",
  },
  imageView: {
    width: Dimensions.get("screen").width * 0.8,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  text: {
    color: "black",
    fontSize: 15,
    marginEnd: 100,
  },
  textMention: {
    backgroundColor: "#3C5DB940",
    color: "#3C5DB9",
  },
  textBold: {
    fontWeight: "bold",
  },
  textItalic: {
    fontStyle: "italic",
  },
  textBoldItalic: {
    fontWeight: "bold",
    fontStyle: "italic",
  },
});
