import React, { useState, useEffect, useRef } from "react";
import {
  ImageBackground,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Logo, BackArrowBlack } from "../../assets";
import { RootRoutes } from "../../navigation/routes";
import {
  authStoreActions,
  fetchCurrentWorkspace,
  fetchWorkspaces,
  getChatAccessToken,
  getUser,
  verifyOtp,
  workspaceStoreActions,
} from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { styles } from "./styles";
import { saveString } from "../../../utils/storage";
export const Verification_Screen = ({ route }) => {
  const { width, height } = useWindowDimensions();
  const userEmail = route.params?.userEmail;
  const navigation = useNavigation<any>();
  const otp0 = useRef<TextInput>(null);
  const otp1 = useRef<TextInput>(null);
  const otp2 = useRef<TextInput>(null);
  const otp3 = useRef<TextInput>(null);
  const [code0, setCode0] = useState("");
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const dispatch = useDispatch<Dispatch<any>>();
  const {
    verifyData,
    verifyOtpStatus,
    getUserData,
    fetchWorkspaceData,
    currentWorkspaceData,
  } = useSelector((state: any) => ({
    verifyData: state.authStore.verifyData,
    verifyOtpStatus: state.authStore.verifyOtpStatus,
    getUserData: state.userStore.getUserData,
    fetchWorkspaceData: state.workspaceStore.fetchWorkspaceData,
    currentWorkspaceData: state.workspaceStore.currentWorkspaceData,
  }));
  const apiUp = true;
  useEffect(() => {
    if (code0 !== "" && code1 !== "" && code2 !== "" && code3 !== "") {
      const otp = code0 + code1 + code2 + code3;
      if (otp.length === 4) {
        Keyboard.dismiss();

        apiUp
          ? dispatch(
              verifyOtp({
                email: userEmail,
                code: otp,
                isGoogleLogin: false,
              })
            )
          : navigation.navigate(RootRoutes.Drawer);
      }
    }
    return;
  }, [code0, code1, code2, code3]);

  useEffect(() => {
    if (verifyData.data !== undefined) {
      dispatch(getUser());
      dispatch(fetchWorkspaces());
    }
    return;
  }, [verifyData]);
  useEffect(() => {
    if (fetchWorkspaceData.data !== undefined) {
      if (fetchWorkspaceData.data.workspaces.length > 0) {
        checkAndUpdateWorkspace();
      } else {
        dispatch(workspaceStoreActions.setFetchWorkspaceStatus("not loaded"));
        dispatch(workspaceStoreActions.setFetchWorkspaceData({}));
        dispatch(workspaceStoreActions.setCurrentWorkspaceStatus("not loaded"));
        dispatch(workspaceStoreActions.setCurrentWorkspaceData({}));
        navigation.navigate(RootRoutes.Create_Workspace, {
          userEmail: userEmail,
        });
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

  const resendOtp = () => {
    console.log("RESENDING");
  };

  const handleBackspace = (currentRef: any, previousRef: any) => {
    const value = currentRef.current?.value;
    if (!value) {
      previousRef.current?.focus();
    }
  };

  const handleChangeText = (text: any, ref: any, nextRef: any) => {
    if (text.length === 1) {
      ref.current?.blur();
      nextRef.current?.focus();
    }
  };

  const handleKeyPress = (event: any, ref: any, prevRef: any) => {
    if (event.nativeEvent.key === "Backspace") {
      event.preventDefault();
      handleBackspace(ref, prevRef);
    }
  };

  return (
    <View style={styles.container1}>
      <ImageBackground
        source={require("../../assets/images/authBackground.png")}
        imageStyle={{
          resizeMode: "contain",
          height: height,
          zIndex: -2,
          top: -height / 2 + 100,
          left: -width + 120,
        }}
      />
      <View style={styles.logo_Style}>
        <Logo />
      </View>
      <View style={styles.container2}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: width * 0.92,
            // backgroundColor: "red",
            marginBottom: 6,
            padding: 10,
          }}
        >
          <Pressable
            onPress={() => {
              navigation.goBack();
              dispatch(authStoreActions.setVerifyOtpStatus("not loaded"));
              dispatch(authStoreActions.setVerifyData({}));
            }}
          >
            <BackArrowBlack></BackArrowBlack>
          </Pressable>
          <Text
            style={{
              marginLeft: 15,
              color: "#171C26",
              ////fontFamily: "PlusJakartaSans-Bold",
              fontSize: 14,
            }}
          >
            Verifying your account
          </Text>
        </View>
        <Text
          style={{
            color: "#656971",
            //fontFamily: "PlusJakartaSans-Medium",
            fontSize: 12,
            paddingLeft: 28,
            paddingBottom: 20,
            paddingRight: 40,
          }}
        >
          We have just send you 4 digit code via your email {userEmail}
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: "70%",
            justifyContent: "space-around",
          }}
        >
          <TextInput
            ref={otp0}
            style={styles.textStyle}
            allowFontScaling={false}
            maxLength={1}
            textContentType={"oneTimeCode"}
            autoFocus={true}
            contextMenuHidden={true}
            placeholder={"0"}
            onChangeText={(text) => {
              setCode0(text);
              handleChangeText(text, otp0, otp1);
            }}
            keyboardType="number-pad"
          />
          <TextInput
            ref={otp1}
            style={styles.textStyle}
            allowFontScaling={false}
            maxLength={1}
            textContentType={"oneTimeCode"}
            contextMenuHidden={true}
            placeholder={"0"}
            onChangeText={(text) => {
              setCode1(text);
              handleChangeText(text, otp1, otp2);
            }}
            onKeyPress={(event) => handleKeyPress(event, otp1, otp0)}
            keyboardType="number-pad"
          />
          <TextInput
            ref={otp2}
            style={styles.textStyle}
            allowFontScaling={false}
            maxLength={1}
            textContentType={"oneTimeCode"}
            contextMenuHidden={true}
            placeholder={"0"}
            onChangeText={(text) => {
              setCode2(text);
              handleChangeText(text, otp2, otp3);
            }}
            onKeyPress={(event) => handleKeyPress(event, otp2, otp1)}
            keyboardType="number-pad"
          />

          <TextInput
            ref={otp3}
            style={styles.textStyle}
            allowFontScaling={false}
            maxLength={1}
            textContentType={"oneTimeCode"}
            contextMenuHidden={true}
            placeholder={"0"}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setCode3(e);
              if (!e) {
                handleBackspace(otp3, otp2);
              }
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            width: width * 0.72,
          }}
        >
          <Text style={{ color: "#656971" }}>Didn't recive the code? </Text>
          <Timeout resendOtp={resendOtp} />
        </View>
      </View>
    </View>
  );
};

const Timeout = ({ resendOtp }) => {
  const [timeRemaining, setTimeRemaining] = useState(60);

  useEffect(() => {
    timeRemaining > 0 &&
      setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
  }, [timeRemaining]);

  return (
    <Pressable
      style={styles.button}
      disabled={timeRemaining > 0}
      onPress={() => {
        resendOtp();
        setTimeRemaining(60);
      }}
    >
      <Text
        allowFontScaling={false}
        style={{
          ////fontFamily: "PlusJakartaSans-Bold",
          color: timeRemaining > 0 ? "#8E8E8E" : "#3866E6",
          fontSize: 13,
          textDecorationLine: "underline",
        }}
      >
        Resend {timeRemaining > 0 && "(" + timeRemaining + ")"}
      </Text>
    </Pressable>
  );
};
