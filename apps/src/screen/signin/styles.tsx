import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F5F5",
    justifyContent: "center",
  },
  logo_Style: {
    marginLeft: 20,
    marginTop: 10,
  },
  middlecontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signintext: {
    fontSize: 18,
    ////fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
    fontWeight: "500",
  },
  textStyle: {
    marginTop: 15,
    fontSize: 15,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    height: 44,
    width: 306,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 6,
    //fontFamily: "PlusJakartaSans-Regular",
    paddingLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  forgottextStyle: {
    fontSize: 15,
    marginHorizontal: "11%",
    marginTop: "4%",
    color: "#656971",
    textAlign: "justify",
    alignSelf: "flex-end",
  },
  signUpButton: {
    width: 306,
    backgroundColor: "#00165F",
    marginTop: 22,
    alignItems: "center",
    borderRadius: 6,
    height: 44,
    justifyContent: "center",
  },
  testSignUp: {
    color: "#F3F5F5",
    fontSize: 16,
    fontWeight: "400",
    ////fontFamily: "PlusJakartaSans-Bold",
  },
  containerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottom_Style: {
    alignItems: "center",
    flex: 1,
  },
  need_Configure_X_Text_Style: {
    //fontFamily: "PlusJakartaSans-Medium",
    color: "#656971",
    fontSize: 12,
    textAlign: "center",
    marginTop: 17,
    width: "80%",
  },
  createAccountStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    width: "80%",
  },
  createAccount_Text_Style: {
    color: "#3866E6",
    fontSize: 12,
    textAlign: "center",
    ////fontFamily: "PlusJakartaSans-Bold",
    marginRight: 3,
  },
  emailInput: {
    // color: "#FFFFFF",
    // backgroundColor: "white",
    // height:46,
    // width: "80%",
    // borderWidth: 2,
    // borderColor: "#FFFFFF",
    // borderRadius: 8,
    // shadowColor: "#B0B9C3",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.4,
    // shadowRadius: 1,
    // marginTop: 29,
  },
});
