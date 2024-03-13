import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Divider, SearchHeader } from "../../components";
import { Browse, Message, Recent, Cancel } from "../../assets";
import { styles } from "./styles";

export const Search = () => {
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

            <Text style={styles.textStyle}>{item.title}</Text>
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
      <MyStatusBar backgroundColor="#3866E6" />
      <SearchHeader
        clicked={clicked}
        setClicked={setClicked}
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
      />

      <View style={styles.contactSubView}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 7,
          }}
        >
          <Browse />

          <Text style={styles.presssableTextStyle}>Browse people</Text>
        </View>

        <View style={styles.contactEmailView}>
          <Message
            style={{
              marginLeft: 7,
            }}
          />

          <Text style={styles.presssableTextStyle}>Browse channels</Text>
        </View>
      </View>
      {/*Divider*/}
      <Divider />

      {/*Setting*/}

      <View style={styles.settingView}>
        <Text style={styles.settingTitle}>Recent searches</Text>
      </View>

      <FlatList
        style={styles.FlatListStyle}
        keyExtractor={(item: any) => item.title}
        data={Recents}
        renderItem={({ item, index }) => renderItem({ item })}
      />
    </View>
  );
};
