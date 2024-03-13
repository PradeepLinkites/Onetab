import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between",
  },
  headertitle: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#171C26",
    marginLeft: 4,
  },
  input: {
    fontSize: 16,
    color: "#000000",
    width: "95%",
    alignSelf: "center",
    paddingVertical: 6,
    marginLeft: 12,
    paddingHorizontal: 8,
  },
  textstyle: {
    //fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#656971",
  },
  badgeStyle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  contentViewStyle: {
    paddingHorizontal: 18,
    marginTop: 15,
  },
  subTitleStyle: {
    //fontFamily: "PlusJakartaSans-Regular",
    fontSize: 10,
    color: "#656971",
    width: "68%",
  },
  imageMainView: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginLeft: 10,
  },
  status: {
    width: 10,
    height: 10,
    backgroundColor: "#5BDA15",
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 8,
  },
  topView: {
    marginTop: 1,
    backgroundColor: "",
    justifyContent: "center",
  },
  bodyView: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 5,
  },
  chatImageMainView: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  infoView: {
    width: "100%",
  },
  bodyViewElse: {
    marginLeft: 60,
    marginTop: 5,
  },
  settingItemView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  settingItemTitle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginLeft: 10,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userPicView: {
    width: 27,
    height: 27,
    justifyContent: "center",
    borderRadius: 5,
  },
  userPic: {
    width: 23,
    height: 23,
    borderRadius: 5,
    resizeMode: "cover",
  },
  initialView: {
    width: 23,
    height: 23,
    borderRadius: 5,
    backgroundColor: "#5A5A5A",
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    color: "#FFFFFF",
    fontSize: 12,
    ////fontFamily: "PlusJakartaSans-Bold",
  },
  statusView: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 0,
  },
  userName: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#171C26",
    marginLeft: 5,
  },
  headerLeftView: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#171C26",
    marginLeft: 5,
  },
  addButtonTextView: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#3866E6",
    marginLeft: 5,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#DEDEDE",
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
  },
  // input: {
  //   width: "85%",
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  // },
});
