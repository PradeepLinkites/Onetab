import React, { useEffect } from "react";
import { View, Platform, Image, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Navigation } from "./src/navigation";
import { initFonts } from "./assets/fonts";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  STORE_FEATURE_KEY,
  storeReducer,
  AUTH_FEATURE_KEY,
  authReducer,
  workspaceReducer,
  WORKSPACE_FEATURE_KEY,
  USER_FEATURE_KEY,
  userStoreReducer,
  API_FEATURE_KEY,
  apiStoreReducer,
  CHAT_FEATURE_KEY,
  chatReducer,
} from "./store";
import { ToastProvider } from "react-native-toast-notifications";
import { AuthProvider } from "./utils/userAuthContex";
import { getDeviceTokenToStorage } from "./utils/setUpContext";
import { RootRoutes } from "./src/navigation/routes";

const App = () => {
  const [contextData, setContextData] = React.useState("");
  const { width, height } = useWindowDimensions();
  useEffect(() => {
    syncContextData();
    initFonts();
  }, []);

  const syncContextData = async () => {
    const res = await getDeviceTokenToStorage();
    setContextData(res);
    console.log(res);
  };

  const Store = configureStore({
    reducer: {
      [STORE_FEATURE_KEY]: storeReducer,
      [AUTH_FEATURE_KEY]: authReducer,
      [WORKSPACE_FEATURE_KEY]: workspaceReducer,
      [USER_FEATURE_KEY]: userStoreReducer,
      [API_FEATURE_KEY]: apiStoreReducer,
      [CHAT_FEATURE_KEY]: chatReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  });

  return (
    <Provider store={Store}>
      <ToastProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            paddingTop: Platform.OS === "android" ? 0 : 0,
          }}
        >
          <View style={{ flex: 1 }}>
            {contextData === "" ? (
              <Image
                source={require("./assets/image/Splash.png")}
                style={{ maxHeight: height, maxWidth: width }}
              />
            ) : (
              <AuthProvider
                value={contextData}
                childern={
                  <Navigation
                    route={
                      contextData === undefined || contextData === null
                        ? RootRoutes.SignIn_Screen
                        : RootRoutes.Splash_Screen
                    }
                    prop={contextData}
                  />
                }
              />
            )}
            <StatusBar hidden={false} />
          </View>
        </View>
      </ToastProvider>
    </Provider>
  );
};

export default App;
