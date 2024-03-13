import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ImageBackground,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Audio } from "expo-av";
import { AddEmoji } from "../../assets";
import FileViewer from "react-native-file-viewer";

import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { AttachmentModal } from "../message/attachment_modal";
import { PreviewModal } from "../message/preview_modal";
import { ContactModal } from "../message/contact_modal";
import {
  DirectoryPickerResponse,
  DocumentPickerResponse,
} from "react-native-document-picker";

import { EmojiModal } from "../message/emoji_picker_modal";
import { HtmlView } from "../message/html_view";
import { HtmlEditorView } from "../message/html_editor";
import { useKeyboard } from "../message/keyBoardHeight";

import { Divider } from "../../components";
import {
  getRoom,
  removeStickerMessage,
  sendFiles,
  sendMessage,
  sendStickerMessage,
  sendThreadMessage,
} from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { AsyncThunkAction } from "@reduxjs/toolkit";
import { Room } from "matrix-js-sdk";
import { Dispatch, AnyAction } from "redux";

import { RoomEvent } from "matrix-js-sdk";

import { get } from "lodash";
import { MessageOptionModal } from "../message";
interface MessageDataType {
  userId: Number;
  userName: string;
  userImage: any;
  status: boolean;
  message: string;
  date: any;
  alreadySend: boolean;
  emojiArray: any;
  itemState: boolean;
  msgType: string;
  image: string;
  video: string;
  contact: any;
  emoji: any;
  document: any;
  music: any;
}
export const MessageThreads = (props) => {
  const MessageInfo: MessageDataType = JSON.parse(props.route.params.item);
  //console.log("Message Thread Info ==> ",messageInfo)
  const dispatch = useDispatch<Dispatch<any>>();
  const [messageInfo, setMessageInfo] = useState<any>(MessageInfo);
  const keyboardHeight = useKeyboard();
  const refScroll = useRef<ScrollView>(null);
  const navigation = useNavigation<any>();
  const [sendShowButton, setSendShowButton] = useState<boolean>(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [textMessage, setTextMessage] = useState<string>("");
  const [messageList, setMessagesList] = useState<any>([]);
  const [messageSectionList, setMessageSectionList] = useState<any>([]);
  const [updateSelectedItem, setUpdateSelectedItem] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isAudio, setIsAudio] = useState<boolean>(false);
  const [selectedUrl, setSelectedUrl] = useState<any>("");
  const [showPreviewItem, setShowPreviewItem] = useState<boolean>();
  const [imageData, setImageData] = useState<any>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [contactList, setContactList] = useState<any>([]);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<any>(undefined);
  const [selectMimeType, setSelectMimeType] = useState<string>("");
  const [selectPreviewType, setSelectPreviewType] = useState<string>("");
  const [selectPreviewContact, setSelectedPreviewContact] =
    useState<any>(undefined);

  const [docResult, setDocResult] = React.useState<
    | Array<DocumentPickerResponse>
    | DirectoryPickerResponse
    | undefined
    | null
    | any
  >();
  const [showHighlightedUser, setShowHighlightedUser] = useState<any>();
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<any>();
  const [msgSent, setMsgSent] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<string>("");
  const [uploadData, setUploadData] = useState<any>([]);
  const [documentState, setDocumentState] = useState<any>();
  const [audioPlaying, setAudioPlaying] = React.useState<Boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loaderVisible, setLoaderVisible] = React.useState<boolean>(false);

  const [showOptionModal, setShowOptionModal] = React.useState<boolean>(false);
  const [selectEmojiItem, setSelectEmojiItem] = React.useState<any>();
  const [deleteMessage, setDeleteMessage] = React.useState<boolean>(false);
  const [taggingModal, setTaggingModal] = useState<boolean>(false);

  const [htmlHeight, setHtmlheight] = useState<number>(0);
  const [updateItem, setUpdateItem] = useState<boolean>(false);
  const [previousChatRoladed, setPreviousChatLoaded] =
    React.useState<boolean>(false);
  const [roomMembers, setRoomMembers] = React.useState<any>();
  const [event, setEvent] = React.useState<any>();
  const [isBottomScroll, setIsBottomScroll] = React.useState<boolean>(false);

  const {
    roomStatus,
    loadMoreStatus,
    loadMoreMessagesList,
    currentEvent,
    currentWorkspaceData,
    getUserData,
    room,
    channelData,
  } = useSelector((state: any) => ({
    roomStatus: state.chatStore.roomStatus,
    loadMoreStatus: state.chatStore.loadMoreStatus,
    loadMoreMessagesList: state.chatStore.loadMoreMessagesList,
    currentEvent: state.chatStore.currentEvent,
    currentWorkspaceData: state.workspaceStore.currentWorkspaceData,
    getUserData: state.userStore.getUserData,
    room: state.chatStore.room,
    channelData: state.chatStore.channelData,
  }));

  function isEmpty(obj: any) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return true;
  }

  useEffect(() => {
    if (isEmpty(room)) {
      console.log("Calling 1");
      dispatch(getRoom({ roomId: messageInfo.roomId }));
    } else {
      console.log("Calling 2");
      setRoomMembers(get(room, "currentState", "")["members"]);
    }
  }, [room]);

  useEffect(() => {
    setIsBottomScroll(true);
    setMessagesList(messageInfo.thread);
    splitData(messageInfo.thread);
  }, []);

  useEffect(() => {
    if (previousChatRoladed === true) {
      if (currentEvent !== undefined) {
        console.log("I am here ==> ", currentEvent);
        // if (
        //   currentEvent.event !== undefined &&
        //   currentEvent.event.getContent() !== undefined &&
        //   currentEvent.event.getContent()["m.relates_to"] != undefined
        // ) {
        //   createArrayFromTimeline(currentEvent.event);
        // }

        if (
          currentEvent.event !== undefined &&
          currentEvent.event.getContent() !== undefined
        ) {
          createArrayFromTimeline(currentEvent.event);
        }
      }
    }
  }, [currentEvent]);

  const createArrayFromTimeline = (timeline) => {
    console.log("Item timeline 1==> ", timeline);
    console.log("Item timeline 2==> ", timeline.getContent());
    let msgss = messageList;
    insertItem(timeline, msgss, false);
    setMessagesList(msgss);
    splitData(msgss);
  };

  const insertItem = (item: any, msgs: any, inNewItem: boolean) => {
    var currentTime = new Date(item.getTs());
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;
    var msgTime = new Date(
      currentTime.getTime() + (ISTOffset + currentOffset) * 60000
    );

    const timelineItem = item;
    if (timelineItem.getType() === "m.room.message") {
      if (timelineItem.getContent()["m.relates_to"] !== undefined) {
        if (
          timelineItem.getContent()["m.relates_to"].event_id ===
          messageInfo.eventId
        ) {
          const threadItem = timelineItem.getContent();
          if (threadItem["m.relates_to"] !== undefined) {
            var msgType = "text";
            if (
              timelineItem.getContent().msgtype === "m.text" &&
              timelineItem.getContent().msgtype === "m.api"
            ) {
              msgType = "text";
            } else if (timelineItem.getContent().msgtype === "m.image") {
              msgType = "image";
            } else if (timelineItem.getContent().msgtype === "m.video") {
              msgType = "video";
            } else if (timelineItem.getContent().msgtype === "m.file") {
              msgType = "document";
            } else if (timelineItem.getContent().msgtype === "m.audio") {
              msgType = "music";
            }

            var documents: any = [];
            if (msgType === "document") {
              const document = {
                fileCopyUri: timelineItem.getContent().url,
                name: timelineItem.getContent().info.name,
                type: timelineItem.getContent().info.mimetype,
                size: timelineItem.getContent().info.size,
                uri: timelineItem.getContent().url,
              };
              documents.push(document);
            }

            var music: any = undefined;
            if (msgType === "music") {
              music = {
                name: timelineItem.getContent().info.name,
                uri: timelineItem.getContent().url,
              };
            }
            const msgBody = {
              userName: roomMembers[timelineItem.getSender()]["rawDisplayName"],
              userImage: "",
              status: true,
              message:
                timelineItem.getContent().msgtype === "m.text"
                  ? updatedMessage(timelineItem.getContent().body)
                  : timelineItem.getContent().msgtype === "m.api"
                  ? "<div><a href=" +
                    timelineItem.getContent().url +
                    ">" +
                    timelineItem.getContent().url +
                    "</a></div>"
                  : // ? "<div><a href="+timelineItem.getContent().url+">"+timelineItem.getContent().url+"<iframe src="+timelineItem.getContent().url + "></iframe></a></div>"
                    "",
              date: msgTime,
              alreadySend:
                msgs.length > 0
                  ? msgs[msgs.length - 1].sender === timelineItem.getSender()
                    ? true
                    : false
                  : false,
              emojiArray: [],
              itemState: false,
              msgType: msgType,
              image:
                timelineItem.getContent().msgtype === "m.image"
                  ? timelineItem.getContent().url
                  : "",
              video:
                timelineItem.getContent().msgtype === "m.video"
                  ? timelineItem.getContent().url
                  : "",
              contact: undefined,
              emoji: undefined,
              document:
                timelineItem.getContent().msgtype === "m.file"
                  ? documents
                  : undefined,
              music:
                timelineItem.getContent().msgtype === "m.audio"
                  ? music
                  : undefined,
              eventId: timelineItem.getId(),
              sender: timelineItem.getSender(),
              roomId: messageInfo.roomId,
            };
            msgs.push(msgBody);
            setIsBottomScroll(true);
          }
        }
      }
    } else if (timelineItem.getType() === "m.reaction") {
      if (timelineItem.getContent()["m.relates_to"] !== undefined) {
        const reactionItem = timelineItem.getContent();
        if (reactionItem["m.relates_to"] !== undefined) {
          if (reactionItem["m.relates_to"].event_id === messageInfo.eventId) {
            const emojiItem = {
              item: reactionItem["m.relates_to"].key,
              eventId: timelineItem.getId(),
              userId: timelineItem.getSender(),
            };
            messageInfo.emojiArray.push(emojiItem);
          } else {
            const reactionItemIndex = msgs.findIndex(
              (x) => x.eventId === reactionItem["m.relates_to"].event_id
            );
            console.log("reactionItemIndex ==> ", reactionItemIndex);
            const reactionMainItem = msgs[reactionItemIndex];
            if (reactionMainItem !== undefined) {
              const emojiItem = {
                item: reactionItem["m.relates_to"].key,
                eventId: timelineItem.getId(),
                userId: timelineItem.getSender(),
              };
              reactionMainItem.emojiArray.push(emojiItem);
            }
          }
        }
      }
      setIsBottomScroll(false);
    } else if (timelineItem.getType() === "m.room.redaction") {
      console.log("AAAAAAAAAAAaa ", timelineItem.getAssociatedId());
      console.log("BBBBBBBBBBBbbbbb ", messageInfo.eventId);

      const mainEmojiReducIndex = messageInfo.emojiArray.findIndex(
        (x) => x.eventId === timelineItem.getAssociatedId()
      );

      if (mainEmojiReducIndex !== -1) {
        messageInfo.emojiArray.splice(mainEmojiReducIndex, 1);
        return;
      }

      const reductionItemIndex = msgs.findIndex(
        (x) => x.eventId === timelineItem.getAssociatedId()
      );

      if (reductionItemIndex !== -1) {
        msgs.splice(reductionItemIndex, 1);
      } else {
        msgs.forEach((element) => {
          const emojiIndex = element.emojiArray.findIndex(
            (x) => x.eventId === timelineItem.getAssociatedId()
          );
          if (emojiIndex !== -1) {
            element.emojiArray.splice(emojiIndex, 1);
          }
        });
      }
      setIsBottomScroll(false);
    }
  };

  useEffect(() => {
    if (selectEmojiItem !== undefined) {
      const emoji = selectEmojiItem.data.filter(
        (item) =>
          item.userId ===
          matrixQualifiedUserId(getUserData.data.userByToken.matrixUsername)
      );
      if (emoji.length > 0) {
        removeStickerMessage(messageInfo.roomId, emoji[0].eventId);
      } else {
        sendStickerMessage(
          messageInfo.roomId,
          messageInfo.eventId,
          selectEmojiItem.title
        );
      }
    }
  }, [selectEmojiItem]);

  useEffect(() => {
    if (deleteMessage === true) {
      if (event !== undefined) {
        removeStickerMessage(messageInfo.roomId, event.eventId);
      }
      setEvent(undefined);
      setDeleteMessage(false);
    }
  }, [deleteMessage]);

  const splitData = (input) => {
    const sortList = input.sort((a, b) => a.date - b.date);

    const result = sortList.reduce((accum, current) => {
      let dateGroup = accum.find(
        (x) =>
          new Date(x.title).toLocaleDateString() ===
          new Date(current.date).toLocaleDateString()
      );
      if (!dateGroup) {
        dateGroup = { title: current.date, data: [] };
        accum.push(dateGroup);
      }
      dateGroup.data.push(current);
      return accum;
    }, []);

    setMessageSectionList(result);
    setTextMessage("");
    setSendShowButton(false);
    setPreviousChatLoaded(true);

    if (isBottomScroll === true) {
      setIsBottomScroll(false);
      setTimeout(() => {
        refScroll.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const getUnique = (arr, index) => {
    const unique = arr
      .map((e) => e[index])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e]);
    return unique;
  };

  useEffect(() => {
    console.log(
      "data",
      messageInfo.roomId,
      currentWorkspaceData.organizationId,
      currentWorkspaceData._id
    );
  }, []);

  const [Sound, setSound] = React.useState<any>();
  React.useEffect(() => {
    return Sound
      ? () => {
          console.log("Unloading Sound");
          Sound.unloadAsync();
        }
      : undefined;
  }, [Sound]);
  useEffect(() => {
    var obj = {};
    for (var i = 0; i < hightlighted.length; i++) {
      var split = hightlighted[i].split("<:>");
      obj[split[0].trim()] = split[1].trim();
    }
    setShowHighlightedUser(obj);
  }, []);

  useEffect(() => {
    if (
      selectedUrl !== null &&
      selectedUrl !== undefined &&
      selectedUrl !== ""
    ) {
      console.log("Selected URL", selectedUrl, " ", selectMimeType);
      async function messagesend() {
        const data = await sendFiles(
          { roomId: messageInfo.roomId },
          {
            file: {
              type: selectMimeType,
              uri: selectedUrl?.url,
              name: selectedUrl?.file?.name,
              size: selectedUrl?.file?.size,
            },
            url: selectedUrl?.url,
            roomId: messageInfo.roomId,
          },
          messageInfo.eventId
        );
        console.log(data);
      }
      messagesend();
      sendmessage(
        selectMimeType,
        "",
        selectedUrl?.file?.uri ?? "",
        undefined,
        undefined,
        undefined,
        undefined
      );
    }
  }, [selectedUrl]);

  useEffect(() => {
    if (
      textMessage !== null &&
      textMessage !== undefined &&
      textMessage !== ""
    ) {
      console.log("textMessage", textMessage);
      async function messagesend() {
        const data = await sendThreadMessage(
          messageInfo.roomId,
          messageInfo.eventId,
          textMessage,
          currentWorkspaceData.organizationId,
          currentWorkspaceData._id
        );
        console.log(data);
      }
      messagesend();
      sendmessage(
        "text",
        textMessage,
        "",
        undefined,
        undefined,
        undefined,
        undefined
      );
    }
  }, [msgSent]);

  useEffect(() => {
    if (selectedContact !== null && selectedContact !== undefined) {
      sendmessage(
        "contact",
        "",
        "",
        selectedContact,
        undefined,
        undefined,
        undefined
      );
    }
  }, [selectedContact]);

  useEffect(() => {
    console.log("selectedEmoji", selectedEmoji, event);
    if (selectedEmoji !== null && selectedEmoji !== undefined) {
      if (event === undefined) {
        async function messagesend() {
          const data = await sendThreadMessage(
            messageInfo.roomId,
            messageInfo.eventId,
            selectedEmoji,
            currentWorkspaceData.organizationId,
            currentWorkspaceData._id
          );
          console.log(data);
        }
        messagesend();
        sendmessage(
          "emoji",
          "",
          "",
          undefined,
          selectedEmoji,
          undefined,
          undefined
        );
      } else {
        const emojiIndex = event.emojiArray.findIndex(
          (x) => x.item === selectedEmoji
        );
        if (emojiIndex === -1) {
          sendStickerMessage(messageInfo.roomId, event.eventId, selectedEmoji);
          setEvent(undefined);
        }
      }
    }
  }, [selectedEmoji]);

  useEffect(() => {
    if (docResult !== null && docResult !== undefined) {
      console.log("doc", documentState);
      async function messagesend(item: any) {
        const data = await sendFiles(
          { roomId: messageInfo.roomId },
          {
            file: {
              type: item.file.type,
              uri: item?.url,
              name: item?.file.name,
              size: item?.file.size,
            },
            url: item?.url,
            roomId: messageInfo.roomId,
          }
        );
        console.log(data);
      }
      docResult.map((item: any, index: number) => {
        messagesend(item);
        sendmessage(
          "document",
          "",
          "",
          undefined,
          undefined,
          [documentState[index]],
          undefined
        );
      });
    }
  }, [docResult]);

  useEffect(() => {
    if (audioFile !== "") {
      sendmessage(
        "music",
        "",
        "",
        undefined,
        undefined,
        undefined,
        JSON.parse(audioFile)
      );
    }
  }, [audioFile]);

  const sendmessage = (type, oldtext, url, contact, emoji, document, music) => {
    setSelectedUrl("");
    setSelectedContact(undefined);
    setDocResult(undefined);
    setSelectMimeType("");
    setSelectedEmoji(undefined);
    setAudioFile("");
  };

  const matrixQualifiedUserId = (user_id) => {
    const updateMatrixId = "@" + user_id + ":matrix.onetab.ai";
    return updateMatrixId;
  };

  const replaceSubString = (mainString, oldString, newString) => {
    const re = new RegExp(oldString, "g");
    var new_str = mainString.replace(re, newString);
    return new_str;
  };

  const updateText = (text) => {
    const aa = replaceSubString(text, "<p", "<div");
    const bb = replaceSubString(aa, "</p>", "</div>");
    return bb;
  };

  const updatedMessage = (text) => {
    if (text.indexOf("mention_click") !== -1) {
      const newText =
        `
          <div onmousedown="return false" onselectstart="return false">
          <style>
          .mention_click {
                  color: #3C5DB9;
                  background-color: #3C5DB940;
                  display:inline-block;
                  margin:0px;
                  border:none;
                }
            </style>` +
        text +
        `</div>`;
      const finalText = updateText(newText);
      return finalText;
    } else {
      const newText =
        `
          <div onmousedown="return false" onselectstart="return false">` +
        text +
        `</div>`;
      const finalText = updateText(newText);
      return finalText;
    }
  };

  const hightlightedStringArray = ["@Channel"];

  const hightlighted = [
    "@Channel <:> " +
      `<script>
      function clickYourButton(data) {
        window.ReactNativeWebView.postMessage(data)
      }     
    </script>
    <button onclick="clickYourButton('@Channe')" style="color:#3C5DB9;background-color:#3C5DB940;display:inline-block;margin:0px;border:none;">
      @Channel
      </button>`,
  ];
  hightlighted.push(
    "@channel <:> " +
      `<script>
      function clickYourButton(data) {
        window.ReactNativeWebView.postMessage(data)
      }     
      </script>
      <button onclick="clickYourButton('@channel')" style="color:#3C5DB9;background-color:#3C5DB940;display:inline-block;margin:0px;border:none;">
      @channel
      </button>`
  );

  const checkUser = (text) => {
    checkUrls(text);
    if (text.indexOf("@") !== -1) {
      var newText = text;
      for (var i = 0; i < hightlightedStringArray.length; i++) {
        newText = newText
          .split(hightlightedStringArray[i])
          .join(showHighlightedUser[hightlightedStringArray[i]]);
      }
      const checkUrltext = checkUrls(newText);
      return checkUrltext;
    } else {
      const checkUrltext = checkUrls(text);
      return checkUrltext;
    }
  };

  const insertAt = (mainString, index, subString) => {
    if (index > 0) {
      return (
        mainString.substring(0, index) +
        subString +
        mainString.substring(index, mainString.length)
      );
    }
    return subString + mainString;
  };

  const checkUrls = (inputText) => {
    if (
      inputText.indexOf("https") != -1 ||
      inputText.indexOf("www") != -1 ||
      inputText.indexOf("@") !== -1
    ) {
      var replacedText, replacePattern1, replacePattern2, replacePattern3;

      replacedText = inputText.replace("<div>", "");
      replacedText = replacedText.replace("</div>", "");
      //URLs starting with http://, https://, or ftp://
      replacePattern1 =
        /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      replacedText = replacedText.replace(
        replacePattern1,
        '<a href="$1">$1</a>'
      );

      //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(
        replacePattern2,
        '$1<a href="http://$2">$2</a>'
      );

      //Change email addresses to mailto:: links.
      replacePattern3 =
        /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
      replacedText = replacedText.replace(
        replacePattern3,
        '<a href="mailto:$1">$1</a>'
      );

      replacedText = insertAt(replacedText, 0, "<div>");
      replacedText = insertAt(replacedText, replacedText.length, "</div>");

      return replacedText;
    } else {
      return inputText;
    }
  };

  const msgSlot = (date: any) => {
    //console.log("My date => ",date)
    var today = new Date();
    var myData = new Date(date);
    var isToday = today.toDateString() == myData.toDateString();
    if (isToday === true) {
      return "Today";
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var isYesturday = yesterday.toDateString() === myData.toDateString();
    if (isYesturday === true) {
      return "Yesturday";
    }

    const currentYear = moment(new Date()).year();
    const msgYear = moment(date).year();
    if (currentYear === msgYear) {
      const formatttedDate = moment(date).format("MMM DD");
      return formatttedDate;
    } else {
      const formatDate = moment(date).format("ll");
      return formatDate;
    }
  };

  const formatAMPM = (date: any) => {
    const formatttedDate = moment(date).format("h:mm a");
    return formatttedDate;
  };

  async function playSound(uri: any) {
    setAudioPlaying(true);
    const { sound } = await Audio.Sound.createAsync({ uri: uri });
    setSound(sound);
    console.log("Playing Sound", sound);
    const res = await sound.playAsync();
  }
  async function pauseSound() {
    setAudioPlaying(false);
    const res = await Sound.playAsync();
  }

  const splitPoints = (emojiList: any) => {
    const result = emojiList.reduce((accum: any, current: any) => {
      let dateGroup = accum.find((x: any) => x.title === current.item);
      if (!dateGroup) {
        dateGroup = { title: current.item, data: [] };
        accum.push(dateGroup);
      }
      dateGroup.data.push(current);
      return accum;
    }, []);
    // if (result.length > 0) {
    //   console.log("Split item ==> ", result[0].data);
    // }
    return result;
  };

  const updateEmojiItem = (item: any, event: any) => {
    if (event === undefined) {
      const emoji = item.data.filter(
        (item) =>
          item.userId ===
          matrixQualifiedUserId(getUserData.data.userByToken.matrixUsername)
      );
      if (emoji.length > 0) {
        removeStickerMessage(messageInfo.roomId, emoji[0].eventId);
      } else {
        sendStickerMessage(messageInfo.roomId, messageInfo.eventId, item.title);
      }
    } else {
      const emoji = item.data.filter(
        (item) =>
          item.userId ===
          matrixQualifiedUserId(getUserData.data.userByToken.matrixUsername)
      );
      if (emoji.length > 0) {
        removeStickerMessage(messageInfo.roomId, emoji[0].eventId);
        setEvent(undefined);
      } else {
        sendStickerMessage(messageInfo.roomId, event.eventId, item.title);
        setEvent(undefined);
      }
    }
  };

  const renderItem = ({ subitem, index }) => {
    const item = subitem;
    //console.log("item ===> ", item);
    return (
      <>
        <View style={styles.topView}>
          <View style={styles.bodyView}>
            <View style={styles.chatImageMainView}>
              {item.userImage === "" ? (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#3866E6",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                >
                  {item.userName !== undefined && (
                    <Text
                      style={{
                        color: "#FFFFFF",
                        ////fontFamily: "PlusJakartaSans-Bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.userName.substring(0, 1)}
                    </Text>
                  )}
                </View>
              ) : (
                <ImageBackground
                  source={require("../../assets/images/app_logo.png")}
                  style={styles.msgUserPic}
                >
                  <Image
                    style={styles.msgUserPic}
                    source={{ uri: item.userImage }}
                    resizeMode="contain"
                  />
                </ImageBackground>
              )}

              <View style={styles.status}></View>
            </View>
            <View style={styles.infoView}>
              <View style={styles.userNameViewM}>
                <Text style={styles.userNameM}>{item.userName}</Text>
                <Text style={styles.dateView}>
                  {formatAMPM(new Date(item.date))}
                </Text>
              </View>
              <View>
                {
                  {
                    text: (
                      <HtmlView
                        htmltext={item.message}
                        htmlType={"thread"}
                        navigation={navigation}
                        item={item}
                        messageList={messageList}
                        index={index}
                        setCurrentItem={setCurrentItem}
                        setShowOptionModal={setShowOptionModal}
                        setEvent={setEvent}
                      />
                    ),
                    image: (
                      <TouchableOpacity
                        onPress={() => {
                          setPreviewUrl(item.image);
                          setSelectPreviewType("image");
                          setShowPreviewItem(true);
                        }}
                        onLongPress={() => {
                          setEvent(item);
                          setShowOptionModal(true);
                        }}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={styles.imageView}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ),
                    video: (
                      <TouchableOpacity
                        onPress={() => {
                          setPreviewUrl(item.video);
                          setSelectPreviewType("video");
                          setShowPreviewItem(true);
                        }}
                        onLongPress={() => {
                          setEvent(item);
                          setShowOptionModal(true);
                        }}
                      >
                        <View
                          style={{
                            width: Dimensions.get("window").width * 0.8,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ImageBackground
                            source={{ uri: item.video }}
                            style={{
                              width: Dimensions.get("screen").width * 0.8,
                              height: 200,
                              borderRadius: 10,
                              marginTop: 5,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            resizeMode="cover"
                          >
                            <View
                              style={{
                                width: 50,
                                height: 50,
                                backgroundColor: "#3866E6",
                                padding: 5,
                                borderRadius: 25,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <AntDesign
                                name="caretright"
                                size={25}
                                color="#FFFFFF"
                              />
                            </View>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    ),
                    contact: (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectPreviewType("contact");
                          setSelectedPreviewContact(item.contact);
                          setShowPreviewItem(true);
                        }}
                        onLongPress={() => {
                          setEvent(item);
                          setShowOptionModal(true);
                        }}
                      >
                        <View
                          style={{
                            width: Dimensions.get("window").width * 0.8,
                            flexDirection: "row",
                            padding: 10,
                            backgroundColor: "#557FF1",
                            marginRight: 20,
                            borderRadius: 10,
                            marginTop: 5,
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: "#3866E6",
                                  width: 36,
                                  height: 36,
                                  borderRadius: 18,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#FFFFFF",
                                  }}
                                >
                                  {item.contact !== undefined &&
                                    item.contact.name !== undefined &&
                                    item.contact.name.substring(0, 1)}
                                </Text>
                              </View>

                              <Text
                                style={{
                                  marginLeft: 10,
                                  color: "#FFFFFF",
                                  fontSize: 14,
                                  //fontFamily: "PlusJakartaSans-Regular",
                                }}
                              >
                                {item.contact !== undefined &&
                                  item.contact.name !== undefined &&
                                  item.contact.name}
                              </Text>
                            </View>

                            <View
                              style={{
                                width: "100%",
                                height: 1,
                                backgroundColor: "#DEDEDE",
                                marginTop: 15,
                              }}
                            />
                            <View
                              style={{
                                marginTop: 5,
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: "#FFFFFF",
                                  fontSize: 14,
                                  ////fontFamily: "PlusJakartaSans-Bold",
                                }}
                              >
                                View Contact Info
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ),
                    emoji: (
                      <Text
                        style={{
                          fontSize: 40,
                        }}
                      >
                        {item.emoji}
                      </Text>
                    ),
                    document:
                      item.document !== undefined &&
                      item.document[0].type.split("/")[0] !== "image" ? (
                        item.document !== undefined &&
                        item.document[0].type.split("/")[0] !== "video" ? (
                          <TouchableOpacity
                            onPress={async () => {
                              await FileViewer.open(item.document[0].uri, {
                                showOpenWithDialog: true,
                              });
                            }}
                            onLongPress={() => {
                              setEvent(item);
                              setShowOptionModal(true);
                            }}
                          >
                            <View
                              style={{
                                width: Dimensions.get("window").width * 0.8,
                                flexDirection: "row",
                                padding: 10,
                                backgroundColor: "#557FF1",
                                marginRight: 20,
                                borderRadius: 10,
                                marginTop: 5,
                              }}
                            >
                              <View
                                style={{
                                  width: "100%",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      marginLeft: 10,
                                      color: "#FFFFFF",
                                      fontSize: 14,
                                      //fontFamily: "PlusJakartaSans-Regular",
                                    }}
                                  >
                                    {item.document !== undefined &&
                                      item.document[0].name !== undefined &&
                                      item.document[0].name}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    width: "100%",
                                    height: 1,
                                    backgroundColor: "#DEDEDE",
                                    marginTop: 15,
                                  }}
                                />
                                <View
                                  style={{
                                    marginTop: 5,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "#FFFFFF",
                                      fontSize: 14,
                                      ////fontFamily: "PlusJakartaSans-Bold",
                                    }}
                                  >
                                    View File
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ) : (
                          item.document !== undefined && (
                            <TouchableOpacity
                              onPress={() => {
                                setPreviewUrl(item.document[0].fileCopyUri);
                                setSelectPreviewType("video");
                                setShowPreviewItem(true);
                              }}
                              onLongPress={() => {
                                setEvent(item);
                                setShowOptionModal(true);
                              }}
                            >
                              <View
                                style={{
                                  width: Dimensions.get("window").width * 0.8,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <ImageBackground
                                  source={{
                                    uri: item.document[0].fileCopyUri,
                                  }}
                                  style={{
                                    width: Dimensions.get("screen").width * 0.8,
                                    height: 200,
                                    borderRadius: 10,
                                    marginTop: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  resizeMode="cover"
                                >
                                  <View
                                    style={{
                                      width: 50,
                                      height: 50,
                                      backgroundColor: "#3866E6",
                                      padding: 5,
                                      borderRadius: 25,
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <AntDesign
                                      name="caretright"
                                      size={25}
                                      color="#FFFFFF"
                                    />
                                  </View>
                                </ImageBackground>
                              </View>
                            </TouchableOpacity>
                          )
                        )
                      ) : (
                        item.document !== undefined && (
                          <TouchableOpacity
                            onPress={() => {
                              setPreviewUrl(item.document[0].fileCopyUri);
                              setSelectPreviewType("image");
                              setShowPreviewItem(true);
                            }}
                            onLongPress={() => {
                              setEvent(item);
                              setShowOptionModal(true);
                            }}
                          >
                            <Image
                              source={{ uri: item.document[0].fileCopyUri }}
                              style={styles.imageView}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        )
                      ),
                    music: (
                      <View
                        style={{
                          width: Dimensions.get("window").width * 0.8,
                          flexDirection: "row",
                          padding: 10,
                          backgroundColor: "#557FF1",
                          marginRight: 20,
                          borderRadius: 10,
                          marginTop: 5,
                        }}
                      >
                        <Pressable
                          onPress={() =>
                            audioPlaying
                              ? pauseSound()
                              : playSound(item.music.uri)
                          }
                        >
                          {audioPlaying ? (
                            <Ionicons name="ios-pause" size={24} color="red" />
                          ) : (
                            <Ionicons name="play" size={24} color="green" />
                          )}
                        </Pressable>
                        <Text>{item.music?.name}</Text>
                      </View>
                    ),
                  }[item.msgType]
                }
              </View>
              {/*reaction*/}
              {item.emojiArray.length > 0 && (
                <View style={styles.emojiContainer}>
                  {splitPoints(item.emojiArray).map((emojiItem, index) => {
                    return (
                      <TouchableOpacity
                        key={emojiItem + index}
                        onPress={() => {
                          updateEmojiItem(emojiItem, item);
                        }}
                      >
                        <View style={styles.emojiView}>
                          <Text style={styles.emojiCount}>
                            {emojiItem.title}
                          </Text>
                          <Text style={styles.emojiCount}>
                            {emojiItem.data.length}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    onPress={() => {
                      setEvent(item);
                      setShowEmoji(true);
                    }}
                  >
                    <View style={styles.addEmojiContainerView}>
                      <AddEmoji />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderSectionItem = (item: any) => {
    //console.log("Section Header item ==> ", item);
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.timeSlotView}>{msgSlot(item)}</Text>
        <View style={styles.halfDivider}></View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        {/*Header*/}
        <View>
          <View style={styles.headerContainer}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
              style={{ padding: 2 }}
            >
              <Ionicons name="chevron-back" size={26} color="#171C26" />
            </Pressable>
            <View style={{ marginLeft: 5 }}>
              <Text style={styles.headertitle}>Message</Text>
              <Text style={styles.headerSubtitle}>Direct Message</Text>
            </View>
          </View>

          <Divider />

          <ScrollView
            ref={refScroll}
            nestedScrollEnabled={true}
            style={{
              width: "100%",
              marginBottom:
                110 + (Platform.OS === "ios" ? keyboardHeight * 0.88 : 0),
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  padding: 12,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {messageInfo.userImage === "" ? (
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "#3866E6",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                    >
                      {messageInfo.userName !== undefined && (
                        <Text
                          style={{
                            color: "#FFFFFF",
                            ////fontFamily: "PlusJakartaSans-Bold",
                            textTransform: "capitalize",
                          }}
                        >
                          {messageInfo.userName.substring(0, 1)}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <ImageBackground
                      source={require("../../assets/images/app_logo.png")}
                      style={styles.msgUserPic}
                    >
                      <Image
                        style={styles.msgUserPic}
                        source={{ uri: messageInfo.userImage }}
                        resizeMode="contain"
                      />
                    </ImageBackground>
                  )}
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.userNameM}>{messageInfo.userName}</Text>
                    <Text style={styles.dateView}>
                      {formatAMPM(new Date(messageInfo.date))}
                    </Text>
                  </View>
                </View>
                <Pressable>
                  <Ionicons name="bookmark-outline" size={24} color="black" />
                </Pressable>
              </View>

              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  marginBottom: 5,
                }}
              >
                <HtmlView
                  htmltext={messageInfo.message}
                  htmlType={"threadItem"}
                  setWebViewHeight={setHtmlheight}
                  MessageInfo={messageInfo}
                  setMessageInfo={setMessageInfo}
                  setUpdateItem={setUpdateItem}
                  updateItem={updateItem}
                />

                {messageInfo.emojiArray.length > 0 && (
                  <View style={styles.emojiContainer}>
                    {splitPoints(messageInfo.emojiArray).map(
                      (emojiItem, index) => {
                        return (
                          <TouchableOpacity
                            key={emojiItem + index}
                            onPress={() => {
                              updateEmojiItem(emojiItem, undefined);
                            }}
                          >
                            <View style={styles.emojiView}>
                              <Text style={styles.emojiCount}>
                                {emojiItem.title}
                              </Text>
                              <Text style={styles.emojiCount}>
                                {emojiItem.data.length}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        setEvent(messageInfo);
                        setShowEmoji(true);
                      }}
                    >
                      <View style={styles.addEmojiContainerView}>
                        <AddEmoji />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Divider />

              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setKeyboardVisible(true);
                  }}
                >
                  {messageList.length === 0 ? (
                    <View style={{ flexDirection: "row" }}>
                      <MaterialIcons
                        name="chat"
                        size={24}
                        color="black"
                        style={{ marginTop: 3 }}
                      />
                      <Text style={styles.replyThread}>Reply in thread</Text>
                    </View>
                  ) : (
                    <Text style={styles.replyThread}>
                      {messageList.length}{" "}
                      {messageList.length === 1 ? "reply" : "replies"}
                    </Text>
                  )}
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="arrow-right-bold-outline"
                    size={24}
                    color="black"
                  />
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={24}
                    color="black"
                  />
                </View>
              </View>
              <Divider />

              {/*Message List view*/}
              <View
                style={{
                  marginTop: 15,
                  marginBottom: isKeyboardVisible ? 80 : 10,
                }}
              >
                {messageSectionList.length > 0 &&
                  messageSectionList.map((item, index) => {
                    return (
                      <View key={item.title + index}>
                        {renderSectionItem(item.title)}
                        {item.data.map((subitem, index) => {
                          return (
                            <View key={subitem + index}>
                              {renderItem({ subitem, index })}
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
              </View>
            </View>
          </ScrollView>
        </View>

        {/*Message input view*/}
        <HtmlEditorView
          isAudio={isAudio}
          isKeyboardVisible={isKeyboardVisible}
          textMessage={textMessage}
          setSendShowButton={setSendShowButton}
          setTextMessage={setTextMessage}
          setKeyboardVisible={setKeyboardVisible}
          setShowEmoji={setShowEmoji}
          setImageData={setImageData}
          setShowModal={setShowModal}
          sendShowButton={sendShowButton}
          setMsgSent={setMsgSent}
          setIsAudio={setIsAudio}
          msgSent={msgSent}
          setAudioFile={setAudioFile}
          fromThread={true}
        />

        <AttachmentModal
          showModal={showModal}
          setShowModal={setShowModal}
          setSelectedUrl={setSelectedUrl}
          imageData={imageData}
          setIsAudio={setIsAudio}
          setShowContactModal={setShowContactModal}
          setContactList={setContactList}
          setSelectMimeType={setSelectMimeType}
          setDocResult={setDocResult}
          setUploadData={setUploadData}
          ChannelInfo={messageInfo}
          setDocumentState={setDocumentState}
        />

        <PreviewModal
          showPreviewModal={showPreviewItem}
          setShowPreviewModal={setShowPreviewItem}
          uri={previewUrl}
          type={selectPreviewType}
          contact={selectPreviewContact}
        />

        <ContactModal
          showContactModal={showContactModal}
          setShowContactModal={setShowContactModal}
          contact={contactList}
          setSelectedContact={setSelectedContact}
          ChannelInfo={messageInfo}
          setUploadData={setUploadData}
        />

        <EmojiModal
          showEmoji={showEmoji}
          setShowEmoji={setShowEmoji}
          setSelectedEmoji={setSelectedEmoji}
        />

        <MessageOptionModal
          showModal={showOptionModal}
          setShowModal={setShowOptionModal}
          userId={matrixQualifiedUserId(
            getUserData.data.userByToken.matrixUsername
          )}
          event={event}
          selectEvent={setEvent}
          navigation={navigation}
          isFromThread={true}
          setShowEmoji={setShowEmoji}
          setDeleteMessage={setDeleteMessage}
          workspace_id={currentWorkspaceData._id}
          channnel_id={room?.summary?._id}
          timeline={loadMoreMessagesList?.room?.timeline?.filter(
            (item: any) => item.getId() === event?.eventId
          )}
          dispatch={dispatch}
          channelData={
            channelData?.data?.data?.channels?.filter(
              (item: any) => item._id === room?.summary?._id
            )[0]?.save_messages ?? []
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  imageMainView: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginLeft: 10,
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
    marginTop: 1,
    backgroundColor: "",
    justifyContent: "center",
  },
  bodyView: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 5,
  },
  chatImageMainView: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  infoView: {
    width: "100%",
  },
  bodyViewElse: {
    marginLeft: 60,
    marginTop: 5,
  },
  settingItemView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  settingItemTitle: {
    fontSize: 14,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#656971",
    marginLeft: 10,
  },
  memberViewContainer: {
    width: 80,
  },
  userPic: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  userNameView: {
    width: 60,
    alignItems: "center",
  },
  userName: {
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#171C26",
  },
  msgUserPic: {
    width: 30,
    height: 30,
  },
  userNameViewM: {
    flexDirection: "row",
    alignItems: "center",
  },
  userNameM: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171C26",
    //fontFamily: "PlusJakartaSans-SemiBold",
  },
  dateView: {
    fontSize: 10,
    fontWeight: "600",
    color: "#B0B1B1",
    marginLeft: 5,
    justifyContent: "center",
    //fontFamily: "PlusJakartaSans-Semibold",
  },
  highlightedText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#656971",
    //fontFamily: "PlusJakartaSans-Regular",
  },
  emojiContainer: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "center",
  },
  emojiView: {
    borderRadius: 20,
    backgroundColor: "#F3F5F5",
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 10,
  },
  emoji: {
    width: 20,
    height: 20,
  },
  emojiCount: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1E1F21",
    marginLeft: 4,
  },
  addEmojiContainerView: {
    borderRadius: 20,
    backgroundColor: "#F3F5F5",
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: "center",
  },
  sectionContainer: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  timeSlotView: {
    color: "#B0B1B1",
    fontSize: 10,
    fontWeight: "600",
    //fontFamily: "PlusJakartaSans-Semibold",
    textTransform: "uppercase",
  },
  halfDivider: {
    width: "80%",
    height: 1,
    backgroundColor: "#DEDEDE",
    marginLeft: 10,
    marginRight: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 4,
  },
  headerLeftView: {
    marginLeft: 10,
    justifyContent: "center",
    flexDirection: "row",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171C26",
    marginLeft: 8,
    //fontFamily: "PlusJakartaSans-Semibold",
  },
  headerDetailView: {
    fontSize: 10,
    fontWeight: "400",
    color: "#171C26",
    paddingHorizontal: 40,
    paddingVertical: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#DEDEDE",
    marginTop: 4,
  },
  channelInfoContainer: {
    flex: 1,
  },
  addPeopleView: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  addPeopleContainer: {
    width: "48%",
    height: 90,
    borderRadius: 20,
    backgroundColor: "#E8F1FF",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addPeopleText: {
    color: "#3866E6",
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-SemiBold",
  },
  searchContainer: {
    width: "48%",
    height: 90,
    borderRadius: 20,
    backgroundColor: "#E8F1FF",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  dividerWithMargin: {
    width: "100%",
    height: 1,
    backgroundColor: "#DEDEDE",
    marginTop: 10,
  },
  memberView: {
    paddingLeft: 20,
    marginTop: 10,
  },
  memberText: {
    color: "#171C26",
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Medium",
  },
  settingsText: {
    color: "#171C26",
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Medium",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  leaveChannelView: {
    height: 40,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#931726",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  leaveChannelText: {
    color: "#F3F5F5",
    fontSize: 14,
    ////fontFamily: "PlusJakartaSans-Bold",
    paddingLeft: 10,
  },
  msgListView: {
    position: "absolute",
    bottom: 60,
    top: 60,
  },
  sectionListStyle: {
    width: "100%",
    height: "100%",
    marginBottom: 10,
  },
  contentContainerStyle: {
    //flexGrow: 1,
    //justifyContent: "flex-end",
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#FFFFFF",
  },
  inputDivider: {
    height: 1,
    backgroundColor: "#DEDEDE",
  },
  inputMainView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  inputView: {
    width: "80%",
    padding: 10,
    backgroundColor: "#F0F4F6",
    borderRadius: 5,
  },
  sendButtonView: {
    //width: "20%",
    //flexDirection: "row",
    //justifyContent: "center",
    paddingRight: 20,
  },
  sendButton: {
    width: 22,
    height: 22,
    borderRadius: 12,
    backgroundColor: "#3866E6",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisable: {
    // width: "20%",
    // flexDirection: "row",
    justifyContent: "center",
    paddingRight: 20,
  },
  attachmentView: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  highlightedTextStyle: {
    backgroundColor: "#3C5DB940",
    color: "#3C5DB9",
  },
  imageView: {
    width: Dimensions.get("screen").width * 0.8,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  text: {
    color: "black",
    fontSize: 15,
    marginEnd: 100,
  },
  textMention: {
    backgroundColor: "#3C5DB940",
    color: "#3C5DB9",
  },
  textBold: {
    fontWeight: "bold",
  },
  textItalic: {
    fontStyle: "italic",
  },
  textBoldItalic: {
    fontWeight: "bold",
    fontStyle: "italic",
  },
  headerSubtitle: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#3C5DB9",
    marginLeft: 4,
  },
  headertitle: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#171C26",
    marginLeft: 4,
  },
  replyThread: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#171C26",
    marginLeft: 10,
  },
});
