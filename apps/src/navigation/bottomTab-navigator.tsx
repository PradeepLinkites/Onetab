import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { DMs, Home, Mentions, Search, You } from "../screen";
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
        headerStyle: { backgroundColor: "#3866E6" },
        tabBarStyle: {
          elevation: 0,
          shadowOffset: { width: 0, height: 0 },
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
                style={{ padding: 3, marginRight: -10 }}
              >
                {organisationData.organizationLogo !== " " ? (
                  <View
                    style={{
                      height: "100%",
                      aspectRatio: 1,
                      backgroundColor: "#989898",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 7,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "PlusJakartaSans-ExtraBold",
                        color: "#ffffff",
                      }}
                    >
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
            //fontFamily: "PlusJakartaSans-SemiBold",
            fontSize: 12.5,
            lineHeight: 16,
          },
          tabBarActiveTintColor: "#171C26",
          tabBarInactiveTintColor: "#606363",
          tabBarIcon: ({ focused }) =>
            focused ? <HomeActive /> : <HomeInactive />,
        }}
      />
      <Tab.Screen
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
      />
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
            //fontFamily: "PlusJakartaSans-SemiBold",
            fontSize: 12.5,
            lineHeight: 16,
          },
          tabBarActiveTintColor: "#171C26",
          tabBarInactiveTintColor: "#606363",
          tabBarIcon: ({ focused }) =>
            focused ? <YouActive /> : <YouInactive />,
        }}
      />
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
});
