import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { DMs, Home, Mentions, Search, You, Saved } from "../screen";
import { BottomRoutes } from "./routes";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  DMActiveIcon,
  DMInactiveIcon,
  HomeActive,
  HomeInactive,
  MentionActive,
  MentionInactive,
  SearchActive,
  SearchInactive,
  YouActive,
  YouInactive,
  Icon_Saved,
  Icon_Saved_Active,
} from "../assets";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { loadString, saveString } from "../../utils/storage";
import {
  fetchCurrentWorkspace,
  getChannels,
  getInvites,
  updateUser,
} from "../../store";

export type BottomParamList = Record<keyof typeof BottomRoutes, undefined>;
export const BottomBar = (props) => {
  const Tab = createBottomTabNavigator<BottomParamList>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<Dispatch<any>>();
  const { fetchWorkspaceData, updateUserStatus, currentWorkspaceStatus } =
    useSelector((state: any) => ({
      fetchWorkspaceData: state.workspaceStore.fetchWorkspaceData,
      updateUserStatus: state.userStore.updateUserStatus,
      currentWorkspaceStatus: state.workspaceStore.currentWorkspaceStatus,
    }));
  const WorkspaceData = fetchWorkspaceData?.data?.workspaces;

  const organisationData = WorkspaceData.filter(
    (item: any, index: number) =>
      item.name + item.organizationName === props.route.name
  )[0];

  const updateOrganisation = (organizationId: any) => {
    dispatch(
      updateUser({
        activeOrganizationId: organizationId,
      })
    );
  };

  const updateCurrentWorkSpace = async () => {
    const currentWorkspaceId = await loadString("currentWorkspaceId");
    dispatch(fetchCurrentWorkspace(currentWorkspaceId));
  };

  useEffect(() => {
    {
      updateUserStatus === "loaded" && updateCurrentWorkSpace();
    }
  }, [updateUserStatus]);

  useEffect(() => {
    {
      if (currentWorkspaceStatus === "loaded") {
        dispatch(getChannels());
        dispatch(getInvites());
      }
    }
  }, [currentWorkspaceStatus]);

  const checkWorkSpace = async () => {
    const currentWorkspaceId = await loadString("currentWorkspaceId");
    if (
      currentWorkspaceId === null ||
      currentWorkspaceId === "" ||
      currentWorkspaceId !== organisationData._id
    ) {
      updateOrganisation(organisationData.organizationId);
      await saveString("currentWorkspaceId", organisationData._id);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkWorkSpace();
    }, [organisationData])
  );

  return (
    <Tab.Navigator
      initialRouteName={BottomRoutes.Home}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: false,
        tabBarActiveTintColor: "#399BAC",
        tabBarInactiveTintColor: "#BDBDBD",
        headerShown: true,
        headerStyle: { backgroundColor: "#00165F" },
        // headerStyle: { backgroundColor: "#00165F", height: 70 },
        tabBarItemStyle: {
          marginBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name={BottomRoutes.Home}
        component={Home}
        listeners={({ navigation }) => ({})}
        options={{
          tabBarAccessibilityLabel: "Home Screen",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "transparent",
            borderTopWidth: 0,
          },
          headerLeft: () => {
            return (
              <Pressable
                key={organisationData._id}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{
                  marginRight: -10,
                  marginLeft: 12,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {organisationData.organizationLogo !== " " ? (
                  <View style={styles.headerIconStyle}>
                    <Text style={styles.headername}>
                      {organisationData.name.substring(0, 1)}
                    </Text>
                  </View>
                ) : (
                  <Image
                    key={organisationData._id}
                    source={organisationData.organizationLogo}
                    style={styles.icon}
                  />
                )}
              </Pressable>
            );
          },
          headerTitleAlign: "left",
          headerTitle: () => {
            return (
              <Text key={organisationData._id} style={styles.homeHeaderTitle}>
                {organisationData.name}
              </Text>
            );
          },
          headerLeftContainerStyle: {
            alignSelf: "center",
            justifyContent: "center",
            padding: 5,
          },
          tabBarLabelStyle: {
            justifyContent: "center",
            fontFamily: "PlusJakartaSans-SemiBold",
            fontSize: 10,
          },
          tabBarActiveTintColor: "#171C26",
          tabBarInactiveTintColor: "#606363",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={require("../assets/icons/home_icon_active.png")}
                style={styles.image}
              />
            ) : (
              <Image
                source={require("../assets/icons/home_icon.png")}
                style={styles.image}
              />
            ),
        }}
      />
      <Tab.Screen
        name={BottomRoutes.Saved}
        component={Saved}
        listeners={({ navigation }) => ({})}
        options={{
          headerShown: true,
          tabBarAccessibilityLabel: "Mentions Screen",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "transparent",
            borderTopWidth: 0,
          },
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "left",
          tabBarLabelStyle: {
            justifyContent: "center",
            fontFamily: "PlusJakartaSans-SemiBold",
            fontSize: 10,
          },
          tabBarActiveTintColor: "#171C26",
          tabBarInactiveTintColor: "#606363",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={require("../assets/icons/saved_icon_active.png")}
                style={{ height: 20, width: 16 }}
              />
            ) : (
              <Image
                source={require("../assets/icons/saved_icon.png")}
                style={styles.image}
              />
            ),
        }}
      />
      <Tab.Screen
        name={BottomRoutes.You}
        component={You}
        listeners={({ navigation }) => ({})}
        options={{
          tabBarAccessibilityLabel: "You Screen",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "transparent",
            borderTopWidth: 0,
          },
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "left",
          tabBarLabelStyle: {
            justifyContent: "center",
            fontFamily: "PlusJakartaSans-SemiBold",
            fontSize: 10,
          },
          tabBarActiveTintColor: "#171C26",
          tabBarInactiveTintColor: "#606363",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <YouActive />
            ) : (
              <Image
                source={require("../assets/icons/you_icon.png")}
                style={styles.image}
              />
            ),
        }}
      />
      {/* <Tab.Screen
        name={BottomRoutes.DMs}
        component={DMs}
        listeners={({ navigation }) => ({})}
        options={{
          tabBarAccessibilityLabel: "Direct messages Screen",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "transparent",
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            justifyContent: "center",
            //fontFamily: "PlusJakartaSans-SemiBold",
            fontSize: 12.5,
            lineHeight: 16,
          },
          headerTitle: "Direct messages",
          headerTitleAlign: "left",
          headerTitleStyle: styles.headerTitle,
          tabBarActiveTintColor: "#171C26",
          tabBarInactiveTintColor: "#606363",
          tabBarIcon: ({ focused }) =>
            focused ? <DMActiveIcon /> : <DMInactiveIcon />,
        }}
      />
      <Tab.Screen
        name={BottomRoutes.Mentions}
        component={Mentions}
        listeners={({ navigation }) => ({})}
        options={{
          tabBarAccessibilityLabel: "Mentions Screen",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "transparent",
            borderTopWidth: 0,
          },
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "left",
          tabBarLabelStyle: {
            justifyContent: "center",
            //fontFamily: "PlusJakartaSans-SemiBold",
            fontSize: 12.5,
            lineHeight: 16,
          },
          tabBarActiveTintColor: "#171C26",
          tabBarInactiveTintColor: "#606363",
          tabBarIcon: ({ focused }) =>
            focused ? <MentionActive /> : <MentionInactive />,
        }}
      /> */}
      {/* <Tab.Screen
        name={BottomRoutes.Search}
        component={Search}
        listeners={({ navigation }) => ({})}
        options={{
          headerShown: false,
          tabBarAccessibilityLabel: "Search Screen",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "transparent",
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            justifyContent: "center",
            //fontFamily: "PlusJakartaSans-SemiBold",
            fontSize: 12.5,
            lineHeight: 16,
          },
          tabBarActiveTintColor: "#171C26",
          tabBarInactiveTintColor: "#606363",
          tabBarIcon: ({ focused }) =>
            focused ? <SearchActive /> : <SearchInactive />,
        }}
      /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    resizeMode: "contain",
    height: "100%",
    aspectRatio: 1,
  },
  headerTitle: {
    fontSize: 20,
    ////fontFamily: "PlusJakartaSans-Bold",
    color: "#ffffff",
  },
  homeHeaderTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#ffffff",
  },
  image: {
    width: 25,
    height: 22,
  },
  headerIconStyle: {
    height: 28,
    width: 28,
    backgroundColor: "#989898",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
  },
  headername: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#ffffff",
  },
});
