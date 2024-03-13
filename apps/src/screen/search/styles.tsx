import { StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  statusBar: {
    height: StatusBar.currentHeight,
  },
  contactSubView: {
    marginTop: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contactEmailView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  settingView: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingTitle: {
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#171C26",
  },
  FlatListStyle: {
    paddingHorizontal: 26,
  },
  textStyle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginLeft: 10,
  },
  presssableTextStyle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginLeft: 14,
  },
});
