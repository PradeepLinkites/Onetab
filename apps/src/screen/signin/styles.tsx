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
    color: "#171C26",
    textAlign: "center",
    fontFamily: "PlusJakartaSans-Bold",
  },
  textStyle: {
    fontSize: 15,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    height: 46,
    width: '80%',
    borderWidth: 1,
    borderColor: "#C0C6D3",
    borderRadius: 6,
    paddingLeft: 10,
    fontFamily: "PlusJakartaSans-Regular",
  },
  googleStyle:{
    height:46,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    borderRadius: 6,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#C0C6D3",
    flexDirection:'row',
  },
  googleText: {
    color: "#070729",
    fontSize: 16,
    marginLeft:15,
    fontFamily: "PlusJakartaSans-Bold",
  },
  appleStyle: {
    width: '80%', // You must specify a width
    height:46, // You must specify a height
    marginTop: 15,
  },
  ortext:{
    marginHorizontal: 10, color: "#C2C4C8", fontFamily: "PlusJakartaSans-Regular", fontSize: 16,
  },
  linecontainer: {
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    width: '80%',
    backgroundColor: "#00165F",
    marginTop: 22,
    alignItems: "center",
    borderRadius: 6,
    height:46,
    justifyContent: "center",
  },
  testSignUp: {
    color: "#F3F5F5",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "PlusJakartaSans-Bold",
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
    fontFamily: "PlusJakartaSans-Medium",
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
    fontFamily: "PlusJakartaSans-Bold",
    marginRight: 3,
  }
});
