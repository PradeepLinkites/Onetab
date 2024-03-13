import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import HighlightText from "@sanar/react-native-highlight-text";
import { Divider, NewMessageBubble } from "../../components";
import { styles } from "./styles";
import { NewMessageScreen } from "../newMessage";

export const Mentions = () => {
  const navigation = useNavigation<any>();
  const [modalIsTrue, setModalIsTrue] = React.useState<boolean>(false);
  const MentionsList = [
    {
      id: "1",
      mentionBy: "Wilson Vaccarohg ",
      mentionIn: "#general",
      userImage: require("../../assets/images/user1.png"),
      message:
        "Hi @Kadin Lipshutz , I hope you have already checked the build? If not",
      link: "",
      time: "2023-05-01T02:57:40Z",
    },
    {
      id: "2",
      mentionBy: "Cooper P",
      mentionIn: "#Metahole-Business",
      userImage: require("../../assets/images/user2.png"),
      message:
        "Hi @channel , I got most of the setup and teardown steps implmented",
      link: "https://metahole.com/pera-to-pear",
      time: "2023-04-29T10:57:40Z",
    },
  ];

  const hightlighted = ["@Kadin Lipshutz", "@channel"];

  const openLink = async (link) => {
    const supported = await Linking.canOpenURL(link);

    if (supported) {
      await Linking.openURL(link);
    } else {
      Alert.alert(`Don't know how to open this URL: ${link}`);
    }
  };

  const timeSince = (date) => {
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

  const renderItem = ({ item }) => {
    return (
      <>
        <View style={styles.topView}>
          {/*mention title*/}
          <TouchableOpacity
            onPress={() => {
              let aa = timeSince("2023-05-01T10:57:40Z");
              console.log("Today Date ", aa);
            }}
          >
            <View style={styles.titleView}>
              <HighlightText
                highlightStyle={{
                  //fontFamily: "PlusJakartaSans-SemiBold",
                }}
                searchWords={[item.mentionBy]}
                textToHighlight={
                  item.mentionBy + " mentioned you in " + item.mentionIn
                }
                style={styles.mentionHighLight}
              />

              <Text
                style={{
                  fontSize: 14,
                  //fontFamily: "PlusJakartaSans-Regular",
                  color: "#656971",
                  position: "absolute",
                  right: 0,
                  marginTop: 5,
                }}
              >
                {timeSince(item.time)}
              </Text>
            </View>
          </TouchableOpacity>

          {/*mention body*/}
          <View style={styles.bodyView}>
            <View style={styles.imageMainView}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                }}
                source={item.userImage}
                resizeMode="contain"
              />

              <View style={styles.status}></View>
            </View>
            <View style={styles.infoView}>
              <Text
                style={{
                  fontSize: 14,
                  //fontFamily: "PlusJakartaSans-Medium",
                  color: "#171C26",
                  marginBottom: 5,
                }}
              >
                {item.mentionBy}
              </Text>
              <HighlightText
                highlightStyle={{
                  backgroundColor: "#FFEDC0",
                  color: "#3C5DB9",
                }}
                searchWords={hightlighted}
                textToHighlight={item.message}
                style={styles.messageHighLight}
              />
              {item.link !== "" && (
                <TouchableOpacity onPress={() => openLink(item.link)}>
                  <Text
                    style={{
                      fontSize: 14,
                      //fontFamily: "PlusJakartaSans-Regular",
                      color: "#3C5DB9",
                      marginTop: 5,
                      marginBottom: 10,
                    }}
                    numberOfLines={1}
                  >
                    {item.link}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Divider />
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item: any) => item.id}
        data={MentionsList}
        renderItem={({ item, index }) => renderItem({ item })}
        bounces={false}
      />
      <NewMessageBubble setModalIsTrue={setModalIsTrue} />
      <NewMessageScreen
        modalIsTrue={modalIsTrue}
        setModalIsTrue={setModalIsTrue}
        openDirect={(item) => console.log(item)}
      />
    </View>
  );
};
