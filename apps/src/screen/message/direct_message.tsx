import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  DefaultSectionT,
  Pressable,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { BackIcon } from "../../assets";

import ListComponent from "./ListComponent";

import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { AttachmentModal } from "./attachment_modal";
import { PreviewModal } from "./preview_modal";
import { ContactModal } from "./contact_modal";
import {
  DirectoryPickerResponse,
  DocumentPickerResponse,
} from "react-native-document-picker";

import { EmojiModal } from "./emoji_picker_modal";
import { HtmlEditorView } from "./html_editor";
import { useKeyboard } from "./keyBoardHeight";
import { channelStatus } from "../home";
import { RootRoutes } from "../../navigation/routes";
import {
  getRoom,
  getUserNameForDirectMessage,
  loadMoreMessages,
  removeStickerMessage,
  resetStatus,
  sendStickerMessage,
} from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { sendFiles, sendMessage } from "../../../store";
import { MessageOptionModal } from "./message_option_modal";
import { TaggingModal } from "./taggingModel";

interface OptionDataType {
  title: string;
  isMine: boolean;
  isDeleted: boolean;
  press: any;
}

export const DirectMessage = (props: any) => {
  const dispatch = useDispatch<Dispatch<any>>();
  const ChannelInfo = JSON.parse(props?.route?.params?.item ?? "") ?? {};
  // console.log("Direct message ==> ", ChannelInfo);
  const RoomInfo = ChannelInfo.matrixRoomInfo.membersInfo;

  const keyboardHeight = useKeyboard();
  const refFlatList = useRef<SectionList<any, DefaultSectionT>>(null);
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
  const [mention, setMention] = useState([]);
  const [audioFile, setAudioFile] = useState<string>("");
  const [uploadData, setUploadData] = useState<any>([]);
  const [documentState, setDocumentState] = useState<any>();
  const [audioPlaying, setAudioPlaying] = React.useState<Boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loaderVisible, setLoaderVisible] = React.useState<boolean>(false);
  const [visibleMessageCount, setVisibleMessageCount] = useState<number>(0);
  const [showOptionModal, setShowOptionModal] = React.useState<boolean>(false);
  const [event, setEvent] = React.useState<any>();
  const [selectEmojiItem, setSelectEmojiItem] = React.useState<any>();
  const [deleteMessage, setDeleteMessage] = React.useState<boolean>(false);
  // const [taggingModal, setTaggingModal] = useState<boolean>(false);

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

  useEffect(() => {
    console.log("Channel message 7 ==> ", ChannelInfo.matrixRoomId);
    dispatch(getRoom({ roomId: ChannelInfo.matrixRoomId }));
  }, []);

  useEffect(() => {
    console.log("channel message 3 ", roomStatus);
    if (roomStatus === "loaded") {
      loadMore();
    }
  }, [roomStatus]);

  const loadMore = () => {
    console.log("Channel message 5 ");
    setLoaderVisible(true);
    setMessagesList([]);
    dispatch(loadMoreMessages(false));
  };

  useEffect(() => {
    console.log("Channel message 1 ", loadMoreStatus);
    //console.log("Channel message 1 ", loadMoreMessagesList);
    if (loadMoreStatus === "loaded") {
      if (
        loadMoreMessagesList.room !== undefined &&
        loadMoreMessagesList.room.timeline !== undefined
      ) {
        createArrayFromTimeline(loadMoreMessagesList.room.timeline);
      }
    }
  }, [loadMoreStatus]);

  const createArrayFromTimeline = (timeline) => {
    if (timeline.length === 0) {
      setLoaderVisible(false);
      return;
    }
    let msgs = messageList;
    console.log("Channel message before ", msgs.length);

    timeline.map((item: any, index: number) => {
      insertItem(item, msgs, false);
    });

    console.log("Channel message after ", msgs.length);
    if (msgs.length === 0 || msgs.length === visibleMessageCount) {
      loadMore();
    } else {
      setVisibleMessageCount(msgs.length);
      //console.log("Channel message 3 ", msgs);
      setMessagesList(msgs);
      splitData(msgs, false);
    }
  };

  const insertItem = (item: any, msgs: any, inNewItem: boolean) => {
    var currentTime = new Date(item.getTs());
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;
    var msgTime = new Date(
      currentTime.getTime() + (ISTOffset + currentOffset) * 60000
    );

    const timelineItem = item;

    if (timelineItem.getType() === "m.room.member") {
      if (
        timelineItem.getContent().membership === "join" ||
        timelineItem.getContent().membership === "leave"
      ) {
        const msgBody = {
          userName: timelineItem.getContent().displayname,
          userImage:
            timelineItem.getContent().avatar_url === undefined
              ? ""
              : timelineItem.getContent().avatar_url,
          status: true,
          message:
            timelineItem.getContent().membership === "join"
              ? "Joined channel"
              : timelineItem.getContent().membership === "leave"
              ? "Leaved channel"
              : "",
          date: msgTime,
          alreadySend: false,
          emojiArray: [],
          itemState: false,
          msgType: "join",
          image: "",
          video: "",
          contact: undefined,
          emoji: undefined,
          document: undefined,
          music: undefined,
          eventId: timelineItem.getId(),
          sender: timelineItem.getSender(),
          thread: [],
          roomId: ChannelInfo.matrixRoomId,
        };
        msgs.push(msgBody);
      }
    } else if (timelineItem.getType() === "m.room.message") {
      const threadItem = timelineItem.getContent();
      if (threadItem["m.relates_to"] !== undefined) {
        const reactionItemIndex = msgs.findIndex(
          (x) => x.eventId === threadItem["m.relates_to"].event_id
        );
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
          userName:
            ChannelInfo.matrixRoomInfo.membersInfo[timelineItem.getSender()],
          userImage: "", //timelineItem.getContent().avatar_url ?? "",
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
            timelineItem.getContent().msgtype === "m.audio" ? music : undefined,
          eventId: timelineItem.getId(),
          sender: timelineItem.getSender(),
          roomId: ChannelInfo.matrixRoomId,
        };
        if (msgs[reactionItemIndex] !== undefined) {
          msgs[reactionItemIndex].thread.push(msgBody);
        }
      } else {
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
          userName:
            ChannelInfo.matrixRoomInfo.membersInfo[timelineItem.getSender()],
          userImage: "", //timelineItem.getContent().avatar_url ?? "",
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
            timelineItem.getContent().msgtype === "m.audio" ? music : undefined,
          eventId: timelineItem.getId(),
          sender: timelineItem.getSender(),
          thread: [],
          roomId: ChannelInfo.matrixRoomId,
        };

        msgs.push(msgBody);
      }
    } else if (timelineItem.getType() === "m.room.create") {
      setIsLoading(false);
    } else if (timelineItem.getType() === "m.reaction") {
      //console.log("itemssssssssssPP ", timelineItem);
      const reactionItem = timelineItem.getContent();
      if (reactionItem["m.relates_to"] !== undefined) {
        //console.log("Channel message 4 ", reactionItem);
        const reactionItemIndex = msgs.findIndex(
          (x) => x.eventId === reactionItem["m.relates_to"].event_id
        );
        //console.log(" itemssssssssssPP ==>",  reactionItem["m.relates_to"].event_id)
        if (reactionItemIndex === -1) {
          msgs.forEach((element) => {
            //console.log("itemssssssssssTT ==> ", element.thread);
            const reactionInnerItemIndex = element.thread.findIndex(
              (x) => x.eventId === reactionItem["m.relates_to"].event_id
            );
            if (reactionInnerItemIndex !== -1) {
              const item = element.thread[reactionInnerItemIndex];
              const emojiItem = {
                item: reactionItem["m.relates_to"].key,
                eventId: timelineItem.getId(),
                userId: timelineItem.getSender(),
              };
              item.emojiArray.push(emojiItem);
            }
          });
        } else {
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
    } else if (timelineItem.getType() === "m.room.redaction") {
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
          const threadIndex = element.thread.findIndex(
            (x) => x.eventId === timelineItem.getAssociatedId()
          );
          if (threadIndex !== -1) {
            element.thread.splice(threadIndex, 1);
          }
        });
      }
    }
  };

  useEffect(() => {
    if (currentEvent !== undefined) {
      console.log("currentEvent Info ==> ", currentEvent.event);
      let msgs = messageList;
      insertItem(currentEvent.event, msgs, true);
      const unigueList = getUnique(msgs, "eventId");
      setMessagesList(unigueList);

      const checkNewItem = msgs.filter(
        (item) => item.eventId === currentEvent.event.getId()
      );
      if (checkNewItem.length > 0) {
        splitData(unigueList, true);
      } else {
        splitData(unigueList, false);
      }

      if (currentEvent.event.getContent()["m.relates_to"] != undefined) {
        const aa = msgs.filter(
          (item) =>
            item.eventId ===
            currentEvent.event.getContent()["m.relates_to"].event_id
        );
        if (aa.length > 0) {
          setCurrentItem(aa[aa.length - 1]);
        }
      }
    }
  }, [currentEvent]);

  useEffect(() => {
    if (selectEmojiItem !== undefined) {
      const emoji = selectEmojiItem.data.filter(
        (item) =>
          item.userId ===
          matrixQualifiedUserId(getUserData.data.userByToken.matrixUsername)
      );
      if (emoji.length > 0) {
        removeStickerMessage(ChannelInfo.matrixRoomId, emoji[0].eventId);
        setEvent(undefined);
      } else {
        sendStickerMessage(
          ChannelInfo.matrixRoomId,
          event.eventId,
          selectEmojiItem.title
        );
        setEvent(undefined);
      }
    }
  }, [selectEmojiItem]);

  useEffect(() => {
    if (deleteMessage === true) {
      if (event !== undefined) {
        removeStickerMessage(ChannelInfo.matrixRoomId, event.eventId);
      }
      setEvent(undefined);
      setDeleteMessage(false);
    }
  }, [deleteMessage]);

  const splitData = (input, isScroll) => {
    const sortList = input.sort((a, b) => a.date - b.date);

    const result = sortList.reduce((accum, current) => {
      let dateGroup = accum.find(
        (x) =>
          x.title.toLocaleDateString() === current.date.toLocaleDateString()
      );
      if (!dateGroup) {
        dateGroup = { title: current.date, data: [] };
        accum.push(dateGroup);
      }
      dateGroup.data.push(current);
      return accum;
    }, []);

    var messages: any = [];
    const reverseList = result.reverse();
    for (let index = 0; index < reverseList.length; index++) {
      const element = reverseList[index];
      //console.log("Channel ==3  >", element);
      const aa = {
        title: element.title,
        data: element.data.reverse(),
      };
      messages.push(aa);
    }
    //console.log("Channel ==4  >", messages);
    setMessageSectionList(messages);
    setTextMessage("");
    setSendShowButton(false);
    setLoaderVisible(false);
    if (isScroll === true) {
      console.log("calling herere 1");

      setTimeout(() => {
        setUpdateSelectedItem(!updateSelectedItem);
        if (refFlatList) {
          refFlatList.current?.scrollToLocation({
            animated: true,
            sectionIndex: 0,
            itemIndex: 0,
          });
        }
      }, 200);
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
      ChannelInfo.matrixRoomId,
      currentWorkspaceData.organizationId,
      currentWorkspaceData._id
    );
  }, []);

  // useEffect(() => {
  //   setUploadData([]);
  // }, []);

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
          { roomId: ChannelInfo.matrixRoomId },
          {
            file: {
              type: selectMimeType,
              uri: selectedUrl?.url,
              name: selectedUrl?.file?.name,
              size: selectedUrl?.file?.size,
            },
            url: selectedUrl?.url,
            roomId: ChannelInfo.matrixRoomId,
          }
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
        const data = await sendMessage(
          ChannelInfo.matrixRoomId,
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
    console.log("selectedEmoji event", event);
    if (selectedEmoji !== null && selectedEmoji !== undefined) {
      if (event === undefined) {
        console.log("selectedEmoji", selectedEmoji);
        async function messagesend() {
          const data = await sendMessage(
            ChannelInfo.matrixRoomId,
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
          sendStickerMessage(
            ChannelInfo.matrixRoomId,
            event.eventId,
            selectedEmoji
          );
        }
        setEvent(undefined);
      }
    }
  }, [selectedEmoji]);
  useEffect(() => {
    if (docResult !== null && docResult !== undefined) {
      console.log("doc", documentState);
      async function messagesend(item: any) {
        const data = await sendFiles(
          { roomId: ChannelInfo.matrixRoomId },
          {
            file: {
              type: item.file.type,
              uri: item?.url,
              name: item?.file.name,
              size: item?.file.size,
            },
            url: item?.url,
            roomId: ChannelInfo.matrixRoomId,
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
      // console.log("finalText before ===> ", text);
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
      // console.log("finalText ===> ", finalText);
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
  hightlightedStringArray.push("@channel");
  if (hightlightedStringArray.indexOf(ChannelInfo.name) === -1) {
    hightlightedStringArray.push("@" + ChannelInfo.name);
  }
  if (hightlightedStringArray.indexOf(ChannelInfo.name.toLowerCase()) === -1) {
    hightlightedStringArray.push("@" + ChannelInfo.name.toLowerCase());
  }

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
  if (hightlighted.indexOf(ChannelInfo.name) === -1) {
    hightlighted.push(
      "@" +
        ChannelInfo.name +
        " <:> " +
        `<script>
        function clickYourButton(data) {
          window.ReactNativeWebView.postMessage(data)
        }     
      </script>
      <button onclick="clickYourButton('@` +
        ChannelInfo.name +
        `')" style="color:#3C5DB9;background-color:#3C5DB940;display:inline-block;margin:0px;border:none;">` +
        "@" +
        ChannelInfo.name +
        `</button>`
    );
    hightlighted.push(
      "@" +
        ChannelInfo.name.toLowerCase() +
        " <:> " +
        `<script>
        function clickYourButton(data) {
          window.ReactNativeWebView.postMessage(data)
        }     
      </script>
      <button onclick="clickYourButton('@` +
        ChannelInfo.name.toLowerCase() +
        `')" style="color:#3C5DB9;background-color:#3C5DB940;display:inline-block;margin:0px;border:none;">` +
        "@" +
        ChannelInfo.name.toLowerCase() +
        `</button>`
    );
  }

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

  const msgSlot = (date) => {
    const timeago = moment(date).diff(new Date(), "days");
    if (timeago === 0) {
      return "Today";
    } else if (timeago === -1) {
      return "Yesturday";
    } else {
      const currentYear = moment(new Date()).year();
      const msgYear = moment(date).year();
      if (currentYear === msgYear) {
        const formatttedDate = moment(date).format("MMM DD");
        return formatttedDate;
      } else {
        const formatDate = moment(date).format("ll");
        return formatDate;
      }
    }
  };

  const [changedData, setChangedData] = useState("");
  const handleDataChange = (newData: React.SetStateAction<string>) => {
    console.log("DIRECT MESSAGE WALA CONSOLE", newData);
    setChangedData(newData);
  };

  const renderSectionItem = ({ item }) => {
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
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                paddingHorizontal: 7,
                paddingVertical: 7,
              }}
            >
              <BackIcon />
            </TouchableOpacity>

            <Pressable
              onPress={() =>
                navigation.navigate(RootRoutes.User_Profile, {
                  userName: getUserNameForDirectMessage(ChannelInfo),
                  userImage: " ",
                })
              }
              style={styles.imageMainView}
            >
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
                {ChannelInfo.name !== undefined && (
                  <Text
                    style={{
                      color: "#FFFFFF",
                      ////fontFamily: "PlusJakartaSans-Bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {getUserNameForDirectMessage(ChannelInfo).substring(0, 1)}
                  </Text>
                )}
              </View>

              <View style={styles.status}></View>
            </Pressable>
            <Text style={styles.headerTitle}>
              {getUserNameForDirectMessage(ChannelInfo)}
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#DEDEDE",
            }}
          ></View>
        </View>

        {/*Message List view*/}
        <View
          style={{
            position: "absolute",
            bottom: 60 + (Platform.OS === "ios" ? keyboardHeight * 0.88 : 0),
            top: 60,
          }}
        >
          {messageSectionList.length > 0 && (
            <SectionList
              ref={refFlatList}
              sections={messageSectionList}
              extraData={currentItem}
              style={{
                width: "100%",
                height: "100%",
                marginBottom: isKeyboardVisible
                  ? 80
                  : uploadData.length > 0
                  ? 70
                  : 10,
              }}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item, index }) => (
                <ListComponent
                  items={item}
                  index={index}
                  navigation={navigation}
                  messageList={messageList}
                  setCurrentItem={setCurrentItem}
                  setPreviewUrl={setPreviewUrl}
                  setSelectPreviewType={setSelectPreviewType}
                  setShowPreviewItem={setShowPreviewItem}
                  setSound={setSound}
                  audioPlaying={audioPlaying}
                  setAudioPlaying={setAudioPlaying}
                  setShowModal={setShowOptionModal}
                  setEvent={setEvent}
                  setSelectEmojiItem={setSelectEmojiItem}
                  setShowEmoji={setShowEmoji}
                />
              )}
              renderSectionFooter={({ section: { title } }) =>
                renderSectionItem({ item: title })
              }
              inverted={true}
              onEndReached={() => {
                if (isLoading === true) {
                  console.log("Channel message 6 ");
                  loadMore();
                }
              }}
              windowSize={1000}
              maxToRenderPerBatch={50}
            />
          )}
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
          mention={mention}
          setMention={setMention}
          setAudioFile={setAudioFile}
          uploadData={uploadData}
          setUploadData={setUploadData}
          setSelectedUrl={setSelectedUrl}
          setDocResult={setDocResult}
          ChannelInfo={ChannelInfo}
          // setTaggingModal={setTaggingModal}
          changedData={changedData}
          setChangedData={setChangedData}
          fromThread={false}
          memberData={RoomInfo}
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
          ChannelInfo={ChannelInfo}
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
          ChannelInfo={ChannelInfo}
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
          isFromThread={false}
          setShowEmoji={setShowEmoji}
          setDeleteMessage={setDeleteMessage}
          workspace_id={currentWorkspaceData._id}
          channnel_id={ChannelInfo._id}
          timeline={loadMoreMessagesList?.room?.timeline?.filter(
            (item: any) => item.getId() === event?.eventId
          )}
          dispatch={dispatch}
          channelData={
            channelData?.data?.data?.channels?.filter(
              (item: any) => item._id === ChannelInfo._id
            )[0]?.save_messages ?? []
          }
        />

        {/* <TaggingModal
          showModal={taggingModal}
          setShowModal={setTaggingModal}
          memberData={RoomInfo}
          textMessage={textMessage}
          setTextMessage={setTextMessage}
          onDataChanged={handleDataChange}
          mention={mention}
        /> */}

        {loaderVisible === true ? (
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#3866E6",
                paddingHorizontal: 10,
                paddingVertical: 5,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  //fontFamily: "PlusJakartaSans-Regular",
                }}
              >
                Loading....
              </Text>
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginTop: Platform.OS === "android" ? 0 : 10,
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
    textTransform: "capitalize",
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
    marginTop: 10,
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
    width: "75%",
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
    flexGrow: 1,
    justifyContent: "flex-end",
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
});
