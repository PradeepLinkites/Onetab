import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  Pressable,
} from "react-native";

import { Logo, ArrowBlue } from "../../assets";
import { RootRoutes } from "../../navigation/routes";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { styles } from "./styles";
import { authStoreActions, login } from "../../../store";
import { useToast } from "react-native-toast-notifications";
import { AnimatedImageBackGround } from "../animatedImageBackground";

export const SignIn = () => {
  const dispatch = useDispatch<Dispatch<any>>();
  const toast = useToast();
  const [emailAddress, setEmailAddress] = useState<string>();
  const navigation = useNavigation<any>();
  const { width, height } = useWindowDimensions();
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
      ? dispatch(login({ email: email , isMobile: true }))
      : navigation.navigate(RootRoutes.Verification_Screen);
  };

  return (
    <View style={styles.container}>
      <AnimatedImageBackGround />
      <View style={styles.logo_Style}>
        <Logo />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: '10%',
          flex: 6,
        }}
      >
        <Text style={styles.Sign_In_To_ConfigueeX_Text_Style} numberOfLines={1}>
          Sign In to Wynn
        </Text>
        <View style={styles.shadowProp}>
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
        </View>

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
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: "13%",
            marginTop: "20%",
            alignItems: "center",
          }}
        ></View>
      </View>
      <View style={styles.bottom_Style}>
        <Text style={styles.need_Configure_X_Text_Style}>New to Wynn?</Text>
        <Pressable
          onPress={() => navigation.navigate(RootRoutes.Sign_Up_Screen)}
          style={styles.createAccountStyle}
        >
          <Text style={styles.createAccount_Text_Style}>Create account</Text>
          <ArrowBlue />
        </Pressable>
      </View>
    </View>
  );
};
