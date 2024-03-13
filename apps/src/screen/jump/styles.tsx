import { Platform, StatusBar, StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: "#3866E6",
    flexDirection: "row",
    paddingRight: 18,
  },
  searchBar: {
    marginLeft: 9,
    flexDirection: "row",
    width: "92%",
    backgroundColor: "#557FF1",
    alignItems: "center",
    borderRadius: 5,
    padding: 8,
  },
  input: {
    fontSize: 14,
    marginLeft: 10,

    color: "#ffffff",
  },
  historyContentView: { marginTop: 15, paddingHorizontal: 20 },
  historyHeader: { fontSize: 12, marginBottom: '5%' },
  historyListItem: { flexDirection: "row", marginTop: 5, paddingVertical: 2 },
  historyTitle: {
    color: "#656971",
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    marginLeft: 11,
  },
  historyImage: { width: 25, height: 25, resizeMode: "contain" },
  historyGroupView: {
    width: 25,
    height: 25,
    backgroundColor: "#E4E9F1",
    alignItems: "center",
    justifyContent: "center",
  },
  historyGroupNum: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-SemiBold",
  },
  flatlistStyle: { marginLeft: 5, marginTop: 13, marginBottom: 25 },
  nameLabel: {
    width: 70,
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Regular",
    textAlign: "center",
    marginTop: 6,
    textTransform: "capitalize",
  },
  flatlistImage: { resizeMode: "contain", height: 55, width: 55 },
  flatlistContent: {
    paddingHorizontal: 4,
    marginLeft: 5,
    alignItems: "center",
  },
});
