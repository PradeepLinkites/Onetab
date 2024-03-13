import {
  View,
  Text,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Image,
  ImageBackground,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AntDesign, Octicons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { fetchThreadMessages, resetRoom } from "../../../store";
import moment from "moment";
import { AddEmoji, BackIcon } from "../../assets";
import { HtmlView } from "../message/html_view";
import { Divider } from "../../components";
import { RootRoutes } from "../../navigation/routes";
import { useNavigation } from "@react-navigation/native";

var roomArray: any = [];
export const Threads = () => {
  const dispatch = useDispatch<Dispatch<any>>();
  const navigation = useNavigation<any>();

  const [updateWorkSpace, setUpdateWorkSpace] = React.useState<boolean>(true);
  const [messageList, setMessagesList] = useState<any>([]);
  const [loaderVisible, setLoaderVisible] = React.useState<boolean>(false);
  const [channelsInfo, setChannelsInfo] = useState<any>();

  const {
    channelData,
    updateUserStatus,
    matrixUserId,
    threadMessageStatus,
    threadmessageList,
  } = useSelector((state: any) => ({
    channelData: state.chatStore.channelData,
    updateUserStatus: state.userStore.updateUserStatus,
    matrixUserId: state.userStore.matrixUserId,
    threadMessageStatus: state.chatStore.threadMessageStatus,
    threadmessageList: state.chatStore.threadmessageList,
  }));

  const loadMore = () => {
    dispatch(fetchThreadMessages(roomArray));
  };

  const sortData = (items) => {
    const copy = JSON.parse(JSON.stringify(items));
    copy.sort((a, b) => {
      const dateA: any = new Date(a.thread[a.thread.length - 1].date);
      const dateB: any = new Date(b.thread[b.thread.length - 1].date);
      return dateA - dateB;
    });
    return copy;
  };

  const filterData = (channelInfo: any, roomId: any) => {
    const aa = channelInfo.filter((item) => item.matrixRoomId === roomId);
    if (aa.length > 0) {
      return aa[0];
    }
  };

  const splitData = (input) => {
    const bb = sortData(input);
    const reverseList = bb.reverse();
    reverseList.map((item) => {
      const filterItem: any = filterData(channelsInfo, item.roomId);
      item.roomName =
        filterItem.is_direct === true
          ? getUserNameForDirectMessage(filterItem)
          : filterItem.name;
      item.isDirect = filterItem.is_direct;
    });
    setLoaderVisible(false);
    setMessagesList(reverseList);
  };

  useEffect(() => {
    if (threadMessageStatus === "loaded") {
      splitData(threadmessageList);
    }
  }, [threadMessageStatus]);

  useEffect(() => {
    if (updateWorkSpace === true) {
      if (
        channelData.data !== undefined &&
        channelData.data.data !== undefined
      ) {
        const channelListing = channelData.data.data.channels;
        let myDirectChannels = channelListing?.filter((mychannels: any) => {
          return mychannels?.matrixRoomInfo?.members?.includes(matrixUserId);
        });

        setChannelsInfo(myDirectChannels);
        roomArray = [];
        myDirectChannels.map((item: any) => {
          roomArray.push(item.matrixRoomId);
        });
        setLoaderVisible(true);
        dispatch(fetchThreadMessages(roomArray));
      }
    }
  }, [channelData]);

  useEffect(() => {
    if (updateUserStatus === "not loaded" || updateUserStatus === "loaded") {
      setUpdateWorkSpace(true);
    } else if (updateUserStatus === "loading") {
      setUpdateWorkSpace(false);
    }
  }, [updateUserStatus]);

  const formatAMPMWithDate = (date) => {
    //console.log("Thread date ==> ", date);
    var today = new Date();
    var isToday = today.toDateString() == date.toDateString();
    if (isToday === true) {
      const timeFormat = moment(date).format("h:mm a");
      return timeFormat;
    } else {
      const currentYear = moment(new Date()).year();
      const msgYear = moment(date).year();
      const timeFormat = moment(date).format("h:mm a");
      if (currentYear === msgYear) {
        const formatttedDate = moment(date).format("MMM DD");
        return formatttedDate + " at " + timeFormat;
      } else {
        const formatDate = moment(date).format("ll");
        return formatDate + " at " + timeFormat;
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
    return result;
  };

  const getUserNameForDirectMessage = (item) => {
    if (item !== null && item.matrixRoomEvent != null) {
      const myUserId = item.matrixRoomEvent.myUserId;
      var otherUserId = "";
      item.matrixRoomInfo.members.map((items) => {
        if (items !== myUserId) {
          otherUserId = items;
        }
      });
      try {
        const otherUserName = item.matrixRoomInfo.membersInfo[otherUserId];
        return otherUserName;
      } catch (error) {
        return "Direct Message";
      }
    }
    return "Direct Message";
  };

  const sliceThreadArray = (threads) => {
    const slices = threads.slice(threads.length - 3, threads.length);
    return slices;
  };

  const renderThreadItem = ({ items, index }) => {
    const item = items;
    return (
      <>
        <View key={item.eventId} style={styles.topView}>
          <View style={styles.bodyView}>
            <View style={styles.chatImageMainView}>
              {item.userImage === "" ? (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#3866E6",
                    justifyContent: "center",
                    alignItems: "center",
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
                    source={{ uri: item.userImage }}
                    resizeMode="contain"
                  />
                </ImageBackground>
              )}

              <View style={styles.status}></View>
            </View>
            <View style={styles.infoView}>
              <View style={styles.userNameViewM}>
                <Text style={styles.userNameM}>{item.userName}</Text>
                <Text style={styles.dateView}>
                  {formatAMPMWithDate(new Date(item.date))}
                </Text>
              </View>
              <View>
                {
                  {
                    text: (
                      <HtmlView
                        htmltext={item.message}
                        htmlType={"mainThread"}
                      />
                    ),
                    image: (
                      <View>
                        <Image
                          source={{ uri: item.image }}
                          style={styles.imageView}
                          resizeMode="cover"
                        />
                      </View>
                    ),
                    video: (
                      <View>
                        <View
                          style={{
                            width: Dimensions.get("window").width * 0.8,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ImageBackground
                            source={{ uri: item.video }}
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
                      </View>
                    ),
                    contact: (
                      <View>
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
                      </View>
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
                          <View>
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
                          </View>
                        ) : (
                          item.document !== undefined && (
                            <View>
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
                            </View>
                          )
                        )
                      ) : (
                        item.document !== undefined && (
                          <View>
                            <Image
                              source={{ uri: item.document[0].fileCopyUri }}
                              style={styles.imageView}
                              resizeMode="cover"
                            />
                          </View>
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
                        <Text>{item.music?.name}</Text>
                      </View>
                    ),
                  }[item.msgType]
                }
              </View>
              {/*reaction*/}
              {item.emojiArray.length > 0 && (
                <View style={styles.emojiContainer}>
                  {splitPoints(item.emojiArray).map((emojiItem, index) => {
                    return (
                      <View key={emojiItem + index}>
                        <View style={styles.emojiView}>
                          <Text style={styles.emojiCount}>
                            {emojiItem.title}
                          </Text>
                          <Text style={styles.emojiCount}>
                            {emojiItem.data.length}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                  <View>
                    <View style={styles.addEmojiContainerView}>
                      <AddEmoji />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        <View
          key={item.eventId}
          style={[
            styles.topView,
            {
              marginTop: 20,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 20,
              alignItems: "center",
            }}
          >
            {item.isDirect === true ? (
              <View></View>
            ) : (
              <Octicons
                name="lock"
                size={14}
                color="#000000"
                style={{
                  marginEnd: 5,
                  marginTop: 3,
                }}
              />
            )}

            <View style={{}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#000000",
                  ////fontFamily: "PlusJakartaSans-Bold",
                }}
              >
                {item.roomName}
              </Text>
            </View>
          </View>

          <View style={styles.bodyView}>
            <View style={styles.chatImageMainView}>
              {item.userImage === "" ? (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#3866E6",
                    justifyContent: "center",
                    alignItems: "center",
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
                    source={{ uri: item.userImage }}
                    resizeMode="contain"
                  />
                </ImageBackground>
              )}

              <View style={styles.status}></View>
            </View>
            <View style={styles.infoView}>
              <View style={styles.userNameViewM}>
                <Text style={styles.userNameM}>{item.userName}</Text>
                <Text style={styles.dateView}>
                  {formatAMPMWithDate(new Date(item.date))}
                </Text>
              </View>
              <View>
                {
                  {
                    text: (
                      <HtmlView
                        htmltext={item.message}
                        htmlType={"mainThread"}
                      />
                    ),
                    image: (
                      <View>
                        <Image
                          source={{ uri: item.image }}
                          style={styles.imageView}
                          resizeMode="cover"
                        />
                      </View>
                    ),
                    video: (
                      <View>
                        <View
                          style={{
                            width: Dimensions.get("window").width * 0.8,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ImageBackground
                            source={{ uri: item.video }}
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
                      </View>
                    ),
                    contact: (
                      <View>
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
                      </View>
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
                          <View>
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
                          </View>
                        ) : (
                          item.document !== undefined && (
                            <View>
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
                            </View>
                          )
                        )
                      ) : (
                        item.document !== undefined && (
                          <View>
                            <Image
                              source={{ uri: item.document[0].fileCopyUri }}
                              style={styles.imageView}
                              resizeMode="cover"
                            />
                          </View>
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
                        <Text>{item.music?.name}</Text>
                      </View>
                    ),
                  }[item.msgType]
                }
              </View>
              {/*reaction*/}
              {item.emojiArray.length > 0 && (
                <View style={styles.emojiContainer}>
                  {splitPoints(item.emojiArray).map((emojiItem, index) => {
                    return (
                      <View key={emojiItem + index}>
                        <View style={styles.emojiView}>
                          <Text style={styles.emojiCount}>
                            {emojiItem.title}
                          </Text>
                          <Text style={styles.emojiCount}>
                            {emojiItem.data.length}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                  <View>
                    <View style={styles.addEmojiContainerView}>
                      <AddEmoji />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 5,
            }}
          >
            <Divider />
          </View>

          <View>
            {/* Thread */}

            {item.thread.length > 0 && (
              <View>
                {item.thread.length > 3 ? (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(resetRoom({}));
                        navigation.navigate(RootRoutes.MessageThread, {
                          item: JSON.stringify(item),
                        });
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: 20,
                          fontSize: 12,
                          ////fontFamily: "PlusJakartaSans-Bold",
                          color: "#3866E6",
                        }}
                      >
                        {"Show " + (item.thread.length - 3) + " more replies"}
                      </Text>
                    </TouchableOpacity>

                    {sliceThreadArray(item.thread).map((threadItem, index) => {
                      return (
                        <View key={threadItem + index}>
                          {renderThreadItem({
                            items: threadItem,
                            index: index,
                          })}
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View>
                    {item.thread.map((threadItem, index) => {
                      return (
                        <View key={threadItem + index}>
                          {renderThreadItem({
                            items: threadItem,
                            index: index,
                          })}
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              dispatch(resetRoom({}));
              navigation.navigate(RootRoutes.MessageThread, {
                item: JSON.stringify(item),
              });
            }}
          >
            <View
              style={{
                backgroundColor: "#FFFFFF",
                paddingTop: 10,
                paddingStart: 60,
                paddingBottom: 10,
              }}
            >
              <View
                style={{
                  borderColor: "#3866E6",
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingHorizontal: 20,
                  paddingVertical: 3,
                  alignSelf: "flex-start",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    ////fontFamily: "PlusJakartaSans-Bold",
                    color: "#3866E6",
                  }}
                >
                  Reply
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        {/*Header*/}
        <View>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 7,
                paddingVertical: 7,
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <BackIcon />
            </TouchableOpacity>

            <View style={styles.headerLeftView}>
              <Text style={styles.headerTitle}>Threads</Text>
            </View>
          </View>

          <View style={styles.divider}></View>
        </View>

        {/*Message List view*/}
        <View
          style={{
            backgroundColor: "#F0F4F6",
            marginTop: 60,
            bottom: 60,
          }}
        >
          {messageList.length > 0 && (
            <FlatList
              data={messageList}
              style={{
                width: "100%",
                height: "100%",
              }}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item, index }) =>
                renderItem({ item: item, index: index })
              }
              onEndReached={() => {
                setLoaderVisible(true);
                loadMore();
              }}
              windowSize={1000}
              maxToRenderPerBatch={50}
              nestedScrollEnabled
            />
          )}
        </View>

        {loaderVisible === true ? (
          <View
            style={{
              width: "100%",
              alignItems: "center",
              position: "absolute",
              bottom: 15,
            }}
          >
            <View
              style={{
                backgroundColor: "#3866E6",
                paddingHorizontal: 10,
                paddingVertical: 5,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  //fontFamily: "PlusJakartaSans-Regular",
                }}
              >
                Loading....
              </Text>
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </SafeAreaView>
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
    backgroundColor: "#FFFFFF",
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
  },
  dateView: {
    fontSize: 10,
    fontWeight: "600",
    color: "#B0B1B1",
    marginLeft: 5,
    marginTop: 5,
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
  sectionContainer: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  timeSlotView: {
    color: "#B0B1B1",
    fontSize: 10,
    fontWeight: "600",
    //fontFamily: "PlusJakartaSans-Semibold",
    textTransform: "uppercase",
  },
  halfDivider: {
    width: "80%",
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
    //fontFamily: "PlusJakartaSans-Semibold",
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
    //flexGrow: 1,
    //justifyContent: "flex-end",
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
    //justifyContent: "center",
    paddingRight: 20,
  },
  sendButton: {
    width: 22,
    height: 22,
    borderRadius: 12,
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
  headerSubtitle: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#3C5DB9",
    marginLeft: 4,
  },
  headertitle: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#171C26",
    marginLeft: 4,
  },
  replyThread: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#171C26",
    marginLeft: 10,
  },
});
