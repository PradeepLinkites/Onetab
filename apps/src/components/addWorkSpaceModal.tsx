import React, { useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { createWorkspace } from "../../store";
import { Dispatch } from "redux";
interface AddWorkSpacePropType {
  isVisible: boolean;
  toggle: () => void;
  isInvited: boolean;
  setIsInvited: any;
}
export const AddWorkSpaceModal = (props: AddWorkSpacePropType) => {
  const [searchPhrase, setSearchPhrase] = React.useState("");
  const dispatch = useDispatch<Dispatch<any>>();
  const { createWorkspaceData } = useSelector((state: any) => ({
    createWorkspaceData: state.workspaceStore.createWorkspaceData,
  }));
  useEffect(() => {
    if (
      createWorkspaceData.data !== undefined &&
      createWorkspaceData.data.createWorkspace.name === searchPhrase
    ) {
      props.setIsInvited(true);
    }
    return;
  }, [createWorkspaceData]);

  return (
    <Modal
      isVisible={props.isVisible}
      testID={"modal"}
      onSwipeComplete={() => {
        props.toggle();
        props.setIsInvited(false);
        setSearchPhrase("");
      }}
      swipeDirection={["down"]}
      style={styles.view}
      backdropOpacity={0.5}
      onBackdropPress={() => {
        Keyboard.dismiss();
        props.toggle();
        props.setIsInvited(false);
        setSearchPhrase("");
      }}
      animationOut={"slideOutDown"}
      animationOutTiming={250}
      animationInTiming={250}
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
        <Text style={styles.textStyle}>Add a Workspace</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor={"#656971"}
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          keyboardType="email-address"
          inputMode="email"
        />
        <Pressable
          style={styles.buttonStyle}
          onPress={() => {
            Keyboard.dismiss();
            dispatch(createWorkspace({ name: searchPhrase }));
          }}
          disabled={searchPhrase.trim().length === 0}
        >
          <Text style={styles.buttonTextStyle}>Create</Text>
        </Pressable>
        {props.isInvited && (
          <Text style={styles.toost}>
            {`WorkSpace Created ${searchPhrase}`}
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
    //fontFamily: "PlusJakartaSans-Regular",
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
    marginBottom: 20,
  },
  toost: {
    alignSelf: "center",
    color: "#246827",
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 20,
  },
});
