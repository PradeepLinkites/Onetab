import * as Font from "expo-font";

export const initFonts = async () => {
  // Refer to ./assets/fonts/custom-fonts.md for instructions.
  // ...
  // Welcome back! Just uncomment this and replace/append with your font file names!
  // ⬇
  // await Font.loadAsync({
  //   Montserrat: require("./Montserrat-Regular.ttf"),
  //   "Montserrat-Regular": require("./Montserrat-Regular.ttf"),
  // })
  await Font.loadAsync({
    "PlusJakartaSans-ExtraLight": require("./PlusJakartaSans-ExtraLight.ttf"),
    "PlusJakartaSans-Light": require("./PlusJakartaSans-Light.ttf"),
    "PlusJakartaSans-Regular": require("./PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("./PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("./PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Bold": require("./PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-ExtraBold": require("./PlusJakartaSans-ExtraBold.ttf"),
    "PlusJakartaSans-ExtraLightItalic": require("./PlusJakartaSans-ExtraLightItalic.ttf"),
    "PlusJakartaSans-LightItalic": require("./PlusJakartaSans-LightItalic.ttf"),
    "PlusJakartaSans-Italic": require("./PlusJakartaSans-Italic.ttf"),
    "PlusJakartaSans-MediumItalic": require("./PlusJakartaSans-MediumItalic.ttf"),
    "PlusJakartaSans-SemiBoldItalic": require("./PlusJakartaSans-SemiBoldItalic.ttf"),
    "PlusJakartaSans-BoldItalic": require("./PlusJakartaSans-BoldItalic.ttf"),
    "PlusJakartaSans-ExtraBoldItalic": require("./PlusJakartaSans-ExtraBoldItalic.ttf"),
  });
};
