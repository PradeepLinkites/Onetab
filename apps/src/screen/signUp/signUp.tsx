import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
  ImageBackground,
  Animated
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Logo, ArrowBlue } from "../../assets";
import { RootRoutes } from "../../navigation/routes";
import CheckBox from "@react-native-community/checkbox";
import { login, signup, authStoreActions } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { styles } from "./styles";
import { useToast } from "react-native-toast-notifications";
import { AnimatedImageBackGround } from "../animatedImageBackground";

export const SignUp = () => {
  const toast = useToast();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [companyName, setCompanyName] = useState<string>();
  const [emailAddress, setEmailAddress] = useState<string>();
  const [checkboxState, setCheckboxState] = React.useState<boolean>(false);
  const navigation = useNavigation<any>();
  const { width, height } = useWindowDimensions();
  const apiUp = true;
  const dispatch = useDispatch<Dispatch<any>>();
  const { signUpData, signUpStatus, loginData, loginStatus } = useSelector(
    (state: any) => ({
      signUpData: state.authStore.signUpData,
      signUpStatus: state.authStore.signUpStatus,
      loginData: state.authStore.loginData,
      loginStatus: state.authStore.loginStatus,
    })
  );

  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;


  useEffect(() => {
    if (loginData.data !== undefined) {
      dispatch(authStoreActions.setLoadingStatus("not loaded"));
      dispatch(authStoreActions.setLoginData({}));
      navigation.navigate(RootRoutes.Verification_Screen, {
        userEmail: emailAddress,
      });
    }
    return;
  }, [loginData]);

  useEffect(() => {
    if (signUpData.data !== undefined) {
      dispatch(login({ email: emailAddress ?? "" }));
      dispatch(authStoreActions.setSignUpStatus("not loaded"));
      dispatch(authStoreActions.setSignUpData({}));
    }
    return;
  }, [signUpData]);

  const signUpValidation = () => {
    if (
      firstName !== "" &&
      firstName !== undefined &&
      lastName !== "" &&
      lastName !== undefined &&
      companyName !== "" &&
      companyName !== undefined &&
      emailAddress !== "" &&
      emailAddress !== undefined &&
      checkboxState !== false
    ) {
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
        signUp();
      }
    } else {
      toast.show("Invalid Data", {
        type: "warning",
        animationType: "slide-in",
        placement: "bottom",
        duration: 2000,
        warningColor: "#B84191",
        style: { marginBottom: 90 },
      });
    }
  };

  const signUp = async () => {
    apiUp
      ? dispatch(
        signup({
          firstName: firstName,
          lastName: lastName,
          email: emailAddress,
          organizationDomain: companyName,
        })
      )
      : navigation.navigate(RootRoutes.Verification_Screen);
  };

  useEffect(() => {
    const opacityAnimation = Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);
    Animated.parallel([opacityAnimation]).start();
    return () => {
      opacityAnimation.stop();
    };
  }, []);


  return (
    <View style={styles.container}>
      <AnimatedImageBackGround />
      <View style={styles.logo_Style}>
        <Logo />
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, marginBottom: 10 }}
        keyboardShouldPersistTaps="handled"
      >

        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            marginTop: "20%",
            flex: 1,
          }}
        >
          <Text style={styles.Sign_In_To_ConfigueeX_Text_Style} numberOfLines={1}>
            Sign Up to Wynn
          </Text>
          <View style={styles.shadowProp}>
            <TextInput
              onChangeText={(e: string) => {
                setFirstName(e);
              }}
              placeholderTextColor={"#8AA2CE"}
              placeholder="First name"
              style={styles.textStyle}
              allowFontScaling={false}
              textContentType={"givenName"}
              // contextMenuHidden={true}
              value={firstName}
            />
          </View>
          <View style={styles.shadowProp}>
            <TextInput
              onChangeText={(e: string) => {
                setLastName(e);
              }}
              placeholderTextColor={"#8AA2CE"}
              placeholder="Last name"
              style={styles.textStyle}
              allowFontScaling={false}
              textContentType={"givenName"}
              // contextMenuHidden={true}
              value={lastName}
            />
          </View>
          <View style={styles.shadowProp}>
            <TextInput
              onChangeText={(e: string) => {
                setCompanyName(e);
              }}
              placeholderTextColor={"#8AA2CE"}
              placeholder="Comapany name"
              style={styles.textStyle}
              allowFontScaling={false}
              textContentType={"organizationName"}
              // contextMenuHidden={true}
              value={companyName}
            />
          </View>
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
              // contextMenuHidden={true}
              value={emailAddress}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.checkBoxStyle}>
            <CheckBox
              boxType="square"
              onChange={() => setCheckboxState(!checkboxState)}
              value={checkboxState}
              onFillColor="#3866E6"
              onTintColor="#DADADA"
              onCheckColor="#FFFFFF"
              style={{ width: 20, height: 20 }}
            />
            <Text allowFontScaling={false} style={styles.Text_Style}>
              I've read and accept the
            </Text>
            <Pressable
              onPress={() => navigation.navigate(RootRoutes.Term_And_Condition)}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.createAccount_Text_Style,
                  {
                    //fontFamily: "PlusJakartaSans-Medium",
                  },
                ]}
              >
                Terms & Conditions
              </Text>
            </Pressable>
          </View>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => {
              signUpValidation();
            }}
          >
            <Text allowFontScaling={false} style={styles.testSignUp}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              marginHorizontal: "13%",
              // paddingTop: "20%",
              marginTop: "20%",
              alignItems: "center",
            }}
          ></View>
        </View>


        <View style={styles.bottom_Style}>
          <Text style={styles.need_Configure_X_Text_Style}>
            Already have an account?

          </Text>
          <View style={styles.createAccountStyle}>
            <Pressable
              style={styles.createAccountStyle}
              onPress={() => navigation.navigate(RootRoutes.SignIn_Screen)}
            >
              <Text style={styles.createAccount_Text_Style}>Sign In</Text>
              <ArrowBlue />
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView >
    </View>
  );
};
