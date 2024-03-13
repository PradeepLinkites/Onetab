import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginTop: "26%",
    margin: 0,
    justifyContent: "flex-start",
    borderRadius: 25,
  },
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    marginBottom: 5,
    borderRadius: 25,
  },
  headertitle: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#171C26",
    marginLeft: 4,
  },
  input: {
    fontSize: 14,
    color: "#000000",
    width: "95%",
  },
  textstyle: {
    paddingVertical: 12,
    marginLeft: 10,
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
    paddingHorizontal: 14,
    marginTop: 12,
  },
});
