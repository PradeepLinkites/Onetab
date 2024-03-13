import React, { useEffect, useState } from "react";
import { Image, StyleSheet, useWindowDimensions } from "react-native";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AddPeople,
  ChannelMessage,
  JumpScreen,
  DirectMessage,
  SignIn,
  Verification_Screen,
  NewChannnel,
  Saved,
  ChannnelInfo,
  MessageThreads,
  AddWorkspace,
  Preferences,
  SignUp,
  EditProfile,
  Pause_Notification,
  SearchPeople,
  CreateworkSpace,
  UserProfile,
  SplashScreen,
  TermsAndUseWebVeiw,
  Threads,
} from "../screen";
import { DrawerNavigator } from "./drawer-navigator";
import { RootRoutes } from "./routes";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { fetchWorkspaces, getUser } from "../../store";

export type RootParamList = Record<keyof typeof RootRoutes, undefined>;
const Stack = createNativeStackNavigator<RootParamList>();
export const Navigation = ({ route, prop }) => {
  const dispatch = useDispatch<Dispatch<any>>();
  // Track Id Null

  useEffect(() => {
    // console.log("SHOW THE ROUTE VALUE ", route, " PROPS VALUE ", prop);
    if (prop !== undefined && prop !== null) {
      dispatch(getUser());
      dispatch(fetchWorkspaces());
    }
    return;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
      // initialRouteName={RootRoutes.Channel_Message}
        initialRouteName={route}
        screenOptions={{ freezeOnBlur: true }}
      >
        <Stack.Screen
          name={RootRoutes.Splash_Screen}
          component={SplashScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name={RootRoutes.SignIn_Screen}
          component={SignIn}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name={RootRoutes.Sign_Up_Screen}
          component={SignUp}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name={RootRoutes.Verification_Screen}
          component={Verification_Screen}
          options={{ headerShown: false, gestureEnabled: false }}
        />

        <Stack.Screen
          name={RootRoutes.Drawer}
          component={DrawerNavigator}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name={RootRoutes.Message}
          component={DirectMessage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={RootRoutes.Jump}
          component={JumpScreen}
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name={RootRoutes.NewChannel}
          component={NewChannnel}
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={RootRoutes.Channel_Message}
          component={ChannelMessage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={RootRoutes.Add_People}
          component={AddPeople}
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name={RootRoutes.Saved}
          component={Saved}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={RootRoutes.ChannelInfo}
          component={ChannnelInfo}
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name={RootRoutes.MessageThread}
          component={MessageThreads}
          options={{
            headerShown: false,
            // animation: "none",
          }}
        />
        <Stack.Screen
          name={RootRoutes.AddWorkspace}
          component={AddWorkspace}
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name={RootRoutes.Preferences}
          component={Preferences}
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name={RootRoutes.EditProfile}
          component={EditProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={RootRoutes.Pause_Notification}
          component={Pause_Notification}
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name={RootRoutes.Search_People}
          component={SearchPeople}
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name={RootRoutes.Create_Workspace}
          component={CreateworkSpace}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={RootRoutes.User_Profile}
          component={UserProfile}
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name={RootRoutes.Term_And_Condition}
          component={TermsAndUseWebVeiw}
          options={{ headerShown: true, headerTitle: "Terms and Conditions" }}
        />
        <Stack.Screen
          name={RootRoutes.Thread}
          component={Threads}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0FFFF",
  },
  headerTitle: {
    fontSize: 20,
    ////fontFamily: "PlusJakartaSans-Bold",
    color: "#ffffff",
  },
});
