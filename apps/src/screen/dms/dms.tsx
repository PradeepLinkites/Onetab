import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { NewMessageBubble, SearchBar } from "../../components";
import { status } from "../home/home";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import RenderHtml from "react-native-render-html";
import { useDispatch, useSelector } from "react-redux";
import { NewMessageScreen } from "../newMessage";
import { RootRoutes } from "../../navigation/routes";
import { getCircularReplacer, resetStatus } from "../../../store";
import { Dispatch } from "redux";
enum ChatType {
  group = "group",
  individual = "individual",
}
interface DMIndividualListType {
  id: string;
  name: string;
  userImage: any;
  message: string;
  link: string;
  time: string;
  type: ChatType.individual;
  status: status;
}
interface DMGroupListType {
  id: string;
  name: string[];
  userImage: any;
  message: string;
  link: string;
  time: string;
  type: ChatType.group;
}

const DMList: (DMIndividualListType | DMGroupListType)[] = [
  {
    id: "1",
    name: "Wilson Vaccarohg ",
    userImage: require("../../assets/images/user1.png"),
    message:
      "Hi @Kadin Lipshutz , I hope you have already checked the build? If not",
    link: "",
    time: "2023-05-01T02:57:40Z",
    type: ChatType.individual,
    status: status.active,
  },
  {
    id: "2",
    name: "Angel Aminoff",
    userImage: require("../../assets/images/user2.png"),
    message:
      "Hi @channel , I got most of the setup and teardown steps implmented",
    link: "https://metahole.com/pera-to-pear",
    time: "2023-04-29T10:57:40Z",
    type: ChatType.individual,
    status: status.inActive,
  },
  {
    id: "3",
    name: ["Cooper P", "Angel Aminoff", "Wilson Vaccarohg "],
    userImage: [
      require("../../assets/images/user1.png"),
      require("../../assets/images/user2.png"),
    ],
    message: "You: Can I get any references for this particular UI.",
    link: "https://metahole.com/pera-to-pear",
    time: "2023-04-29T10:57:40Z",
    type: ChatType.group,
  },
  {
    id: "4",
    name: "Maria Workman",
    userImage: require("../../assets/images/user3.png"),
    message: "Craig: it’s done. Please check.",
    link: "https://metahole.com/pera-to-pear",
    time: "2023-04-29T10:57:40Z",
    type: ChatType.individual,
    status: status.active,
  },
];
export const DMs = () => {
  const [directMessageList, setDirectMessageList] = React.useState<any>();
  const [modalIsTrue, setModalIsTrue] = React.useState<boolean>(false);
  const dispatch = useDispatch<Dispatch<any>>();
  const [clicked, setClicked] = React.useState(false);
  const [searchPhrase, setSearchPhrase] = React.useState("");
  const [selected, setSelected] = useState({});
  const navigation = useNavigation<any>();
  const [focus, setFocus] = React.useState(false);
  const { directMessages, channelData, matrixUserId, resetStatusKey } =
    useSelector((state: any) => ({
      directMessages: state.chatStore.directMessages,
      matrixUserId: state.userStore.matrixUserId,
      channelData: state.chatStore.channelData,
      resetStatusKey: state.chatStore.resetStatusKey,
    }));

  React.useEffect(() => {
    setDirectMessageList([...directMessages].sort((a, b) => b.ts - a.ts));
    // Use the sortedMessages array in further operations
  }, [directMessages]);
  useFocusEffect(
    React.useCallback(() => {
      setFocus(true);
      return () => {
        setFocus(false);
      };
    }, [])
  );

  const nameString = (nameAR: string[]) => {
    let name: string = "";
    for (let index = 0; index < nameAR.length; index++) {
      if (index < nameAR.length - 1) {
        name = name + nameAR[index] + ", ";
      } else {
        name = name + nameAR[index];
      }
    }
    return name;
  };
  const channelsData = channelData?.data?.data ?? [];
  let directMessageSortedData = channelsData?.channels?.filter(
    (item: any) => item?.is_direct === true
  );

  let myDirectChannels = directMessageSortedData?.filter((mychannels: any) => {
    return mychannels?.matrixRoomInfo?.members?.includes(matrixUserId);
  });

  const timeSince = (date: any) => {
    var seconds = Math.floor(
      (new Date().valueOf() - new Date(date).valueOf()) / 1000
    );
    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + "Y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + "M";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    return Math.floor(seconds) + "s";
  };
  const replaceSubString = (mainString, oldString, newString) => {
    const re = new RegExp(oldString, "g");
    var new_str = mainString.replace(re, newString);
    return new_str;
  };
  const updateText = (text) => {
    const aa = replaceSubString(text, "<p", "<div");
    const bb = replaceSubString(aa, "</p>", "</div>");
    return bb;
  };
  const openDirect = (item: any) => {
    const dataItem = JSON.stringify(item, getCircularReplacer());
    setSelected(dataItem);
    dispatch(resetStatus({}));
  };
  useEffect(() => {
    if (resetStatusKey === "loaded" && focus === true) {
      navigation.navigate(RootRoutes.Message, {
        item: selected,
      });
    }
  }, [resetStatusKey]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollStyle}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <SearchBar
          clicked={clicked}
          setClicked={setClicked}
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          navigation={navigation}
        />
        <View style={styles.contentViewStyle}>
          {directMessageList?.map((item: any, index: number) => {
            const name =
              item.type === ChatType.group ? nameString(item.name) : item.name;
            return (
              <Pressable
                key={item._id}
                style={styles.itemContainerStyle}
                onPress={() => {
                  let data = myDirectChannels?.filter(
                    (mychannels: any) =>
                      mychannels?.matrixRoomInfo?.roomId === item._id
                  );

                  openDirect(data[0]);
                }}
              >
                {item.type === ChatType.group ? (
                  <View style={styles.imageContainerStyle}>
                    <Image
                      style={styles.groupImageStyle}
                      source={item.userImage[0]}
                      resizeMode="contain"
                    />
                    <Image
                      style={[
                        styles.groupImageStyle,
                        {
                          position: "absolute",
                          alignSelf: "flex-end",
                          bottom: -4,
                        },
                      ]}
                      source={item.userImage[1]}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View style={styles.imageContainerStyle}>
                    {item.userImage === "" ? (
                      <View
                        style={{
                          width: 27,
                          height: 27,
                          backgroundColor: "#176FFC",
                          marginRight: 0,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text>{name.substring(0, 1).toUpperCase()}</Text>
                      </View>
                    ) : (
                      <Image
                        style={styles.individualImageStyle}
                        source={item.userImage}
                        defaultSource={require("../../assets/images/app_logo.png")}
                        resizeMode="contain"
                      />
                    )}
                    <View
                      style={[
                        styles.badgeStyle,
                        {
                          backgroundColor:
                            item.status === status.active
                              ? "#5BDA15"
                              : "#FF8E29",
                        },
                      ]}
                    ></View>
                  </View>
                )}
                <View style={styles.textViewStyle}>
                  <Text style={styles.nameStyle}>{name}</Text>
                  <RenderHtml
                    contentWidth={Dimensions.get("window").width}
                    source={{ html: updateText(item.content.body) }}
                    // renderersProps={{ a: { onPress } }}
                  />
                </View>
                <Text style={styles.timeStyle}> {timeSince(item.ts)}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <NewMessageBubble setModalIsTrue={setModalIsTrue} />
      <NewMessageScreen
        modalIsTrue={modalIsTrue}
        setModalIsTrue={setModalIsTrue}
        openDirect={openDirect}
      />
    </View>
  );
};
