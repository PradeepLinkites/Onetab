import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    marginTop: 10,
  },
  titleView: {
    flexDirection: "row",
    marginLeft: 26,
    marginRight: 20,
  },
  bodyView: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  imageMainView: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginRight: 6,
  },
  infoView: {
    marginRight: 80,
  },
  mentionHighLight: {
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginLeft: 40,
    marginRight: 30,
    marginTop: 8,
  },
  messageHighLight: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginBottom: 10,
  },
});
