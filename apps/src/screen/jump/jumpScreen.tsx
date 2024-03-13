import React from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { channelStatus, status } from "../home";
import { Divider } from "../../components";
import { styles } from "./styles";
import { SearchBar } from "./partials";
import { useSelector } from "react-redux";
import { getUserColor } from "../../../store";
const DirectListData = [
  {
    id: "#321",
    name: "Angel Aminoff",
    status: status.active,
    url: require("../../assets/images/user2.png"),
  },
  {
    id: "#654",
    name: "Wilson Vaccarohg",
    status: status.inActive,
    url: require("../../assets/images/user1.png"),
  },
  {
    id: "#987",
    name: "Tiana Levin",
    status: status.active,
    url: require("../../assets/images/user4.png"),
  },
  {
    id: "#123",
    name: "Maria Workman",
    status: status.active,
    url: require("../../assets/images/user3.png"),
  },
  {
    id: "#456",
    name: "Craig Schleifer",
    status: status.active,
    url: require("../../assets/images/user5.png"),
  },
  {
    id: "#789",
    name: "Angel Aminoff",
    status: status.active,
    url: require("../../assets/images/user2.png"),
  },
];
enum HistoryType {
  group = "group",
  individual = "individual",
  channel = "channel",
}
const HistoryListData = [
  {
    id: "#1",
    type: HistoryType.individual,
    title: "Cooper P",
    url: require("../../assets/images/user1.png"),
  },
  {
    id: "#2",
    type: HistoryType.group,
    title: "Cooper P, Tiana L, Craig Schleifer",
    number: 3,
  },
  {
    id: "#3",
    type: HistoryType.channel,
    title: "pineapple-gittyup",
    status: channelStatus.active,
  },
];

const DMList = ({ userListData, usersColor }: any) => {
  return (
    <FlatList
      data={userListData}
      style={styles.flatlistStyle}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => renderItem({ item, index, usersColor })}
      horizontal={true}
      bounces={false}
    />
  );
};
const renderItem = ({ item, index, usersColor }) => {
  let matrixId = "@" + item.matrixUsername + ":matrix.onetab.ai";
  const name: string =
    item.firstName + " " + (item.lastName === null ? "" : item.lastName);
  return (
    <View key={item._id} style={styles.flatlistContent}>
      {item?.profileImageUrl === null ? (
        <View
          style={{
            height: 55,
            width: 55,
            borderRadius: 12,
            backgroundColor: getUserColor(matrixId, usersColor),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 36,
              textTransform: "capitalize",
              color: "#ffffff",
            }}
          >
            {name.substring(0, 1)}
          </Text>
        </View>
      ) : (
        <Image
          source={
            item?.profileImageUrl !== ""
              ? { uri: item?.profileImageUrl }
              : require("../../assets/images/app_logo.png")
          }
          defaultSource={require("../../assets/images/app_logo.png")}
          style={styles.flatlistImage}
        />
      )}
      <Text style={styles.nameLabel} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );
};

const HistoryList = () => {
  return (
    <View>
      {HistoryListData.map((item, indexedDB) => (
        <View key={item.id} style={styles.historyListItem}>
          {item.type === HistoryType.individual ? (
            <>
              <Image source={item.url} style={styles.historyImage} />
              <Text style={styles.historyTitle}>{item.title}</Text>
            </>
          ) : item.type === HistoryType.group ? (
            <>
              <View style={styles.historyGroupView}>
                <Text style={styles.historyGroupNum}>{item.number}</Text>
              </View>
              <Text style={styles.historyTitle}>{item.title}</Text>
            </>
          ) : item.status === channelStatus.active ? (
            <>
              <Octicons name="hash" size={22} color="#656971" />
              <Text style={styles.historyTitle}>{item.title}</Text>
            </>
          ) : (
            <>
              <Octicons name="lock" size={25} color="#656971" />
              <Text style={styles.historyTitle}>{item.title}</Text>
            </>
          )}
        </View>
      ))}
    </View>
  );
};

export const JumpScreen = () => {
  const { userListData, matrixUserId, usersColor } = useSelector(
    (state: any) => ({
      userListData: state.userStore.userListData,
      matrixUserId: state.userStore.matrixUserId,
      usersColor: state.userStore.usersColor,
    })
  );
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/*Suggestion*/}
      <StatusBar backgroundColor="#3866E6" />
      <SearchBar navigation={navigation} />
      <ScrollView>
        <DMList
          userListData={userListData.filter(
            (item: any) =>
              "@" + item.matrixUsername + ":matrix.onetab.ai" !== matrixUserId
          )}
          usersColor={usersColor}
        />
        <Divider />
        <View style={styles.historyContentView}>
          <Text style={styles.historyHeader}>History</Text>
          <HistoryList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
