import React from "react";
import { View, StyleSheet, TextInput, Pressable, Keyboard } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

// create a component
export const SearchHeader = ({
  clicked,
  setClicked,
  searchPhrase,
  setSearchPhrase,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        {searchPhrase.length === 0 ? (
          <Feather
            name="search"
            size={20}
            color="#FFFFFF"
            style={{ marginLeft: 1, opacity: 0.5 }}
          />
        ) : (
          <Pressable
            onPress={() => {
              setSearchPhrase("");
              Keyboard.dismiss();
            }}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color="#FFFFFF"
              style={{ marginLeft: 1, opacity: 0.5 }}
            />
          </Pressable>
        )}
        <TextInput
          style={styles.input}
          returnKeyType={"search"}
          placeholder="Search for messages or files"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true);
          }}
          placeholderTextColor={"#ffffff"}
          onSubmitEditing={(e) => console.log("pressed", e.nativeEvent.text)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#3866E6",
  },
  searchBar: {
    padding: 8,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#557FF1",
    alignItems: "center",
    borderRadius: 5,
  },
  input: {
    fontSize: 14,
    marginLeft: 10,
    width: "90%",
    color: "#ffffff",
  },
});

//make this component available to the app
