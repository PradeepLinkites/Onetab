import React, { useEffect } from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import {
  ActionSheetIOS,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BottomBar } from "./bottomTab-navigator";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AddMemberModal, CustomDrawer } from "../components";
import { DrawerModal } from "../components/drawerModal";
import { organisationType } from "./workspaceData";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
  authStoreActions,
  getInvites,
  getModules,
  workspaceStoreActions,
} from "../../store";
import { RootRoutes } from "./routes";
import { saveDeviceTokenToStorage } from "../../utils/setUpContext";

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  const navigation = useNavigation<any>();
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [focus, setfocus] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [loader, setloader] = React.useState(false);
  const [member, setMember] = React.useState("");
  const dispatch = useDispatch<Dispatch<any>>();

  const {
    fetchWorkspaceData,
    getUserData,
    createInvitesData,
    createInvitesStatus,
    error,
  } = useSelector((state: any) => ({
    fetchWorkspaceData: state.workspaceStore.fetchWorkspaceData,
    getUserData: state.userStore.getUserData,
    createInvitesData: state.userStore.createInvitesData,
    createInvitesStatus: state.userStore.createInvitesStatus,
    error: state.userStore.error,
  }));

  const WorkspaceData = fetchWorkspaceData?.data?.workspaces ?? [];
  const current =
    WorkspaceData.findIndex(
      (x: any) =>
        x.organizationId ===
        getUserData?.data?.userByToken?.activeOrganizationDomain
    ) ?? 0;
  const curentWorkspace = WorkspaceData[current];
  useEffect(() => {
    if (WorkspaceData[0]?._id !== undefined && WorkspaceData[0]?._id !== null) {
      dispatch(getInvites());
      dispatch(getModules(WorkspaceData[0]?._id));
    }
  }, []);
  useEffect(() => {
    if (createInvitesStatus === "loading") {
      setloader(true);
    }
    if (createInvitesStatus === "loaded") {
      setloader(false);
      if (createInvitesData.data !== undefined) {
        setIsInvited(true);
        setTimeout(() => {
          setIsVisible(false);
          setIsInvited(false);
          setMember("");
        }, 5000);
      }
    }
    if (createInvitesStatus === "error") {
      setloader(false);
      setIsVisible(false);
      setMember("");
    }
  }, [createInvitesStatus]);
  const [data, setData] = React.useState<organisationType>(
    WorkspaceData[current]
  );
  const [isInvited, setIsInvited] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* {WorkspaceData[0] !== undefined ? ( */}
      <Drawer.Navigator
        initialRouteName={`${
          curentWorkspace?.name + curentWorkspace?.organizationName
        }`}
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        {WorkspaceData.map((data: organisationType, index: number) => {
          return (
            <Drawer.Screen
              name={`${data.name + data.organizationName}`}
              key={`${data.name + data.organizationName}`}
              component={BottomBar}
              options={{
                headerShown: false,
                drawerActiveBackgroundColor: "#F3F5F5",
                drawerActiveTintColor: "",
                drawerLabel: ({ focused }) => {
                  return (
                    <View style={styles.drawerLabelStyle}>
                      <View>
                        <Text key={data._id} style={styles.drawertitle}>
                          {data.name}
                        </Text>
                        <Text key={`org${data._id}`} style={styles.drawertitle}>
                          {data.organizationName}
                        </Text>
                      </View>
                      {Platform.OS === "ios" ? (
                        focused && (
                          <Pressable
                            onPress={() => {
                              // toggleModal();
                              ActionSheetIOS.showActionSheetWithOptions(
                                {
                                  // title: 'When would you like to be reminded?',
                                  options: [
                                    "Cancel",
                                    "Invite members",
                                    "Sign out",
                                  ],
                                  cancelButtonIndex: 0,
                                  userInterfaceStyle: "light",
                                  destructiveButtonIndex: 2,
                                },
                                async (buttonIndex) => {
                                  if (buttonIndex === 0) {
                                    // cancel action
                                  } else if (buttonIndex === 1) {
                                    toggle();
                                  } else if (buttonIndex === 2) {
                                    await saveDeviceTokenToStorage("");
                                    dispatch(
                                      authStoreActions.setVerifyOtpStatus(
                                        "not loaded"
                                      )
                                    );
                                    dispatch(
                                      authStoreActions.setVerifyData({})
                                    );
                                    navigation.navigate(
                                      RootRoutes.SignIn_Screen
                                    );
                                    dispatch(
                                      workspaceStoreActions.setFetchWorkspaceStatus(
                                        "not loaded"
                                      )
                                    );
                                    dispatch(
                                      workspaceStoreActions.setFetchWorkspaceData(
                                        {}
                                      )
                                    );
                                    console.log("data is cleared");
                                    dispatch(
                                      workspaceStoreActions.setCurrentWorkspaceStatus(
                                        "not loaded"
                                      )
                                    );
                                    dispatch(
                                      workspaceStoreActions.setCurrentWorkspaceData(
                                        {}
                                      )
                                    );
                                  }
                                }
                              );
                              setData(data);
                              setfocus(focused);
                            }}
                            style={({ pressed }) => [
                              {
                                backgroundColor: pressed
                                  ? "#BCBDBD"
                                  : "transparent",
                              },
                              styles.touchableStyle,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="dots-horizontal"
                              size={24}
                              color="black"
                            />
                          </Pressable>
                        )
                      ) : (
                        <Pressable
                          onPress={() => {
                            toggleModal();
                            setData(data);
                            setfocus(focused);
                          }}
                          style={({ pressed }) => [
                            {
                              backgroundColor: pressed
                                ? "#BCBDBD"
                                : "transparent",
                            },
                            styles.touchableStyle,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="dots-vertical"
                            size={24}
                            color="black"
                          />
                        </Pressable>
                      )}
                    </View>
                  );
                },
                drawerIcon: ({ size, focused }) => {
                  return (
                    <View
                      style={[
                        styles.drawerIconView,
                        {
                          padding: focused ? 2 : 0,
                          borderRadius: focused ? 5 : 0,
                          borderColor: focused ? "#000000" : "transparent",
                        },
                      ]}
                    >
                      {data.organizationLogo !== " " ? (
                        <View
                          key={data._id}
                          style={{
                            height: size * 2,
                            width: size * 2,
                            backgroundColor: "#3866E6",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: focused ? 0 : 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 26,
                              ////fontFamily: "PlusJakartaSans-Bold",
                              color: "#ffffff",
                            }}
                          >
                            {data.name.substring(0, 1)}
                          </Text>
                        </View>
                      ) : (
                        <Image
                          key={data._id}
                          source={data.organizationLogo}
                          style={[
                            styles.drawerIcon,
                            {
                              height: size * 2,
                              width: size * 2,
                            },
                          ]}
                        />
                      )}
                    </View>
                  );
                },
              }}
            />
          );
        })}
      </Drawer.Navigator>
      {/* ) : (
        <></>
      )} */}
      <DrawerModal
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        focus={focus}
        data={data}
        toggle={toggle}
        navigation={navigation}
      />
      <AddMemberModal
        isVisible={isVisible}
        toggle={toggle}
        isInvited={isInvited}
        setIsInvited={setIsInvited}
        setIsVisible={setIsVisible}
        loader={loader}
        setloader={setloader}
        member={member ?? ""}
        setMember={setMember}
      />
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    resizeMode: "contain",
    height: "100%",
    aspectRatio: 1,
  },
  drawerIcon: {
    resizeMode: "contain",
  },
  drawertitle: {
    fontSize: 14,
    ////fontFamily: "PlusJakartaSans-Bold",
  },
  drawerLabelStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "125%",
  },
  drawerIconView: {
    marginRight: -20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  touchableStyle: {
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
});
