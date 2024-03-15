//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  Image,
} from "react-native";
import { RootRoutes } from "../navigation/routes";

// create a component
export const SearchBar = ({
  clicked,
  setClicked,
  searchPhrase,
  setSearchPhrase,
  navigation,
}) => {
  const inputRef = React.useRef<TextInput>(null);
  return (
    <View style={styles.container}>
      <View
        style={
          clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
        }
      >
        <Image
          source={require("../assets/icons/search.png")}
          style={styles.image}
        />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Jump to..."
          placeholderTextColor="#656971"
          value={searchPhrase}
          onChange={() => {
            inputRef.current?.blur();
            navigation.navigate(RootRoutes.Jump);
          }}
          onChangeText={setSearchPhrase}
          showSoftInputOnFocus={false}
          onFocus={() => {
            inputRef.current?.blur();
            navigation.navigate(RootRoutes.Jump);
          }}
        />
        {/* cross Icon, depending on whether the search bar is clicked or not */}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "97%",
    height: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "#656971",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "90%",
    backgroundColor: "#F3F5F5",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "d9dbda",
  },
  input: {
    fontSize: 14,
    // marginLeft: 10,
    width: "90%",
    fontFamily: "PlusJakartaSans-Regular",
  },
  image: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
});

//make this component available to the app
