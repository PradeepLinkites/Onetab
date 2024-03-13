import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Divider } from "./divider";
import { CircleAdd, HelpCircle, Preferences } from "../assets";
import { RootRoutes } from "../navigation/routes";
import { AddWorkSpaceModal } from "./addWorkSpaceModal";
export const CustomDrawer = (props) => {
  const [isInvited, setIsInvited] = React.useState(false);
  const [isWorkSpaceVisible, setIsWorkSpaceVisible] = React.useState(false);
  const toggleWorkSpace = () => {
    setIsWorkSpaceVisible(!isWorkSpaceVisible);
  };
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <Text style={styles.drawerTitle}>Workspaces</Text>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.drawerMenuStyle}>
        <Divider />
        <View style={{ marginTop: 8 }}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#BCBDBD" : "white",
              },
              styles.menuItemStyle,
            ]}
            onPress={() => toggleWorkSpace()}
            // onPress={() => props.navigation.navigate(RootRoutes.AddWorkspace)}
          >
            <CircleAdd />
            <Text style={styles.menuLabelStyle}>Add a workspace</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#BCBDBD" : "white",
              },
              styles.menuItemStyle,
            ]}
          >
            <Preferences />
            <Text
              style={styles.menuLabelStyle}
              onPress={() => props.navigation.navigate(RootRoutes.Preferences)}
            >
              Preferences
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#BCBDBD" : "white",
              },
              styles.menuItemStyle,
            ]}
          >
            <HelpCircle />
            <Text style={styles.menuLabelStyle}>Help</Text>
          </Pressable>
        </View>
      </View>
      <AddWorkSpaceModal
        isVisible={isWorkSpaceVisible}
        toggle={toggleWorkSpace}
        isInvited={isInvited}
        setIsInvited={setIsInvited}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  drawerTitle: {
    fontSize: 20,
    ////fontFamily: "PlusJakartaSans-Bold",
    padding: 15,
    color: "#171C26",
  },
  drawerMenuStyle: {
    height: "23%",
  },
  menuItemStyle: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginVertical: 3,
    alignItems: "center",
  },
  menuLabelStyle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginLeft: 10,
  },
});
