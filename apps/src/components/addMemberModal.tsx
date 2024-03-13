import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { createInvites, userStoreActions } from "../../store";
interface AddMemberPropType {
  isVisible: boolean;
  toggle: () => void;
  isInvited: boolean;
  setIsInvited: any;
  setIsVisible: any;
  loader: boolean;
  setloader: any;
  member: string;
  setMember: any;
}
export const AddMemberModal = (props: AddMemberPropType) => {
  const dispatch = useDispatch<Dispatch<any>>();
  const { getModulesData, createInvitesData, createInvitesStatus, error } =
    useSelector((state: any) => ({
      getModulesData: state.userStore.getModulesData,
      createInvitesData: state.userStore.createInvitesData,
      createInvitesStatus: state.userStore.createInvitesStatus,
      error: state.userStore.error,
    }));
  // const module_id =
  //   getModulesData.data?.userAccessibleModulesInWorkspace[0]._id;
  const addTeamMember = () => {
    if (props.member.trim().length > 0) {
      dispatch(
        createInvites({
          email: props.member.toLowerCase()
        })
      );
    }
  };

  return (
    <Modal
      isVisible={props.isVisible}
      testID={"modal"}
      onSwipeComplete={() => {
        props.toggle();
        props.setIsInvited(false);
        props.setMember("");
      }}
      swipeDirection={["down"]}
      style={styles.view}
      backdropOpacity={0.5}
      onBackdropPress={() => {
        Keyboard.dismiss();
        props.toggle();
        props.setIsInvited(false);
        props.setMember("");
      }}
      animationOut={"slideOutDown"}
      animationOutTiming={500}
      animationInTiming={500}
      animationIn={"slideInUp"}
    >
      <KeyboardAvoidingView style={styles.contentStyle} behavior="padding">
        <View
          style={{
            width: "14.5%",
            height: 5,
            backgroundColor: "grey",
            borderRadius: 2.5,
            alignSelf: "center",
          }}
        />
        <Text style={styles.textStyle}>Invite member</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor={"#656971"}
          value={props.member}
          onChangeText={props.setMember}
          keyboardType="email-address"
          inputMode="email"
          autoCapitalize="none"
        />
        <Pressable
          style={styles.buttonStyle}
          onPress={() => {
            Keyboard.dismiss();
            addTeamMember();
            // props.setIsInvited(true);
          }}
          disabled={props.member?.trim().length === 0}
        >
          {props.loader ? (
            <ActivityIndicator
              size={"small"}
              color={"#ffffff"}
              animating={props.loader}
            />
          ) : (
            <Text style={styles.buttonTextStyle}>Invite</Text>
          )}
        </Pressable>
        {props.isInvited && (
          <Text style={styles.toost} numberOfLines={2}>
            {`We’ve sent the Invitation to ${props.member}`}
          </Text>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  view: {
    justifyContent: "flex-end",
    margin: 0,
  },
  contentStyle: {
    width: "100%",
    backgroundColor: "#ffffff",
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  textStyle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#0E0E0E",
    marginBottom: 18,
    marginTop: 30,
  },
  input: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    backgroundColor: "#F0F4F6",
    padding: 11,
    borderRadius: 5,
    marginBottom: 12,
  },
  buttonTextStyle: {
    ////fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "#F3F5F5",
  },
  buttonStyle: {
    backgroundColor: "#3866E6",
    padding: 11,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: Platform.OS === "ios" ? 40 : 20,
  },
  toost: {
    alignSelf: "center",
    color: "#246827",
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    bottom: 30,
  },
});
