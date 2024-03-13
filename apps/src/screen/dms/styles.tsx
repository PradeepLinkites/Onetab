import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  scrollStyle: {
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  itemContainerStyle: {
    flexDirection: "row",
    marginVertical: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  nameStyle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#171C26",
    marginBottom: 2,
  },
  textViewStyle: {
    width: "80%",
  },
  messageStyle: {
    textAlign: "justify",
    //fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#656971",
  },
  timeStyle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
  },
  badgeStyle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    bottom: 0,
    right: 0,
    borderColor: "#ffffff",
  },
  imageContainerStyle: {
    width: 32,
    height: 32,
    paddingTop: 3,
  },
  contentViewStyle: {
    marginTop: 14,
    paddingHorizontal: 3,
  },
  individualImageStyle: {
    width: 30,
    height: 30,
  },
  groupImageStyle: {
    width: 19,
    height: 19,
  },
});
