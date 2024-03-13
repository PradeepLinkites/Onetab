import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { SimpleLineIcons, Entypo } from "@expo/vector-icons";
import { organisationType } from "../navigation/workspaceData";
import { RootRoutes } from "../navigation/routes";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { authStoreActions, workspaceStoreActions } from "../../store";
interface modalPropType {
  isModalVisible: boolean;
  toggleModal: () => void;
  focus: boolean;
  data: organisationType;
  toggle: () => void;
  navigation: any;
}
export const DrawerModal = (props: modalPropType) => {
  const dispatch = useDispatch<Dispatch<any>>();
  return (
    <Modal
      isVisible={props.isModalVisible}
      testID={"modal"}
      onSwipeComplete={() => props.toggleModal()}
      swipeDirection={["down"]}
      style={styles.view}
      backdropOpacity={0.5}
      onBackdropPress={() => props.toggleModal()}
      animationOut={"slideOutDown"}
      animationOutTiming={200}
      animationInTiming={500}
      animationIn={"slideInUp"}
    >
      <View style={styles.contentStyle}>
        <View style={styles.itemStyle}>
          {props.data?.organizationLogo !== " " ? (
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: "#3866E6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.titleStyle, { marginLeft: 0, color: "#ffffff" }]}
              >
                {props.data?.name.substring(0, 1)}
              </Text>
            </View>
          ) : (
            <Image
              key={`Img${props.data?._id}`}
              source={props.data?.organizationLogo}
              style={styles.iconStyle}
            />
          )}
          <Text key={props.data?._id} style={styles.titleStyle}>
            {props.data?.name}
          </Text>
        </View>
        {props.focus && (
          <Pressable
            style={styles.itemStyle}
            onPress={() => {
              props.toggleModal();
              setTimeout(() => {
                props.toggle();
              }, 300);
            }}
          >
            <SimpleLineIcons
              name="user-follow"
              size={22}
              color="black"
              style={{ marginLeft: 4 }}
            />
            <Text style={styles.textStyle}>Invite members</Text>
          </Pressable>
        )}
        <Pressable
          style={styles.itemStyle}
          onPress={() => {
            dispatch(authStoreActions.setVerifyOtpStatus("not loaded"));
            dispatch(authStoreActions.setVerifyData({}));
            dispatch(
              workspaceStoreActions.setFetchWorkspaceStatus("not loaded")
            );
            dispatch(workspaceStoreActions.setFetchWorkspaceData({}));
            dispatch(
              workspaceStoreActions.setCurrentWorkspaceStatus("not loaded")
            );
            dispatch(workspaceStoreActions.setCurrentWorkspaceData({}));
            props.navigation.navigate(RootRoutes.SignIn_Screen);
          }}
        >
          <Entypo
            name="log-out"
            size={22}
            color="red"
            style={{ marginLeft: 4 }}
          />
          <Text style={[styles.textStyle, { color: "red" }]}>Sign out</Text>
        </Pressable>
      </View>
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
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  iconStyle: {
    resizeMode: "contain",
    height: 30,
    width: 30,
  },
  titleStyle: {
    fontSize: 20,
    //fontFamily: "PlusJakartaSans-SemiBold",
    marginLeft: 6,
  },
  itemStyle: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "center",
  },
  textStyle: {
    marginLeft: 10,
    fontSize: 18,
    //fontFamily: "PlusJakartaSans-Regular",
  },
});
