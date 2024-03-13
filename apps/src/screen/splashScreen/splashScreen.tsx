import { View, Text, Image, useWindowDimensions } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootRoutes } from "../../navigation/routes";
import { Dispatch } from "redux";
import {
  fetchCurrentWorkspace,
  getChatAccessToken,
  getUser,
} from "../../../store";
import { useAuth } from "../../../utils/userAuthContex";
import { saveString } from "../../../utils/storage";

export const SplashScreen = () => {
  const dispatch = useDispatch<Dispatch<any>>();
  const userToken = useAuth();
  const [matrixCalling, setMatrixCalling] = React.useState(false);

  const { width, height } = useWindowDimensions();
  const { getUserData, fetchWorkspaceData, currentWorkspaceData } = useSelector(
    (state: any) => ({
      getUserData: state.userStore.getUserData,
      fetchWorkspaceData: state.workspaceStore.fetchWorkspaceData,
      currentWorkspaceData: state.workspaceStore.currentWorkspaceData,
    })
  );
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (userToken !== undefined && getUserData.data === undefined) {
      dispatch(getUser());
    }
  }, [userToken]);

  useEffect(() => {
    try {
      if (getUserData.data !== undefined) {
        checkAndUpdateWorkspace();
      }
    } catch (error) {
      console.error("Home Error ==> ", error);
    }
  }, [getUserData]);

  useEffect(() => {
    if (fetchWorkspaceData.data !== undefined) {
      if (fetchWorkspaceData.data.workspaces.length > 0) {
        try {
          checkAndUpdateWorkspace();
        } catch (error) {
          navigation.navigate(RootRoutes.SignIn_Screen);
        }
      } else {
        navigation.navigate(RootRoutes.Create_Workspace);
      }
    }
    return;
  }, [fetchWorkspaceData]);

  const checkAndUpdateWorkspace = async () => {
    if (
      getUserData.data !== undefined &&
      fetchWorkspaceData.data !== undefined
    ) {
      const current = fetchWorkspaceData.data.workspaces.filter(
        (item: any) =>
          item.organizationId ===
          getUserData.data.userByToken.activeOrganizationDomain
      );
      dispatch(fetchCurrentWorkspace(current[0]?._id));
      await saveString("currentWorkspaceId", current[0]?._id);
    }
  };

  useEffect(() => {
    try {
      if (currentWorkspaceData._id !== undefined) {
        loggedInIntoMatrix();
        navigation.navigate(RootRoutes.Drawer);
      }
    } catch (error) {
      navigation.navigate(RootRoutes.SignIn_Screen);
    }
  }, [currentWorkspaceData]);

  const loggedInIntoMatrix = () => {
    if (
      getUserData.data !== undefined &&
      currentWorkspaceData._id !== undefined
    ) {
      if (matrixCalling === false) {
        setMatrixCalling(true);
        dispatch(
          getChatAccessToken({
            matrixUsername: getUserData.data.userByToken.matrixUsername,
            matrixPassword: getUserData.data.userByToken.matrixPassword,
          })
        );
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../../../assets/image/Splash.png")}
        style={{ maxHeight: height, maxWidth: width }}
      />
    </View>
  );
};
