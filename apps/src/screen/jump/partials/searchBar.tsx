import React from "react";
import { View, Pressable, Keyboard, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";

export const SearchBar = ({ navigation }) => {
  const [searchPhrase, setSearchPhrase] = React.useState("");
  return (
    <View style={styles.headerContainer}>
      <Pressable
        onPress={() => {
          navigation.goBack();
          setSearchPhrase("");
          Keyboard.dismiss();
        }}
      >
        <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
      </Pressable>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          returnKeyType={"search"}
          placeholder="Jump to..."
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          placeholderTextColor={"#ffffff"}
          autoFocus={true}
          onSubmitEditing={(e) => console.log("pressed", e.nativeEvent.text)}
          cursorColor={"#ffffff"}
        />
      </View>
    </View>
  );
};

export default SearchBar;
