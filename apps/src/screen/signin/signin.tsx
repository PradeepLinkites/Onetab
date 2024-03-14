import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Logo } from "../../assets";
import { RootRoutes } from "../../navigation/routes";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { styles } from "./styles";
import { authStoreActions, login } from "../../../store";
import { useToast } from "react-native-toast-notifications";

export const SignIn = () => {
  const dispatch = useDispatch<Dispatch<any>>();
  const toast = useToast();
  const [emailAddress, setEmailAddress] = useState<string>();
  const navigation = useNavigation<any>();
  const { width, height } = useWindowDimensions();
  const [user, setUser] = useState({});
  const { loginData, loginStatus } = useSelector((state: any) => ({
    loginData: state.authStore.loginData,
    loginStatus: state.authStore.loginStatus,
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

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      "626734696093-c1lnr3hmaupofd742el8aqiaajvutd2q.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
    iosClientId:
      "626734696093-t9q814l90r10g2ko706uf0atpras8br2.apps.googleusercontent.com",
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });

  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("userInfo==>>", userInfo);
      // setState({ userInfo });
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
      <View style={styles.container}>
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
          <GoogleSigninButton
            style={{ marginTop: 15, height: 50 }}
            size={GoogleSigninButton.Size.Wide}
            onPress={_signIn}
            // disabled={this.state.isSigninInProgress}
          />

          <TextInput
            onChangeText={(e: string) => {
              setEmailAddress(e.toLowerCase());
            }}
            placeholderTextColor={"#8AA2CE"}
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
        </View>
      </View>
    </SafeAreaView>
  );
};
