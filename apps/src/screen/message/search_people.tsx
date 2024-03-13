import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Pressable,
  TextInput,
} from "react-native";
import { Recent, Cancel, BackIcon } from "../../assets";

import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const SearchPeople = (props) => {
  const navigation = useNavigation<any>();
  const [clicked, setClicked] = React.useState(false);
  const [searchPhrase, setSearchPhrase] = React.useState("");
  const Recents = [
    {
      title: "Metaverse",
    },
    {
      title: "to: me",
    },
    {
      title: "in: #general",
    },
    {
      title: "From: Kadin Lipshutz",
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.contactEmailView}>
            <Recent />

            <Text
              style={{
                fontSize: 14,
                //fontFamily: "PlusJakartaSans-Regular",
                color: "#656971",
                marginLeft: 10,
              }}
            >
              {item.title}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
            }}
          >
            <Cancel />
          </View>
        </View>
      </>
    );
  };

  const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/*Suggestion*/}
      <MyStatusBar backgroundColor="#FFFFFF" />

      <View style={styles.searchContainer}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View
            style={{
              paddingHorizontal: 20,
            }}
          >
            <BackIcon />
          </View>
        </Pressable>
        <View style={styles.searchView}>
          <Feather
            name="search"
            size={20}
            color="#656971"
            style={{ marginLeft: 1, opacity: 0.5 }}
          />

          <TextInput
            style={styles.searchInput}
            returnKeyType={"search"}
            placeholder="In: #general"
            value={searchPhrase}
            onChangeText={setSearchPhrase}
            onFocus={() => {
              setClicked(true);
            }}
            placeholderTextColor={"#656971"}
            onSubmitEditing={(e) => console.log("pressed", e.nativeEvent.text)}
          />

          {searchPhrase.length > 0 && (
            <Pressable
              onPress={() => {
                setSearchPhrase("");
                Keyboard.dismiss();
              }}
            >
              <MaterialIcons
                name="cancel"
                size={20}
                color="#656971"
                style={{ marginLeft: 5, opacity: 0.5 }}
              />
            </Pressable>
          )}
        </View>
      </View>
      <View style={styles.settingView}>
        <Text
          style={{
            fontSize: 12,
            //fontFamily: "PlusJakartaSans-SemiBold",
            color: "#171C26",
          }}
        >
          Recent searches
        </Text>
      </View>

      <FlatList
        style={styles.settingFlat}
        keyExtractor={(item: any) => item.title}
        data={Recents}
        renderItem={({ item, index }) => renderItem({ item })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  statusBar: {
    height: StatusBar.currentHeight,
  },
  info: {
    padding: 20,
    flexDirection: "row",
  },
  userImage: {
    width: 90,
    height: 90,
  },
  status: {
    width: 15,
    height: 15,
    backgroundColor: "#5BDA15",
    borderRadius: 7.5,
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 10,
  },
  aboutView: {
    justifyContent: "center",
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E1F21",
  },
  designate: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1E1F21",
  },
  statusView: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#F3F4F6",
    height: 40,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    width: 14,
    height: 14,
    marginLeft: 10,
  },
  statusInput: {
    marginLeft: 10,
  },
  contactView: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1E1F21",
  },
  editInfo: {
    fontSize: 12,
    fontWeight: "500",
    color: "#176FFC",
  },
  contactSubView: {
    marginTop: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contactPhone: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactNumber: {
    fontSize: 14,
    fontWeight: "400",
    color: "#656971",
    marginLeft: 10,
  },
  contactEmailView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  contactEmail: {
    fontSize: 14,
    fontWeight: "400",
    color: "#656971",
    marginLeft: 10,
  },
  settingView: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1E1F21",
  },
  settingFlat: {
    paddingHorizontal: 26,
  },
  settingItemView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  settingItemTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#656971",
    marginLeft: 20,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
  },
  searchView: {
    padding: 8,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#F0F4F6",
    alignItems: "center",
    borderRadius: 5,
    marginRight: 15,
  },
  searchInput: {
    fontSize: 14,
    marginLeft: 10,
    width: "80%",
    color: "#000000",
  },
});
