import {
  Text,
  StyleSheet,
  View,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { Divider } from "../../components";

export const AddWorkspace = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{ padding: 2 }}
        >
          <Ionicons name="chevron-back" size={26} color="#171C26" />
        </Pressable>
        <Text style={styles.headertitle}>Add Workspaces</Text>
      </View>
      <Divider />
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 12,
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 15,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="mail-outline" size={24} color="black" />
          <Text style={styles.mail}>Xyz@gmail.com</Text>
        </View>
        <Pressable>
          <Ionicons name="information-circle-outline" size={24} color="black" />
        </Pressable>
      </View>
      <View
        style={{
          paddingVertical: 3,
          paddingHorizontal: 15,
        }}
      >
        <Text style={styles.textStyle}>
          You're signed in to all of the workspaces for this email address.
        </Text>
        <View
          style={{
            marginVertical: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Octicons
            name="plus"
            size={22}
            color="#171C26"
            style={{
              paddingHorizontal: 10,
            }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.textStyle, { fontSize: 14 }]}>
              Other workspaces you can join
            </Text>
            <Text style={[styles.textStyle, { fontSize: 12 }]}>
              16 workspaces
            </Text>
          </View>
        </View>
      </View>
      <Divider />
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 15,
        }}
      >
        <Text
          style={[
            {
              fontSize: 14,
              ////fontFamily: "PlusJakartaSans-Bold",
              color: "black",
            },
          ]}
        >
          Not the workspaces you're looking for?
        </Text>
        <Pressable
          style={{
            flexDirection: "row",
            marginTop: 12,
            paddingVertical: 7,
            paddingHorizontal: 4,
          }}
        >
          <Octicons name="sign-in" size={22} color="black" />
          <Text style={styles.buttonText}>Sign in to another workspace</Text>
        </Pressable>
        <Pressable style={{ flexDirection: "row", paddingVertical: 7 }}>
          <Ionicons name="person-add-outline" size={22} color="black" />
          <Text style={styles.buttonText}>Sign in to another workspace</Text>
        </Pressable>
        <Pressable
          style={{
            flexDirection: "row",
            paddingVertical: 7,
            paddingHorizontal: 6,
          }}
        >
          <Octicons name="plus" size={22} color="#171C26" />
          <Text style={styles.buttonText}>Sign in to another workspace</Text>
        </Pressable>
      </View>
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
  },
  headertitle: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
    color: "#171C26",
    marginLeft: 4,
  },
  mail: {
    fontSize: 14,
    color: "#171C26",
    //fontFamily: "PlusJakartaSans-SemiBold",
    marginLeft: 16,
  },
  textStyle: {
    fontSize: 15,
    color: "#171C26",
    //fontFamily: "PlusJakartaSans-SemiBold",
  },
  buttonText: {
    fontSize: 14,
    color: "#171C26",
    //fontFamily: "PlusJakartaSans-SemiBold",
    marginLeft: 10,
    paddingHorizontal: 5,
  },
});
