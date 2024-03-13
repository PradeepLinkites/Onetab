import {
  Text,
  StyleSheet,
  View,
  Pressable,
  Platform,
  StatusBar,
  FlatList,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "../../components";
import CheckBox from "@react-native-community/checkbox";

const DirectListData = [
  {
    id: "#321",
    name: "30 minutes",
  },
  {
    id: "#654",
    name: "1 hour",
  },
  {
    id: "#987",
    name: "2 hours",
  },
  {
    id: "#458",
    name: "Until tomorrow",
  },
];

export const Pause_Notification = () => {
  const navigation = useNavigation();
  const [checkboxState, setCheckboxState] = React.useState<string>("");

  const renderItem = (item: { id: any; name?: string }) => {
    return (
      <View
        key={item.id}
        style={{
          flexDirection: "row",
          height: 35,
          paddingHorizontal: 18,
        }}
      >
        <CheckBox
          boxType="circle"
          onChange={() => setCheckboxState(item.id)}
          value={item.id === checkboxState}
          onFillColor="#3866E6"
          onTintColor="#DADADA"
          onCheckColor="#FFFFFF"
          animationDuration={0}
          onAnimationType="bounce"
          style={{ width: 20, height: 20 }}
        />

        <Text style={styles.textstyle}> {item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headertitle}>Pause notifications</Text>
        </View>
        <Pressable style={{ padding: 2 }}>
          <Text
            style={{
              color: "#3866E6",
              fontSize: 14,
              //fontFamily: "PlusJakartaSans-SemiBold",
            }}
          >
            Save
          </Text>
        </Pressable>
      </View>
      <Divider />
      <FlatList
        data={DirectListData}
        renderItem={({ item, index }) => renderItem(item)}
        style={{ marginTop: 25 }}
      />
    </View>
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
    paddingVertical: 7,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between",
  },
  headertitle: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#171C26",
    marginLeft: 4,
  },
  textstyle: {
    //fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#171C26",
    marginLeft: "7%",
    textAlign: "justify",
    lineHeight: 18,
    fontStyle: "normal",
  },
});
