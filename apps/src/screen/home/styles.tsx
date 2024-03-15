import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
    alignContent: "center",
    justifyContent: "center",
  },
  pressableText: {
    flexDirection: "row",
    marginVertical: 5,
    paddingLeft:10
  },
  segementView: {
    marginTop: 10,
    paddingLeft: 7,
  },
  textStyle: {
    marginLeft: 12,
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'left',
    color: `#171C26`,
    fontFamily: "PlusJakartaSans-Regular",
  },
  scrollStyle: {
    width: "100%",
  },
  contentViewStyle: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  headingStyle: {
    fontSize: 12.5,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#171C26",
    paddingLeft: 8,
  },
  nameStyle: {
    fontSize: 14,
    ////fontFamily: "PlusJakartaSans-Bold",
    marginLeft: 10,
    color: "#171C26",
    textTransform: "capitalize",
  },
  unReadNumStyle: {
    color: "#ffffff",
    fontSize: 13,
    ////fontFamily: "PlusJakartaSans-Bold",
    lineHeight: 14,
    textTransform: "capitalize",
    textAlign: "center",
    textAlignVertical: "center",
  },
  nameHeader: {
    color: "#ffffff",
    fontSize: 12,
    ////fontFamily: "PlusJakartaSans-Bold",
    lineHeight: 14,
    textAlign: "center",
    textAlignVertical: "center",
    textTransform: "capitalize",
  },
  unreadViewStyle: {
    backgroundColor: "#176FFC",
    marginRight: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainerStyle: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 7,
  },
  addElementContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },
  headerPressableStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  badgeStyle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  image: {
    width: 14,
    height: 14,
  },
});
