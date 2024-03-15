import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  // View,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  Alert,
  View,
  Platform,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Logo, Google, Apple } from "../../assets";
import { RootRoutes } from "../../navigation/routes";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { styles } from "./styles";
import {
  authStoreActions,
  fetchCurrentWorkspace,
  fetchWorkspaces,
  getChatAccessToken,
  getUser,
  login,
  socialLogin,
  workspaceStoreActions,
} from "../../../store";
import { useToast } from "react-native-toast-notifications";
import {
  AppleButton,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import { saveString } from "../../../utils/storage";
// import jwt_decode from "jwt-decode";

export const SignIn = () => {
  const dispatch = useDispatch<Dispatch<any>>();
  const toast = useToast();
  const [emailAddress, setEmailAddress] = useState<string>();
  const navigation = useNavigation<any>();
  const { width, height } = useWindowDimensions();
  const [user, setUser] = useState({});
  const {
    loginData,
    loginStatus,
    socialLoginData,
    getUserData,
    fetchWorkspaceData,
    currentWorkspaceData,
  } = useSelector((state: any) => ({
    loginData: state.authStore.loginData,
    loginStatus: state.authStore.loginStatus,
    socialLoginData: state.authStore.socialLoginData,
    getUserData: state.userStore.getUserData,
    fetchWorkspaceData: state.workspaceStore.fetchWorkspaceData,
    currentWorkspaceData: state.workspaceStore.currentWorkspaceData,
  }));
  const apiUp = true;

  useEffect(() => {
    if (loginData.data !== undefined) {
      dispatch(authStoreActions.setLoadingStatus("not loaded"));
      dispatch(authStoreActions.setLoginData({}));
      navigation.navigate(RootRoutes.Verification_Screen, {
        userEmail: emailAddress,
      });
      setEmailAddress("");
    }
    return;
  }, [loginData]);
  useEffect(() => {
    if (socialLoginData.data !== undefined) {
      dispatch(getUser());
      dispatch(fetchWorkspaces());
    }
    return;
  }, [socialLoginData]);

  useEffect(() => {
    if (fetchWorkspaceData.data !== undefined) {
      if (fetchWorkspaceData.data.workspaces.length > 0) {
        checkAndUpdateWorkspace();
      } else {
        // dispatch(workspaceStoreActions.setFetchWorkspaceStatus("not loaded"));
        // dispatch(workspaceStoreActions.setFetchWorkspaceData({}));
        // dispatch(workspaceStoreActions.setCurrentWorkspaceStatus("not loaded"));
        // dispatch(workspaceStoreActions.setCurrentWorkspaceData({}));
        // navigation.navigate(RootRoutes.Create_Workspace, {
        //   userEmail: userEmail,
        // });
        Alert.alert("Plz first Create an accont");
      }
    }
    return;
  }, [fetchWorkspaceData]);

  useEffect(() => {
    if (currentWorkspaceData._id !== undefined) {
      console.log("Matrix login calling 2");
      loggedInIntoMatrix();
      navigation.navigate(RootRoutes.Drawer);
    }
    return;
  }, [currentWorkspaceData]);

  const loggedInIntoMatrix = () => {
    if (
      getUserData.data !== undefined &&
      currentWorkspaceData._id !== undefined
    ) {
      dispatch(
        getChatAccessToken({
          matrixUsername: getUserData.data.userByToken.matrixUsername,
          matrixPassword: getUserData.data.userByToken.matrixPassword,
        })
      );
    }
  };

  useEffect(() => {
    try {
      if (getUserData.data !== undefined) {
        checkAndUpdateWorkspace();
      }
    } catch (error) {
      console.error("Home Error ==> ", error);
    }
  }, [getUserData]);

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
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    return appleAuth.onCredentialRevoked(async () => {
      console.warn(
        "If this function executes, User Credentials have been Revoked"
      );
    });
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      "861490928206-i2ohiaus31qqp2m7vfq9sgr8ll5htcp3.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
    iosClientId:
      "861490928206-bpuid91dk0gobpou2ii84oqndom69v1d.apps.googleusercontent.com",
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });

  const _googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // console.log("userInfo==>>", userInfo);
      // setState({ userInfo });
      dispatch(
        socialLogin({
          code: userInfo.serverAuthCode,
          loginFrom: "google",
          isMobile: true,
        })
      );
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  async function onAppleButtonPress() {
    try {
      // setLoginStatus(true);
      const appleAuthRequestResponse = await appleAuth.performRequest({
        nonceEnabled: false,
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user
      );
      console.log("USER LOG APPLE", appleAuthRequestResponse);
      const { identityToken, fullName, user } = appleAuthRequestResponse;
      // const { email } = jwt_decode(identityToken);
      console.log("email==>>", identityToken);
      dispatch(
        socialLogin({ code: identityToken, loginFrom: "apple", isMobile: true })
      );
      // use credentialState response to ensure the user is authenticated
    } catch (error) {
      // setLoginStatus(false);
      console.log(error);
    }
  }

  const validation = (email: string | undefined) => {
    if (emailAddress !== "" && emailAddress !== undefined) {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(emailAddress)) {
        toast.show("The input is not valid E-mail!", {
          type: "warning",
          animationType: "slide-in",
          placement: "bottom",
          duration: 2000,
          warningColor: "#B84191",
          style: { marginBottom: 90 },
        });
      } else {
        signIn(email);
      }
    }
  };

  const signIn = async (email) => {
    apiUp
      ? dispatch(login({ email: email, isMobile: true }))
      : navigation.navigate(RootRoutes.Verification_Screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={styles.container}
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.logo_Style}>
          <Logo />
        </View>
        <View style={styles.middlecontainer}>
          <Text
            style={styles.signintext}
            numberOfLines={1}
            allowFontScaling={false}
          >
            Sign In to Onetab
          </Text>

          <TextInput
            onChangeText={(e: string) => {
              setEmailAddress(e.toLowerCase());
            }}
            placeholderTextColor={"#A7B1BC"}
            placeholder="Enter email address"
            style={styles.textStyle}
            allowFontScaling={false}
            textContentType={"emailAddress"}
            value={emailAddress}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => {
              validation(emailAddress);
            }}
          >
            <Text allowFontScaling={false} style={styles.testSignUp}>
              Sign In
            </Text>
          </TouchableOpacity>

          <View style={styles.linecontainer}>
            {/* <View
              style={{ height: 1, width: 130, backgroundColor: "#C2C4C8" }}
            /> */}
            <Text allowFontScaling={false} style={styles.ortext}>OR</Text>
            {/* <View
              style={{ height: 1, width: 130, backgroundColor: "#C2C4C8" }}
            /> */}
          </View>

          <TouchableOpacity
            style={styles.googleStyle}
            onPress={_googleSignIn}
          >
            <Google />
            <Text allowFontScaling={false} style={styles.googleText}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleStyle}
            onPress={() => onAppleButtonPress()}
          >
            <Apple />
            <Text allowFontScaling={false} style={styles.googleText}>Sign in with Apple</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
};
