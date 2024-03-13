import React, { memo, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import moment from "moment";
import { HtmlView } from "./html_view";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { AddEmoji } from "../../assets";
import { RootRoutes } from "../../navigation/routes";
// import {printConsole} from "@data-layer/data"

const ListComponent = (props) => {
  const {
    items,
    index,
    navigation,
    messageList,
    setCurrentItem,
    setPreviewUrl,
    setSelectPreviewType,
    setShowPreviewItem,
    setSound,
    audioPlaying,
    setAudioPlaying,
    setShowModal,
    setEvent,
    setSelectEmojiItem,
    setShowEmoji
  } = props;

  const item = items;

  // useEffect(() => {
  //   if (currentItem !== undefined) {
  //     console.log("Cuurrent iteem  ==> ");
  //   }
  // }, [currentItem]);

  async function playSound(uri) {
    setAudioPlaying(true);
    const { sound } = await Audio.Sound.createAsync({ uri: uri });
    setSound(sound);
    // printConsole("Playing Sound", sound);
    const res = await sound.playAsync();
  }
  async function pauseSound() {
    setAudioPlaying(false);
    const res = await Sound.playAsync();
  }

  const formatAMPM = (date) => {
    const formatttedDate = moment(date).format("h:mm a");
    return formatttedDate;
  };

  const formatAMPMWithDate = (date) => {
    const timeago = moment(date).diff(new Date(), "days");
    if (timeago === 0) {
      const timeFormat = moment(date).format("h:mm a");
      return timeFormat;
    } else if (timeago === -1) {
      const timeFormat = moment(date).format("h:mm a");
      return "Yesturday " + timeFormat;
    } else {
      const currentYear = moment(new Date()).year();
      const msgYear = moment(date).year();
      const timeFormat = moment(date).format("h:mm a");
      if (currentYear === msgYear) {
        const formatttedDate = moment(date).format("MMM DD");
        return formatttedDate + " " + timeFormat;
      } else {
        const formatDate = moment(date).format("ll");
        return formatDate + " " + timeFormat;
      }
    }
  };

  const splitPoints = (emojiList) => {
    const result = emojiList.reduce((accum, current) => {
      let dateGroup = accum.find((x) => x.title === current.item);
      if (!dateGroup) {
        dateGroup = { title: current.item, data: [] };
        accum.push(dateGroup);
      }
      dateGroup.data.push(current);
      return accum;
    }, []);
    // if (result.length > 0) {
    //   console.log("Split item ==> ", result[0].data);
    // }
    return result;
  };

  return (
    <>
      <View style={styles.topView}>
        {item.alreadySend === false ? (
          <View style={styles.bodyView}>
            <Pressable onPress={()=>{
              navigation.navigate(RootRoutes.User_Profile,{
              userName:item.userName,
              userImage: item.userImage,
            })}} style={styles.chatImageMainView}>
              {item.userImage === "" ? (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#3866E6",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius:5
                  }}
                >
                  {item.userName !== undefined && (
                    <Text
                      style={{
                        color: "#FFFFFF",
                        ////fontFamily: "PlusJakartaSans-Bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.userName.substring(0, 1)}
                    </Text>
                  )}
                </View>
              ) : (
                <ImageBackground
                  source={require("../../assets/images/app_logo.png")}
                  style={styles.msgUserPic}
                >
                  <Image
                    style={styles.msgUserPic}
                    source={item.userImage!==''?{ uri: item.userImage }:require("../../assets/images/app_logo.png")}
                    defaultSource={require("../../assets/images/app_logo.png")}
                    resizeMode="contain"
                  />
                </ImageBackground>
              )}

              <View style={styles.status}></View>
            </Pressable>
            <View style={styles.infoView}>
              <View style={styles.userNameViewM}>
                <Text style={styles.userNameM}>{item.userName}</Text>
                <Text style={styles.dateView}>
                  {formatAMPM(new Date(item.date))}
                </Text>
              </View>
              <View>
                {
                  {
                    join: (
                      <View>
                        <Text
                          style={{
                            color: "#DEDEDE",
                            fontSize: 14,
                            //fontFamily: "PlusJakartaSans-SemiBold",
                          }}
                        >
                          {item.message}
                        </Text>
                      </View>
                    ),
                    text: (
                      <HtmlView
                        htmltext={item.message}
                        htmlType={"message"}
                        navigation={navigation}
                        item={item}
                        messageList={messageList}
                        index={index}
                        setCurrentItem={setCurrentItem}
                        setShowOptionModal={setShowModal}
                        setEvent={setEvent}
                      />
                    ),
                    image: (
                      <TouchableOpacity
                        onPress={() => {
                          setPreviewUrl(item.image);
                          setSelectPreviewType("image");
                          setShowPreviewItem(true);
                        }}
                        onLongPress={() => {
                          setEvent(item);
                          setShowModal(true);
                        }}
                      >
                        <ImageBackground
                          source={require("../../assets/images/app_logo.png")}
                          style={styles.imageView}
                        >
                          <Image
                            source={
                              item.image !== ""
                                ? { uri: item.image }
                                : require("../../assets/images/app_logo.png")
                            }
                            style={styles.imageView}
                            resizeMode="cover"
                            // onError={(e)=>{
                            //   console.log("Image loading failed ",e)
                            // }}
                          />
                        </ImageBackground>
                      </TouchableOpacity>
                    ),
                    video: (
                      <TouchableOpacity
                        onPress={() => {
                          setPreviewUrl(item.video);
                          setSelectPreviewType("video");
                          setShowPreviewItem(true);
                        }}
                        onLongPress={() => {
                          setEvent(item);
                          setShowModal(true);
                        }}
                      >
                        <View
                          style={{
                            width: Dimensions.get("window").width * 0.8,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ImageBackground
                            source={
                              item.video !== ""
                                ? { uri: item.video }
                                : require("../../assets/images/app_logo.png")
                            }
                            style={{
                              width: Dimensions.get("screen").width * 0.8,
                              height: 200,
                              borderRadius: 10,
                              marginTop: 5,
                              justifyContent: "center",
                              alignItems: "center",
                              borderColor: "red",
                              borderWidth: 1,
                            }}
                            resizeMode="cover"
                          >
                            <View
                              style={{
                                width: 50,
                                height: 50,
                                backgroundColor: "#3866E6",
                                padding: 5,
                                borderRadius: 25,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <AntDesign
                                name="caretright"
                                size={25}
                                color="#FFFFFF"
                              />
                            </View>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    ),
                    contact: (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectPreviewType("contact");
                          setSelectedPreviewContact(item.contact);
                          setShowPreviewItem(true);
                        }}
                        onLongPress={() => {
                          setEvent(item);
                          setShowModal(true);
                        }}
                      >
                        <View
                          style={{
                            width: Dimensions.get("window").width * 0.8,
                            flexDirection: "row",
                            padding: 10,
                            backgroundColor: "#557FF1",
                            marginRight: 20,
                            borderRadius: 10,
                            marginTop: 5,
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: "#3866E6",
                                  width: 36,
                                  height: 36,
                                  borderRadius: 18,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#FFFFFF",
                                  }}
                                >
                                  {item.contact !== undefined &&
                                    item.contact.name !== undefined &&
                                    item.contact.name.substring(0, 1)}
                                </Text>
                              </View>

                              <Text
                                style={{
                                  marginLeft: 10,
                                  color: "#FFFFFF",
                                  fontSize: 14,
                                  //fontFamily: "PlusJakartaSans-Regular",
                                }}
                              >
                                {item.contact !== undefined &&
                                  item.contact.name !== undefined &&
                                  item.contact.name}
                              </Text>
                            </View>

                            <View
                              style={{
                                width: "100%",
                                height: 1,
                                backgroundColor: "#DEDEDE",
                                marginTop: 15,
                              }}
                            />
                            <View
                              style={{
                                marginTop: 5,
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: "#FFFFFF",
                                  fontSize: 14,
                                  ////fontFamily: "PlusJakartaSans-Bold",
                                }}
                              >
                                View Contact Info
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ),
                    emoji: (
                      <Text
                        style={{
                          fontSize: 40,
                        }}
                      >
                        {item.emoji}
                      </Text>
                    ),
                    document:
                      item.document !== undefined &&
                      item.document[0].type.split("/")[0] !== "image" ? (
                        item.document !== undefined &&
                        item.document[0].type.split("/")[0] !== "video" ? (
                          <TouchableOpacity
                            onPress={async () => {
                              await FileViewer.open(item.document[0].uri, {
                                showOpenWithDialog: true,
                              });
                            }}
                            onLongPress={() => {
                              setEvent(item);
                              setShowModal(true);
                            }}
                          >
                            <View
                              style={{
                                width: Dimensions.get("window").width * 0.8,
                                flexDirection: "row",
                                padding: 10,
                                backgroundColor: "#557FF1",
                                marginRight: 20,
                                borderRadius: 10,
                                marginTop: 5,
                              }}
                            >
                              <View
                                style={{
                                  width: "100%",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      marginLeft: 10,
                                      color: "#FFFFFF",
                                      fontSize: 14,
                                      //fontFamily: "PlusJakartaSans-Regular",
                                    }}
                                  >
                                    {item.document !== undefined &&
                                      item.document[0].name !== undefined &&
                                      item.document[0].name}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    width: "100%",
                                    height: 1,
                                    backgroundColor: "#DEDEDE",
                                    marginTop: 15,
                                  }}
                                />
                                <View
                                  style={{
                                    marginTop: 5,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "#FFFFFF",
                                      fontSize: 14,
                                      ////fontFamily: "PlusJakartaSans-Bold",
                                    }}
                                  >
                                    View File
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ) : (
                          item.document !== undefined && (
                            <TouchableOpacity
                              onPress={() => {
                                setPreviewUrl(item.document[0].fileCopyUri);
                                setSelectPreviewType("video");
                                setShowPreviewItem(true);
                              }}
                              onLongPress={() => {
                                setEvent(item);
                                setShowModal(true);
                              }}
                            >
                              <View
                                style={{
                                  width: Dimensions.get("window").width * 0.8,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <ImageBackground
                                  source={{
                                    uri: item.document[0].fileCopyUri,
                                  }}
                                  defaultSource={require("../../assets/images/app_logo.png")}
                                  style={{
                                    width: Dimensions.get("screen").width * 0.8,
                                    height: 200,
                                    borderRadius: 10,
                                    marginTop: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  resizeMode="cover"
                                >
                                  <View
                                    style={{
                                      width: 50,
                                      height: 50,
                                      backgroundColor: "#3866E6",
                                      padding: 5,
                                      borderRadius: 25,
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <AntDesign
                                      name="caretright"
                                      size={25}
                                      color="#FFFFFF"
                                    />
                                  </View>
                                </ImageBackground>
                              </View>
                            </TouchableOpacity>
                          )
                        )
                      ) : (
                        item.document !== undefined && (
                          <TouchableOpacity
                            onPress={() => {
                              setPreviewUrl(item.document[0].fileCopyUri);
                              setSelectPreviewType("image");
                              setShowPreviewItem(true);
                            }}
                            onLongPress={() => {
                              setEvent(item);
                              setShowModal(true);
                            }}
                          >
                            <Image
                              source={{ uri: item.document[0].fileCopyUri }}
                              style={styles.imageView}
                              defaultSource={require("../../assets/images/app_logo.png")}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        )
                      ),
                    music: (
                      <View
                        style={{
                          width: Dimensions.get("window").width * 0.8,
                          flexDirection: "row",
                          padding: 10,
                          backgroundColor: "#557FF1",
                          marginRight: 20,
                          borderRadius: 10,
                          marginTop: 5,
                        }}
                      >
                        <Pressable
                          onPress={() =>
                            audioPlaying
                              ? pauseSound()
                              : playSound(item.music.uri)
                          }
                        >
                          {audioPlaying ? (
                            <Ionicons name="ios-pause" size={24} color="red" />
                          ) : (
                            <Ionicons name="play" size={24} color="green" />
                          )}
                        </Pressable>
                        <Text
                          style={{
                            color: "#FFFFFF",
                            //fontFamily: "PlusJakartaSans-Regular",
                            fontSize: 14,
                          }}
                        >
                          {item.music?.name}
                        </Text>
                      </View>
                    ),
                  }[item.msgType]
                }
              </View>
              {/*reaction*/}
              {item.emojiArray.length > 0 && (
                <View style={styles.emojiContainer}>
                  {/* {item.emojiArray.map((emojiItem, index) => {
                    return (
                      <TouchableOpacity
                        key={emojiItem + index}
                        onPress={() => {
                          setSelectEmojiItem(emojiItem);
                        }}
                      >
                        <View style={styles.emojiView}>
                          <Text style={styles.emojiCount}>
                            {emojiItem.item}
                          </Text>
                          <Text style={styles.emojiCount}>
                            {emojiItem.userIds.length}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })} */}

                  {splitPoints(item.emojiArray).map((emojiItem, index) => {
                    return (
                      <TouchableOpacity
                        key={emojiItem + index}
                        onPress={() => {
                          setEvent(item);
                          setSelectEmojiItem(emojiItem);
                        }}
                      >
                        <View style={styles.emojiView}>
                          <Text style={styles.emojiCount}>
                            {emojiItem.title}
                          </Text>
                          <Text style={styles.emojiCount}>
                            {emojiItem.data.length}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity onPress={() => {
                     setEvent(item)
                     setShowEmoji(true)
                  }}>
                    <View style={styles.addEmojiContainerView}>
                      <AddEmoji />
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {/* Thread */}

              {item.thread !== undefined && item.thread.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(RootRoutes.MessageThread, {
                      item: JSON.stringify(item),
                    });
                  }}
                >
                  <View
                    style={{
                      borderColor: "#DEDEDE",
                      borderWidth: 1,
                      borderRadius: 5,
                      width: Dimensions.get("window").width * 0.8,
                      height: 30,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 14,
                          color: "#000000",
                          ////fontFamily: "PlusJakartaSans-Bold",
                        }}
                      >
                        {item.thread.length === 1
                          ? item.thread.length + " reply"
                          : item.thread.length + " replies"}
                      </Text>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 12,
                          color: "#DEDEDE",
                          //fontFamily: "PlusJakartaSans-SemiBold",
                        }}
                      >
                        {formatAMPMWithDate(
                          new Date(item.thread[item.thread.length - 1].date)
                        )}
                      </Text>
                    </View>
                    <Text
                      style={{
                        marginRight: 10,
                        fontSize: 12,
                        color: "#000000",
                        //fontFamily: "PlusJakartaSans-SemiBold",
                      }}
                    >
                      View Thread
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.bodyViewElse}>
            <View>
              {
                {
                  join: (
                    <View>
                      <Text
                        style={{
                          color: "#DEDEDE",
                          fontSize: 14,
                          //fontFamily: "PlusJakartaSans-SemiBold",
                        }}
                      >
                        {item.message}
                      </Text>
                    </View>
                  ),
                  text: (
                    <HtmlView
                      htmltext={item.message}
                      htmlType={"message"}
                      navigation={navigation}
                      item={item}
                      messageList={messageList}
                      index={index}
                      setCurrentItem={setCurrentItem}
                      setShowOptionModal={setShowModal}
                      setEvent={setEvent}
                    />
                  ),
                  image: (
                    <TouchableOpacity
                      onPress={() => {
                        setPreviewUrl(item.image);
                        setSelectPreviewType("image");
                        setShowPreviewItem(true);
                      }}
                      onLongPress={() => {
                        setEvent(item);
                        setShowModal(true);
                      }}
                    >
                      <ImageBackground
                        source={require("../../assets/images/app_logo.png")}
                        style={styles.imageView}
                      >
                        <Image
                          source={
                            item.image !== ""
                              ? { uri: item.image }
                              : require("../../assets/images/app_logo.png")
                          }
                          style={styles.imageView}
                          resizeMode="cover"
                        />
                      </ImageBackground>
                    </TouchableOpacity>
                  ),
                  video: (
                    <TouchableOpacity
                      onPress={() => {
                        setPreviewUrl(item.video);
                        setSelectPreviewType("video");
                        setShowPreviewItem(true);
                      }}
                      onLongPress={() => {
                        setEvent(item);
                        setShowModal(true);
                      }}
                    >
                      <View
                        style={{
                          width: Dimensions.get("window").width * 0.8,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ImageBackground
                          source={
                            item.video !== ""
                              ? { uri: item.video }
                              : require("../../assets/images/app_logo.png")
                          }
                          style={{
                            width: Dimensions.get("screen").width * 0.8,
                            height: 200,
                            borderRadius: 10,
                            marginTop: 5,
                            justifyContent: "center",
                            alignItems: "center",
                            borderColor: "red",
                            borderWidth: 1,
                          }}
                          resizeMode="cover"
                        >
                          <View
                            style={{
                              width: 50,
                              height: 50,
                              backgroundColor: "#3866E6",
                              padding: 5,
                              borderRadius: 25,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <AntDesign
                              name="caretright"
                              size={25}
                              color="#FFFFFF"
                            />
                          </View>
                        </ImageBackground>
                      </View>
                    </TouchableOpacity>
                  ),
                  contact: (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectPreviewType("contact");
                        setSelectedPreviewContact(item.contact);
                        setShowPreviewItem(true);
                      }}
                      onLongPress={() => {
                        setEvent(item);
                        setShowModal(true);
                      }}
                    >
                      <View
                        style={{
                          width: Dimensions.get("window").width * 0.8,
                          flexDirection: "row",
                          padding: 10,
                          backgroundColor: "#557FF1",
                          marginRight: 20,
                          borderRadius: 10,
                          marginTop: 5,
                        }}
                      >
                        <View
                          style={{
                            width: "100%",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: "#3866E6",
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: "#FFFFFF",
                                }}
                              >
                                {item.contact !== undefined &&
                                  item.contact.name !== undefined &&
                                  item.contact.name.substring(0, 1)}
                              </Text>
                            </View>

                            <Text
                              style={{
                                marginLeft: 10,
                                color: "#FFFFFF",
                                fontSize: 14,
                                //fontFamily: "PlusJakartaSans-Regular",
                              }}
                            >
                              {item.contact !== undefined &&
                                item.contact.name !== undefined &&
                                item.contact.name}
                            </Text>
                          </View>

                          <View
                            style={{
                              width: "100%",
                              height: 1,
                              backgroundColor: "#DEDEDE",
                              marginTop: 15,
                            }}
                          />
                          <View
                            style={{
                              marginTop: 5,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: "#FFFFFF",
                                fontSize: 14,
                                ////fontFamily: "PlusJakartaSans-Bold",
                              }}
                            >
                              View Contact Info
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ),
                  emoji: (
                    <Text
                      style={{
                        fontSize: 40,
                      }}
                    >
                      {item.emoji}
                    </Text>
                  ),
                  document:
                    item.document !== undefined &&
                    item.document[0].type.includes("image")  ? (
                      item.document !== undefined &&
                      item.document[0].type.split("/")[0] !== "video" ? (
                        <TouchableOpacity
                          onPress={async () => {
                            // printConsole("File url ==> ", item.document[0].uri);
                            await FileViewer.open(item.document[0].uri, {
                              showOpenWithDialog: true,
                            });
                          }}
                          onLongPress={() => {
                            setEvent(item);
                            setShowModal(true);
                          }}
                        >
                          <View
                            style={{
                              width: Dimensions.get("window").width * 0.8,
                              flexDirection: "row",
                              padding: 10,
                              backgroundColor: "#557FF1",
                              marginRight: 20,
                              borderRadius: 10,
                              marginTop: 5,
                            }}
                          >
                            <View
                              style={{
                                width: "100%",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    marginLeft: 10,
                                    color: "#FFFFFF",
                                    fontSize: 14,
                                    //fontFamily: "PlusJakartaSans-Regular",
                                  }}
                                >
                                  {item.document !== undefined &&
                                    item.document[0].name !== undefined &&
                                    item.document[0].name}
                                </Text>
                              </View>

                              <View
                                style={{
                                  width: "100%",
                                  height: 1,
                                  backgroundColor: "#DEDEDE",
                                  marginTop: 15,
                                }}
                              />
                              <View
                                style={{
                                  marginTop: 5,
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#FFFFFF",
                                    fontSize: 14,
                                    ////fontFamily: "PlusJakartaSans-Bold",
                                  }}
                                >
                                  View File
                                </Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        item.document !== undefined && (
                          <TouchableOpacity
                            onPress={() => {
                              setPreviewUrl(item.document[0].fileCopyUri);
                              setSelectPreviewType("video");
                              setShowPreviewItem(true);
                            }}
                            onLongPress={() => {
                              setEvent(item);
                              setShowModal(true);
                            }}
                          >
                            <View
                              style={{
                                width: Dimensions.get("window").width * 0.8,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <ImageBackground
                                source={{ uri: item.document[0].fileCopyUri }}
                                defaultSource={require("../../assets/images/app_logo.png")}
                                style={{
                                  width: Dimensions.get("screen").width * 0.8,
                                  height: 200,
                                  borderRadius: 10,
                                  marginTop: 5,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                resizeMode="cover"
                              >
                                <View
                                  style={{
                                    width: 50,
                                    height: 50,
                                    backgroundColor: "#3866E6",
                                    padding: 5,
                                    borderRadius: 25,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <AntDesign
                                    name="caretright"
                                    size={25}
                                    color="#FFFFFF"
                                  />
                                </View>
                              </ImageBackground>
                            </View>
                          </TouchableOpacity>
                        )
                      )
                    ) : (
                      item.document !== undefined && (
                        <TouchableOpacity
                          onPress={() => {
                            setPreviewUrl(item.document[0].fileCopyUri);
                            setSelectPreviewType("image");
                            setShowPreviewItem(true);
                          }}
                          onLongPress={() => {
                            setEvent(item);
                            setShowModal(true);
                          }}
                        >
                          <Image
                            source={{ uri: item.document[0].fileCopyUri }}
                            defaultSource={require("../../assets/images/app_logo.png")}
                            style={styles.imageView}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      )
                    ),
                  music: (
                    <View
                      style={{
                        width: Dimensions.get("window").width * 0.8,
                        flexDirection: "row",
                        padding: 10,
                        backgroundColor: "#557FF1",
                        marginRight: 20,
                        borderRadius: 10,
                        marginTop: 5,
                      }}
                    >
                      <Pressable
                        onPress={() =>
                          audioPlaying
                            ? pauseSound()
                            : playSound(item.music.uri)
                        }
                      >
                        {audioPlaying ? (
                          <Ionicons name="ios-pause" size={24} color="red" />
                        ) : (
                          <Ionicons name="play" size={24} color="green" />
                        )}
                      </Pressable>
                      <Text
                        style={{
                          color: "#FFFFFF",
                          //fontFamily: "PlusJakartaSans-Regular",
                          fontSize: 14,
                        }}
                      >
                        {item.music?.name}
                      </Text>
                    </View>
                  ),
                }[item.msgType]
              }
            </View>
            {/*reaction*/}
            {item.emojiArray.length > 0 && (
              <View style={styles.emojiContainer}>
                {/* {item.emojiArray.map((emojiItem, index) => {
                  return (
                    <TouchableOpacity
                      key={emojiItem + index}
                      onPress={() => {
                        setSelectEmojiItem(emojiItem);
                      }}
                    >
                      <View style={styles.emojiView}>
                        <Text style={styles.emojiCount}>{emojiItem.item}</Text>
                        <Text style={styles.emojiCount}>
                          {emojiItem.userIds.length}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })} */}

                {splitPoints(item.emojiArray).map((emojiItem, index) => {
                  return (
                    <TouchableOpacity
                      key={emojiItem + index}
                      onPress={() => {
                        setEvent(item);
                        setSelectEmojiItem(emojiItem);
                      }}
                    >
                      <View style={styles.emojiView}>
                        <Text style={styles.emojiCount}>{emojiItem.title}</Text>
                        <Text style={styles.emojiCount}>
                          {emojiItem.data.length}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity onPress={() => {
                  setEvent(item)
                  setShowEmoji(true)
                }}>
                  <View style={styles.addEmojiContainerView}>
                    <AddEmoji />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Thread */}

            {item.thread !== undefined && item.thread.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(RootRoutes.MessageThread, {
                    item: JSON.stringify(item),
                  });
                }}
              >
                <View
                  style={{
                    borderColor: "#DEDEDE",
                    borderWidth: 1,
                    borderRadius: 5,
                    width: Dimensions.get("window").width * 0.8,
                    height: 30,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 14,
                        color: "#000000",
                        ////fontFamily: "PlusJakartaSans-Bold",
                      }}
                    >
                      {item.thread.length === 1
                        ? item.thread.length + " reply"
                        : item.thread.length + " replies"}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 12,
                        color: "#DEDEDE",
                        //fontFamily: "PlusJakartaSans-SemiBold",
                      }}
                    >
                      {formatAMPMWithDate(
                        new Date(item.thread[item.thread.length - 1].date)
                      )}
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginRight: 10,
                      fontSize: 12,
                      color: "#000000",
                      //fontFamily: "PlusJakartaSans-SemiBold",
                    }}
                  >
                    View Thread
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginTop: Platform.OS === "android" ? 0 : 10,
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
    //fontFamily: "PlusJakartaSans-Regular",
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
    //fontFamily: "PlusJakartaSans-Regular",
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
    //fontFamily: "PlusJakartaSans-SemiBold",
    textTransform: "capitalize",
  },
  dateView: {
    fontSize: 10,
    fontWeight: "600",
    color: "#B0B1B1",
    marginLeft: 5,
    justifyContent: "center",
    //fontFamily: "PlusJakartaSans-Semibold",
  },
  highlightedText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#656971",
    //fontFamily: "PlusJakartaSans-Regular",
  },
  emojiContainer: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "center",
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
  imageView: {
    width: Dimensions.get("screen").width * 0.8,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
});

// const equal = (prev, next) => {
//   if (JSON.stringify(prev.items) !== JSON.stringify(next.items)) {
//     return false;
//   }
//   return true;
// };

// const equal = (prev, next) => {
//   if (prev.items.item.date.toISOString() !== next.items.item.date.toISOString()) {
//     return false;
//   }
//   return true;
// };

// const equal = (prev, next) => {
//   if (prev.items.eventId !== next.items.eventId) {
//     return false;
//   }
//   return true;
// };

const equal = (prev, next) => {
  if (_.isEqual(prev.items, next.items)) {
    //console.log("ListComponent equal 1 ",prev.items.eventId,next.items.eventId)
    return true;
  }
  //console.log("ListComponent equal 2 ",prev.items.eventId,next.items.eventId)
  return false;
};

// const equal = (prev, next) => {
//   if (prev.items.thread.length === next.items.length) {
//     console.log("ListComponent 1")
//     return false;
//   }
//   console.log("ListComponent 2")
//   return true;
// };

// const equal = (prev, next) => {

//   if (prev.items.thread.length === next.items.thread.length) {
//     return true;
//   }
//   return false;
// };

// export default memo(ListComponent, equal);

const areEqual = (prevProps, nextProps) => {
  if (prevProps === nextProps) {
    return true;
  }
  return false;
};

export default memo(ListComponent);
