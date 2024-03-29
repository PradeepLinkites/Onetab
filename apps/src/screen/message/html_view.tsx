import React, { useEffect, useState } from "react";
import {
  View,
  Linking,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { autoDetectLinkScript, inlineBodyStyle } from "../../components";

import { AutoHeightWebView } from "../../components";
import { RootRoutes } from "../../navigation/routes";

import RenderHtml from "react-native-render-html";

export const onError = ({ nativeEvent }) =>
  console.error("WebView error: ", nativeEvent);

export const onHeightLoadStart = () => {};

export const onHeightLoad = () => {};

export const onHeightLoadEnd = () => {};

export const onShouldStartLoadWithRequest = (result) => {
  return true;
};

export const HtmlView = (props) => {
  const {
    htmltext,
    htmlType,
    navigation,
    item,
    messageList,
    index,
    setCurrentItem,
    setWebViewHeight,
    MessageInfo,
    setMessageInfo,
    setUpdateItem,
    updateItem,
    setShowOptionModal,
    setEvent,
  } = props;

  //console.log("Html type ==> ", htmlType, htmltext);
  const [onMessageTriggre, setOnMessageTrigger] = useState<any>(undefined);

  const [{ widthStyle, heightStyle }, setStyle] = useState({
    heightStyle: null,
    widthStyle: inlineBodyStyle,
  });

  const [heightSize, setHeightSize] = useState({ height: 0, width: 0 });

  const [{ widthScript, heightScript }, setScript] = useState({
    heightScript: autoDetectLinkScript,
    widthScript: null,
  });

  useEffect(() => {
    if (setWebViewHeight !== undefined && setWebViewHeight != null) {
      setWebViewHeight(heightSize.height);
    }
  }, [heightSize]);

  const onMessage = (event) => {
    console.log("onMessage 1 ", event);
    if (event.nativeEvent === undefined) {
      const { data } = event;
      console.log("onMessage 2 ", data);
      const timer = setTimeout(() => {
        console.log("onMessage 3 ", data);
        navigation.navigate(RootRoutes.MessageThread, {
          item: JSON.stringify(data),
        });
      }, 1000);
      setOnMessageTrigger(timer);
    } else {
      //setOnMessageTrigger(true);
      console.log("onMessage 4 ", onMessageTriggre);
      if (onMessageTriggre !== undefined) {
        clearTimeout(onMessageTriggre);
        setOnMessageTrigger(undefined);
      }
      const { data } = event.nativeEvent;
      console.log("onMessage 5 ", data);
      if (data.substring(0, 1) === "@") {
        console.log("onMessage 4 ", data);
      } else {
        console.log("onMessage 5 ", data);
        let messageData;
        // maybe parse stringified JSON
        try {
          messageData = JSON.parse(data);
        } catch (e) {
          console.log(e.message);
        }
        if (typeof messageData === "object") {
          const { url, user } = messageData;
          if (url === "about:blank#") {
            console.log("onMessage 6 ", user);
          } else {
            if (url && url.startsWith("http")) {
              Linking.openURL(url).catch((error) =>
                console.error("An error occurred", error)
              );
            } else if (url) {
              Linking.openURL(url).catch((error) =>
                console.error("An error occurred", error)
              );
            }
          }
        }
      }
    }
  };

  function onPress(event, href, htmlAttribs) {
    if (href === "about:///blank") {
      alert(htmlAttribs.id);
    } else {
      Linking.openURL(href).catch((error) =>
        console.error("An error occurred", error)
      );
    }
  }

  return (
    <View>
      {
        {
          message: (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RootRoutes.MessageThread, {
                  item: JSON.stringify(item),
                });
              }}
              onLongPress={() => {
                setEvent(item);
                setShowOptionModal(true);
                console.log("Render view long Press");
              }}
              style={{
                width: Dimensions.get("window").width * 0.85,
                backgroundColor: "#FFFFFF",
              }}
            >
              <RenderHtml
                contentWidth={Dimensions.get("window").width}
                source={{ html: htmltext }}
                renderersProps={{ a: { onPress } }}
              />
            </TouchableOpacity>
          ),
          thread: (
            <TouchableOpacity
              onLongPress={() => {
                setEvent(item);
                setShowOptionModal(true);
              }}
              style={{
                width: Dimensions.get("window").width * 0.8,
                backgroundColor: "#FFFFFF",
              }}
            >
              <RenderHtml
                contentWidth={Dimensions.get("window").width * 0.8}
                source={{ html: htmltext }}
                renderersProps={{ a: { onPress } }}
              />
            </TouchableOpacity>
          ),
          placeHolder: (
            <AutoHeightWebView
              customStyle={heightStyle}
              onError={onError}
              onLoad={onHeightLoad}
              onLoadStart={onHeightLoadStart}
              onLoadEnd={onHeightLoadEnd}
              onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
              onSizeUpdated={setHeightSize}
              source={{
                html:
                  htmltext === ""
                    ? `<p style="font-weight: 100;font-style: normal;font-size: 14px;">Enter here...</p>`
                    : htmltext,
              }}
              customScript={heightScript}
              onMessage={(e) => {
                console.log("Clicked done ", e);
              }}
            />
          ),
          threadItem: (
            <TouchableOpacity
              style={{
                width: Dimensions.get("window").width * 0.8,
                backgroundColor: "#FFFFFF",
              }}
            >
              <RenderHtml
                contentWidth={Dimensions.get("window").width * 0.8}
                source={{ html: htmltext }}
                renderersProps={{ a: { onPress } }}
              />
            </TouchableOpacity>
          ),
          mainThread: (
            <View
              style={{
                width: Dimensions.get("window").width * 0.8,
                backgroundColor: "#FFFFFF",
              }}
            >
              <RenderHtml
                contentWidth={Dimensions.get("window").width * 0.8}
                source={{ html: htmltext }}
                defaultTextProps={{ numberOfLines: 2 }}
              />
            </View>
          ),
        }[htmlType]
      }
    </View>
  );
};
