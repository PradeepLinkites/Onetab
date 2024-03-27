import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import env from "../../config";
import sdk, {
  ClientEvent,
  EventTimeline,
  EventTimelineSet,
  EventType,
  Filter,
  HttpApiEvent,
  MatrixError,
  MatrixEvent,
  MsgType,
  RelationType,
  Room,
  createClient,
} from "matrix-js-sdk";
import { get } from "lodash";
import { chatService } from "../libs/chatService";
import { userService } from "../libs/userService";
import moment from "moment";
import { Thread, ThreadEvent } from "matrix-js-sdk/lib/models/thread";
import { SyncApi } from "matrix-js-sdk/lib/sync";
import { updateOrganigation } from "./workspaceStore";
import { getDeviceTokenToStorage } from "../utils/setUpContext";
// import axios from "axios";
export const CHAT_FEATURE_KEY = "chatStore";
export const chatStoreAdapter = createEntityAdapter();
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {get} from "lodash";
/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchStore())
 * }, [dispatch]);
 * ```
 */

const baseUrl: string = "https://matrix.onetab.ai";

const client = createClient({
  baseUrl: baseUrl,
});

export function allStorage() {
  var values = {},
    keys = Object.keys(AsyncStorage),
    i = keys.length;
  while (i--) {
    values[keys[i]] = AsyncStorage.getItem(keys[i]);
  }
  return values;
}

export async function saveStorage(storage: any) {
  const { userClient, userQuery } = userService;
  const data = await userClient.mutate({
    mutation: userQuery.saveStorage,
    variables: { extraFieldsInput: JSON.stringify(storage) },
  });
}

async function getSyncStatus(thunkAPI: any) {
  client.once(
    ClientEvent.Sync,
    function (state: any, prevState: any, res: any) {
      getRoomsEvent(thunkAPI);
      thunkAPI.dispatch(chatStoreActions.setStatus(state));
      thunkAPI.dispatch(getChannels());
    }
  );
}

export async function reconnectChat(rooms: any) {
  const sync = new SyncApi(client);
  const retry = sync.retryImmediately();
  // const https = client.resendEvent();
}

async function openRoomThread(
  roomData: string,
  eventId: string,
  senderId: string,
  thunkAPI: any
) {
  const event = await client.fetchRoomEvent(roomData, eventId);
  const sender = client.getUser(senderId);
  if (get(event, "event_id")) {
    const matrixEvent = new MatrixEvent(event);
    matrixEvent.sender = sender;
    thunkAPI.dispatch(chatStoreActions.setToogleThreadModal(matrixEvent));
  }
}
var token = "";
// async function getRoomsEvent(thunkAPI: any) {
//   client.on(ClientEvent.Event, function (event: any) {
//     console.log("event===========>", event, event.getType());
//     const room = get(thunkAPI.getState(), "chatStore.room", "");
//     const rooms = get(thunkAPI.getState(), "chatStore.rooms", "");
//     const threadModal = get(thunkAPI.getState(), "chatStore.threadModal", "");
//     thunkAPI.dispatch(chatStoreActions.setForceUpdate(null));
//     if (get(event, "event.unsigned.age", 0) < 1000) {
//       if (event.getType() === "m.receipt") {
//         try {
//           var notificationCounts = 0;
//           rooms.forEach((roomDataEvent: any) => {
//             notificationCounts =
//               notificationCounts +
//               get(roomDataEvent, "matrixRoomEvent.notificationCounts.total", 0);
//           });
//           console.log("notificationCounts========>", notificationCounts);
//           window.parent.postMessage(
//             JSON.stringify({ notification: notificationCounts }),
//             "*"
//           );
//         } catch (e: any) {
//           console.log("e======>", e);
//         }
//       }
//       if (
//         event.getType() === "m.room.create" ||
//         event.getType() == "m.room.member"
//       ) {
//         // console.log("event========>", event);

//         thunkAPI.dispatch(getChannels());
//         // thunkAPI.dispatch(getRooms());
//       }

//       if (event.getType() === "m.room.message") {
//         if (
//           get(event, "event.sender", false) &&
//           get(room, "myUserId", "") === get(event, "event.sender", false)
//         ) {
//           if (get(event, "event.room_id", "")) {
//             rooms.forEach((roomData: any) => {
//               if (
//                 get(roomData, "is_direct", false) &&
//                 get(roomData, "matrixRoomId", false) ===
//                   get(event, "event.room_id", "")
//               ) {
//                 const matrixRoomInfo = {
//                   ...get(roomData, "matrixRoomInfo", {}),
//                 };
//                 matrixRoomInfo.leave_members = [];
//                 thunkAPI.dispatch(
//                   updateChannel({
//                     _id: roomData._id,
//                     matrixRoomId: get(roomData, "matrixRoomId", ""),
//                     matrixRoomInfo,
//                   })
//                 );
//               }
//             });
//           }
//         }

//         if (
//           get(event, "event.sender", false) &&
//           get(room, "myUserId", "") !== get(event, "event.sender", false)
//         ) {
//           // console.log("event==========>", event);
//           if (get(event, "event.room_id", "")) {
//             rooms.forEach((roomData: any) => {
//               if (
//                 get(roomData, "is_direct", false) &&
//                 get(roomData, "matrixRoomInfo.leave_members", []).length &&
//                 get(roomData, "matrixRoomId", "false") ===
//                   get(event, "event.room_id", "")
//               ) {
//                 setTimeout(() => {
//                   thunkAPI.dispatch(getChannels());
//                 }, 1000);
//               }
//             });
//           }
//           if (get(event, "event.unsigned.age", 0) < 500) {
//             try {
//               var html = get(event, "event.content.body", "");
//               var div = document.createElement("div");
//               div.innerHTML = html;
//               const wrkspc = event.event.content.info.workspace_id;
//               const orgId = event.event.content.info.organization_id;
//               if ("Notification" in window) {
//                 var notification = new Notification(
//                   `New message from ${get(event, "sender.rawDisplayName", "")}`,
//                   {
//                     data: {
//                       room_id: get(event, "event.room_id", ""),
//                       eventId: get(event, "event.event_id", ""),
//                       senderId: get(event, "event.sender", ""),
//                       threadId: get(
//                         event,
//                         `event.content["m.relates_to"].event_id`,
//                         ""
//                       ),
//                     },
//                     body: get(event, "event.content.body", "")
//                       ? div.textContent || div.innerText || ""
//                       : get(event, "event.content.msgtype", "") === "m.image"
//                       ? "share image"
//                       : get(event, "event.content.msgtype", "") === "m.video"
//                       ? "share video"
//                       : get(event, "event.content.msgtype", "") === "m.file"
//                       ? "share file"
//                       : "send message",
//                     icon: "https://auth.matrix.onetab.ai/favicon.ico",
//                   }
//                 );
//                 try {
//                   var notificationCount = 0;
//                   rooms.forEach((roomDataEvent: any) => {
//                     notificationCount =
//                       notificationCount +
//                       get(
//                         roomDataEvent,
//                         "matrixRoomEvent.notificationCounts.total",
//                         0
//                       );
//                   });
//                   window.parent.postMessage(
//                     JSON.stringify({ notification: notificationCount }),
//                     "*"
//                   );
//                 } catch (ne) {
//                   console.log("ne", ne);
//                 }
//                 notification.onclick = (e: any) => {
//                   e.preventDefault();
//                   window.parent.postMessage(
//                     JSON.stringify({ notificationClick: true }),
//                     "*"
//                   );
//                   notification.close();
//                   window.focus();
//                   thunkAPI.dispatch(
//                     updateOrganigation({
//                       activeOrganizationId: orgId,
//                       workspaceId: wrkspc,
//                     })
//                   );
//                   if (get(e, "currentTarget.data.room_id", "")) {
//                     rooms.forEach((roomData) => {
//                       if (
//                         get(roomData, "matrixRoomId", "false") ===
//                         get(e, "currentTarget.data.room_id", "")
//                       ) {
//                         setTimeout(() => {
//                           thunkAPI.dispatch(
//                             chatStoreActions.setOnSelectChat({ room: roomData })
//                           );

//                           if (get(e, "currentTarget.data.threadId", "")) {
//                             openRoomThread(
//                               roomData.matrixRoomId,
//                               get(e, "currentTarget.data.threadId", ""),
//                               get(e, "currentTarget.data.senderId", ""),
//                               thunkAPI
//                             );
//                             // client.getEventTimeline()
//                           }
//                           thunkAPI.dispatch(
//                             getRoomTopic({ roomId: roomData.matrixRoomId })
//                           );
//                         }, 500);
//                       }
//                     });
//                   }
//                 };
//               }
//             } catch (e: any) {
//               console.log("notification======>", e);
//             }
//           }
//         }
//       }
//       if (event.getType() == "m.room.member") {
//         if (
//           Object.keys(room).length &&
//           room.roomID === get(event.event.room_id, "")
//         ) {
//           console.log("data room", room, event.event.room_id);
//           thunkAPI.dispatch(syncChannel({ ...room }));
//         }
//       }
//     }
//   });
// }

async function getRoomsEvent(thunkAPI: any) {
  client.on(ClientEvent.Event, async function (event: any) {
    //console.log("age ",get(event, "event.unsigned.age", 0))
    const room = get(thunkAPI.getState(), "chatStore.room", "");
    const rooms = get(thunkAPI.getState(), "chatStore.rooms", "");
    const threadModal = get(thunkAPI.getState(), "chatStore.threadModal", "");
    thunkAPI.dispatch(chatStoreActions.setForceUpdate(null));
    // console.log(
    //   "My Event ==> ",
    //   event,
    //   "\nevent.type",
    //   event.getType(),
    //   "\nObject.keys(room).length",
    //   Object.keys(room).length,
    //   "\nroom.roomID === get(event.event.room_id)",
    //   room.roomID === get(event.event.room_id, "")
    // );
    //if (get(event, "event.unsigned.age", 0) < 1000) {
    if (event.getType() === "m.receipt") {
      try {
        var notificationCounts = 0;
        rooms.forEach((roomDataEvent: any) => {
          notificationCounts =
            notificationCounts +
            get(roomDataEvent, "matrixRoomEvent.notificationCounts.total", 0);
        });
        //console.log("notificationCounts========>", notificationCounts);
        // window.parent.postMessage(
        // JSON.stringify({ notification: notificationCounts }),
        // "*"
        // );
      } catch (e: any) {
        console.log("e======>", e);
      }
    }
    if (
      event.getType() === "m.room.create" ||
      event.getType() == "m.room.member"
    ) {
      thunkAPI.dispatch(getChannels());
    }

    if (event.getType() === "m.room.message") {
      const currentRoomId = get(
        thunkAPI.getState(),
        "chatStore.room.roomId",
        ""
      );
      //console.log("My Room Id ", currentRoomId)
      if (currentRoomId === get(event, "event.room_id", "")) {
        thunkAPI.dispatch(
          currentRoomEvent({
            event: event,
          })
        );
      }
    }
    if (event.getType() === "m.reaction") {
      const currentRoomId = get(
        thunkAPI.getState(),
        "chatStore.room.roomId",
        ""
      );
      if (currentRoomId === get(event, "event.room_id", "")) {
        thunkAPI.dispatch(
          currentRoomEvent({
            event: event,
          })
        );
      }
    }
    if (event.getType() === "m.room.redaction") {
      const currentRoomId = get(
        thunkAPI.getState(),
        "chatStore.room.roomId",
        ""
      );
      if (currentRoomId === get(event, "event.room_id", "")) {
        thunkAPI.dispatch(
          currentRoomEvent({
            event: event,
          })
        );
      }
    }
    if (event.getType() == "m.room.member") {
      console.log(
        "data: ",
        Object.keys(room),
        "room",
        room,
        "roomID",
        room.roomID,
        "get",
        get(event.event.room_id, "")
      );
      if (
        Object.keys(room).length &&
        room.roomID === get(event.event.room_id, "")
      ) {
        console.log("data room", event.event.room_id);
        thunkAPI.dispatch(syncChannel({ ...room }));
      }
    }

    if (event.getType() == "m.typing") {
      thunkAPI.dispatch(
        currentRoomTypingEvent({
          event: event,
        })
      );
    }

    // if (event.getType() == "m.presence") {
    //   thunkAPI.dispatch(
    //     currentRoomTypingEvent({
    //       event: event,
    //     })
    //   );
    // }
    //}
  });
}

export const currentRoomTypingEvent = createAsyncThunk(
  "chat/room/typingevent",

  async (_data: any, thunkAPI: any) => {
    try {
      //console.log("currentRoomEvent", _data);

      return _data;
    } catch (error) {
      console.log("currentRoomEvent", error);

      return undefined;
    }
  }
);

export const currentRoomEvent = createAsyncThunk(
  "chat/room/currentevent",

  async (_data: any, thunkAPI: any) => {
    try {
      console.log("currentRoomEvent", _data);

      return _data;
    } catch (error) {
      console.log("currentRoomEvent", error);

      return undefined;
    }
  }
);
export const loadMoreMessages = createAsyncThunk(
  "chat/message/loadMore",
  async (_data: any, thunkAPI: any) => {
    try {
      // console.log("loadMoreMessage hari999");
      const room: any = get(thunkAPI.getState(), "chatStore.room", {});
      const timeline = await client.scrollback(room, 40);
      // const data = timeline.timeline;
      // console.log("loadMoreMessage timeline", data);
      // console.log("loadMoreMessages", { room: timeline, _data });
      console.log("loadMoreMessages done");
      return { room: timeline, _data };
    } catch (error) {
      console.log("loadMoreMessages", error);
      return undefined;
    }
  }
);

// export const getChatAccessToken = createAsyncThunk(
//   "chat/getToken",
//   async (_data: any, thunkAPI:any) => {
//     try {
//       let url = baseUrl + "/_matrix/client/r0/login";
//       let { data } = await axios.post(url, {
//         type: "m.login.password",
//         user: _data.matrixUsername,
//         password: _data.matrixPassword,
//       });
//       client.stopClient();
//       updateClient(data.access_token, data.user_id, data.device_id);

//       return data;
//     } catch (error) {
//       console.log("getChatAccessToken error 2", error);
//       return undefined;
//     }
//   }
// );
// const updateClient = async (access_token, user_id, device_id) => {
//   console.log("info ==> ", access_token, user_id, device_id);
//   const client = sdk.createClient({
//     baseUrl: baseUrl,
//     accessToken: access_token,
//     userId: user_id,
//     deviceId: device_id,
//   });
//   await client.startClient();
//   client.on(ClientEvent.Sync, function (state, prevState, data) {
//     console.log("roomList", state, prevState, data);
//     switch (state) {
//       case "PREPARED":
//         let roomList = client.getRooms();
//         console.log("roomList", roomList);
//         break;
//       // case "ERROR":
//       //   reconnectChats();
//       //   break;
//     }
//   });
//   console.log("Client state ==> ", await client.getPushRules());
//   console.log("my acess token => ", client.getRooms());
// };
export const getChatAccessToken = createAsyncThunk(
  "chat/getToken",
  async (_data: any, thunkAPI: any) => {
    try {
      //console.log("dta", _data.matrixUsername, _data.matrixPassword, client);
      const matrixStatus = get(
        thunkAPI.getState(),
        "chatStore.matrixStatus",
        ""
      );
      client.stopClient();
      const data = await client.login("m.login.password", {
        user: _data.matrixUsername,
        password: _data.matrixPassword,
      });
      console.log("getChatAccessToken", data);
      console.log("matrixStatus 11", matrixStatus);
      await client.startClient();
      if (matrixStatus === "not loaded" || matrixStatus === "") {
        console.log("matrixStatus 2", matrixStatus);
        getSyncStatus(thunkAPI);
      }
      return data;
    } catch (error) {
      console.log("getChatAccessToken", error);
      return undefined;
    }
  }
);

export const fetchAllMessages = createAsyncThunk(
  "get/getDirectMessage/app",
  async (rooms: any, thunkAPI: any) => {
    var messageArray: any = [];
    for (let index = 0; index < rooms.length; index++) {
      const room: Room | null = client.getRoom(rooms[index]);
      if (room !== null) {
        const messages = await client.scrollback(room, 1); // Adjust the limit as per your needs
        const newArray = messages.timeline.filter(
          (item) => item.getType() == "m.room.message"
        );
        const _id = rooms[index];
        const content = newArray[newArray?.length - 1]?.getContent();
        const ts = newArray[newArray?.length - 1]?.getTs();
        const name = newArray[newArray.length - 1]?.sender?.name;
        if (newArray.length > 0) {
          const existingObject = messageArray.find(
            (obj: any) => obj._id === _id
          );
          if (!existingObject || existingObject.ts > ts) {
            const value = {
              _id: _id,
              content: content,
              ts: ts,
              name: name,
              userImage: content.avatar_url ?? "",
            };
            if (existingObject) {
              const index = messageArray.indexOf(existingObject);
              messageArray.splice(index, 1);
            }
            messageArray.push(value);
          }
        }
      }
    }
    thunkAPI.dispatch(chatStoreActions.setDirectMessages(messageArray));
    return messageArray;
  }
);
export const uploadFiles = createAsyncThunk(
  "chat/upload/pic",
  async (_data: any, thunkAPI: any) => {
    const token = await getDeviceTokenToStorage();
    var formData = new FormData();
    try {
      formData.append("file", _data.file);
      console.log("uploadFile data", formData);
      const data = await fetch(`https://services.wynn.io/file-upload`, {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
        },
        body: formData,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          return data;
        });
      console.log("uploadFiles", data);
      return {
        data,
        roomId: _data.roomId,
        id: _data.id,
        threadId: get(_data, "threadId", ""),
      };
    } catch (error) {
      console.log("uploadFiles", error);
      return undefined;
    }
  }
);

export const getRooms = createAsyncThunk(
  "chat/get/rooms",
  async (_, thunkAPI: any) => {
    try {
      var rooms = client.getRooms();
      // console.log("getRooms", rooms);
      return { rooms };
    } catch (error) {
      console.log("getRooms", error);
      return undefined;
    }
  }
);

export const removeMember = createAsyncThunk(
  "chat/rooms/kick/Member",
  async (_data: any, thunkAPI: any) => {
    try {
      const roomId = get(thunkAPI.getState(), "chatStore.room.roomId", "");
      var kick = await client.kick(roomId, _data);
      console.log("removeMember", kick);
      return kick;
    } catch (error) {
      console.log("removeMember", error);
      // message.error("Too Many Requests please try again later");
    }
  }
);

export const clearNotification = async (room: any) => {
  if (get(room, "timeline", []).length) {
    try {
      const rm = await client.sendReadReceipt(
        room.timeline[room.timeline.length - 1]
      );
    } catch (error) {
      console.log("clearNotification", error);
      return undefined;
    }
  }
};
export const newLogin = async () => {
  const matrixUsername = "yogesh_3tcrgxtl";
  const matrixPassword = "mum1ura6j";
  const data = await client.login("m.login.password", {
    user: matrixUsername,
    password: matrixPassword,
  });
  await client.startClient();
};

export const getRoom = createAsyncThunk(
  "chat/get/room",
  async ({ roomId }: any, thunkAPI: any) => {
    const currentRoomId = get(thunkAPI.getState(), "chatStore.room.roomId", "");
    // if(roomId !== currentRoomId){
    // const baseUrl: string = "https://matrix.onetab.ai";

    console.log("getRoom::", roomId);
    try {
      const room = client.getRoom(roomId);
      // client.getStateEvent(roomId, "")
      if (room === null) {
        setTimeout(async () => {
          try {
            const memberStatus = await client.getJoinedRoomMembers(roomId);
            thunkAPI.dispatch(getRoom({ roomId }));
          } catch (e: any) {
            // message.error("User is not a member of selected Channel");
          }
        }, 2000);
      } else {
        room.setTimelineNeedsRefresh(true);
        // const timeline = client.getLatestTimeline(room.timelineSets[0]);
      }
      clearNotification(room);
      // console.log("data==>>", room);
      return { room };
    } catch (error) {
      console.log("getRoom ", error);
      setTimeout(() => {
        thunkAPI.dispatch(getRoom({ roomId }));
      }, 3000);
      return { room: {} };
    }
    // }
  }
);

export const getRoomTopic = createAsyncThunk(
  "chat/get/topic",
  async ({ roomId }: any, thunkAPI: any) => {
    try {
      const topic = await client.getStateEvent(roomId, "m.room.topic", "");
      // const topic1 = await client.setRoomTopic(roomId, "test setr0omm");
      console.log("getRoomTopic", topic);
      return { topic };
    } catch (error) {
      console.log("getRoomTopic", error);
      return undefined;
    }
  }
);

export const setRoomTopic = createAsyncThunk(
  "chat/set/topic",
  async ({ roomId, topicName }: any, thunkAPI: any) => {
    try {
      const topic = await client.setRoomTopic(roomId, topicName);
      thunkAPI.dispatch(getRoomTopic({ roomId }));
      console.log("setRoomTopic", topic);
    } catch (error) {
      console.log("setRoomTopic", error);
    }
  }
);

export const editRoomMessage = createAsyncThunk(
  "chat/set/topic",
  async ({ room, event, message }: any, thunkAPI: any) => {
    try {
      const messageEvent = event;
      const newEvent = await client.sendEvent(
        get(event, "event.room_id", ""),
        EventType.RoomMessage,
        {
          body: message,
          msgtype: "m.text",
          "m.new_content": {
            body: message,
            msgtype: "m.text",
          },
          "m.relates_to": {
            rel_type: "m.replace",
            event_id: get(event, "event.event_id", ""),
          },
        }
      );
      await messageEvent.makeReplaced(newEvent);
      console.log("editRoomMessage", messageEvent);
    } catch (error) {
      console.log("editRoomMessage", error);
    }
    // client
    //   .getRoom(room.roomId)
    //   .findEventById(get(event, "event.event_id", ""))
    //   .makeReplaced();
  }
);

// export const sendStickerMessage = (room: any, e: any, data: any) => {
//   try {
//     // var threadId = get(data, "threadId", "") || get(data, "thread.id", "");
//     // if (!threadId) {
//     //   const thread = new Thread(get(data, "event.event_id", ""), data, {
//     //     initialEvents: [data],
//     //     room,
//     //     client,
//     //   });
//     //   threadId = thread.id;
//     //   thread.addEvents([data], false);
//     // }
//     // console.log("threadId======>", threadId);
//     // client.sendEmoteMessage(get(data, "event.room_id", ""), threadId, e);
//     client.sendEvent(get(data, "event.room_id", ""), EventType.Reaction, {
//       body: e,
//       // msgtype: EventType.Reaction,
//       "m.relates_to": {
//         rel_type: RelationType.Annotation,
//         event_id: get(data, "event.event_id", ""),
//         key: e,
//       },
//     });
//   } catch (error) {
//     console.log("sendStickerMessage ", error);
//   }
// };

export const sendStickerMessage = (roomId: any, eventId: any, e: any) => {
  try {
    client.sendEvent(roomId, EventType.Reaction, {
      body: e,
      // msgtype: EventType.Reaction,
      "m.relates_to": {
        rel_type: RelationType.Annotation,
        event_id: eventId,
        key: e,
      },
    });
  } catch (error) {
    console.log("sendStickerMessage ", error);
  }
};

export const sendAPIs = async (room: any, data: any, threadId = "") => {
  // if (threadId) {
  //   fileEvent = await client.sendEvent(
  //     get(room, "roomId", ""),
  //     null,
  //     EventType.RoomMessage,
  //     {
  //       msgtype: type,
  //       "m.relates_to": {
  //         rel_type: RelationType.Thread,
  //         event_id: threadId,
  //         url: get(data, "url", ""),
  //       },
  //       info: {
  //         size: get(data, "file.size", ""),
  //         mimetype: get(data, "file.type", ""),
  //         name: get(data, "file.name", ""),
  //       },
  //       url: get(data, "url", ""),
  //       body: "",
  //     }
  //   );
  // } else {
  try {
    data.saved_response =
      get(data, "saved_response", "") !== null
        ? get(data, "saved_response", "").split(" ", 50)
        : null;
    const apiEvent = await client.sendEvent(
      get(room, "roomId", ""),
      null,
      EventType.RoomMessage,
      {
        msgtype: "m.api",
        info: { ...data },
        url: get(data, "url", ""),
        body: "",
      }
    );
    console.log("sendAPIs ", apiEvent);
    return apiEvent;
  } catch (error) {
    console.log("sendAPIs ", error);
  }
  // }
};

export const sendFiles = async (room: any, data: any, threadId = "") => {
  try {
    var type = MsgType.File;
    if (get(data, "file.type", "").includes("audio")) {
      type = MsgType.Audio;
    } else if (get(data, "file.type", "").includes("video")) {
      type = MsgType.Video;
    } else if (get(data, "file.type", "").includes("image")) {
      type = MsgType.Image;
    } else if (get(data, "file.type", "").includes("text")) {
      type = MsgType.File;
    }
    let fileEvent = {};
    if (threadId) {
      fileEvent = await client.sendEvent(
        get(room, "roomId", ""),
        EventType.RoomMessage,
        {
          msgtype: type,
          "m.relates_to": {
            rel_type: RelationType.Thread,
            event_id: threadId,
            // url: get(data, "url", ""),
          },
          info: {
            size: get(data, "file.size", ""),
            mimetype: get(data, "file.type", ""),
            name: get(data, "file.name", ""),
          },
          url: get(data, "url", ""),
          body: "",
        }
      );
    } else {
      fileEvent = await client.sendEvent(
        get(room, "roomId", ""),
        null,
        EventType.RoomMessage,
        {
          msgtype: type,
          info: {
            size: get(data, "file.size", ""),
            mimetype: get(data, "file.type", ""),
            name: get(data, "file.name", ""),
          },
          url: get(data, "url", ""),
          body: "",
        }
      );
    }
    return {
      event_id: get(fileEvent, "event_id", ""),
      age: moment()
        .subtract(get(data, "event.unsigned.age", 0))
        .format("MM-DD-YYYY HH:mm:ss"),
      room_id: get(room, "roomId", ""),
      origin_server_ts: "origin",
      sender: get(
        room,
        `currentState.members["${get(room, "myUserId", "")}"].rawDisplayName`,
        ""
      ),
      senderId: get(room, "myUserId", ""),
      // sender:  get(room,"myUserId",""),
      type: EventType.RoomMessage,
      content: {
        body: "",
        url: get(data, "url", ""),
        info: {
          size: get(data, "file.size", ""),
          mimetype: get(data, "file.type", ""),
          name: get(data, "file.name", ""),
        },
        msgtype: type,
      },
    };
  } catch (error) {
    console.log("sendFiles", error);
  }
};

// export const removeStickerMessage = async (room: any, e: any, data: any) => {
//   try {
//     const reduct = await client.redactEvent(
//       room.roomId,
//       get(data, "event.event_id", "")
//     );
//     // await client.roomInitialSync(room.roomId);
//     // await client
//     //   .getRoom(room.roomId)
//     //   .timelineSets[0].removeEvent(get(data, "event.event_id", ""));
//     // await client.roomInitialSync(room.roomId);
//   } catch (error) {
//     console.log("removeStickerMessage ", error);
//   }
// };

export const removeStickerMessage = async (roomId: any, eventId: any) => {
  try {
    const reduct = await client.redactEvent(roomId, eventId);
  } catch (error) {
    console.log("removeStickerMessage ", error);
  }
};

export const getThread = (room: any) => {
  // new Thread().on("event", function (event) {
  //   console.log("event=========>", event)
  // })
  try {
    const thread = room.timeline.map((timeline) => {
      if (!get(timeline, "threadId", undefined)) {
        const thread = new Thread(
          get(timeline, "event.event_id", ""),
          timeline,
          {
            room,
            client,
          }
        );
        const event = thread.addEvents([timeline], false);
      }
    });
  } catch (error) {
    console.log("getThread ", error);
  }
};

export const sendTypingEvent = async (roomId: string) => {
  try {
    const data = await client.sendTyping(roomId, true, 1);
  } catch (error) {
    console.log("sendTypingEvent ", error);
  }
};

export const sendMessage = async (
  roomId: string,
  message: any,
  workspaceId: any,
  organizationId: any
) => {
  try {
    //thunkAPI={}
    const data = client.sendEvent(roomId, null, EventType.RoomMessage, {
      body: message,
      "org.matrix.msc1767.text": message,
      msgtype: "m.text",
      info: {
        organization_id: organizationId,
        workspace_id: workspaceId,
        type: "m.text",
      },
    });
    //await client.sendTextMessage(roomId, message);
    console.log("sendMessage ", data);
    return data;
  } catch (error) {
    console.log("sendMessage ", error);
  }
};

export const getUsersDetails = async (userId: string) => {
  const user = client.getUser(userId);
  return user;
};

// export const sendThreadMessage = async (
//   roomId: any,
//   threadId: any,
//   message: any,
//   timeline: any,
//   workspaceId: any,
//   organizationId: any
// ) => {
//   const room = client.getRoom(roomId);
//   try {
//     // const thread = new Thread(get(timeline, "event.event_id", ""), timeline, {
//     //   room,
//     //   client,
//     // });
//     // thread.addEvents([timeline], false);
//     // const data = await client.sendTextMessage(roomId, thread.id, message);
//     client.sendEvent(get(timeline, "event.room_id", ""), "m.room.message", {
//       body: message,
//       "org.matrix.msc1767.text": message,
//       msgtype: "m.text",
//       info: {
//         organization_id: organizationId,
//         workspace_id: workspaceId,
//         type: "m.text",
//       },
//       "m.relates_to": {
//         is_falling_back: true,
//         rel_type: "m.thread",
//         event_id: get(timeline, "event.event_id", ""),
//       },
//     });
//     // return data;
//   } catch (error) {
//     console.log("sendThreadMessage ", error);
//     // return err;
//   }
// };

export const sendThreadMessage = async (
  roomId: any,
  eventId: any,
  message: any,
  workspaceId: any,
  organizationId: any
) => {
  const room = client.getRoom(roomId);
  try {
    client.sendEvent(roomId, "m.room.message", {
      body: message,
      "org.matrix.msc1767.text": message,
      msgtype: "m.text",
      info: {
        organization_id: organizationId,
        workspace_id: workspaceId,
        type: "m.text",
      },
      "m.relates_to": {
        is_falling_back: true,
        rel_type: "m.thread",
        event_id: eventId,
      },
    });
  } catch (error) {
    console.log("sendThreadMessage ", error);
  }
};

// );
export const createGmailRoom = async () => {
  const room = await client.createRoom({
    name: "gmail_private_room",
    invite: ["@" + "configurex" + ":matrix.onetab.ai"],
  });
  console.log("createGmailRoom ", room);
};

export const createRoom = createAsyncThunk(
  "chat/create/rooms",
  async (roomName: any, thunkAPI: any) => {
    try {
      const workspace_id = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      const organizationId = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData.organizationId",
        ""
      );
      var inviteId = "";
      if (roomName.is_direct) {
        // if (roomName.invite.length) {
        //   inviteId = roomName.invite[0];
        //   roomName.invite = [
        //     "@" + roomName.invite[0] + ":onetab.ai",
        //     "@" + "wynnadmin" + ":onetab.ai",
        //   ];
        // }
      } else {
        // roomName.invite = ["@" + "wynnadmin" + ":onetab.ai"];
      }
      // var data = await client.createRoom({
      //   ...roomName,
      //   creation_content: { workspace_id },
      // });
      // if (roomName.is_direct) {
      // } else {
      //   delete roomName.invite;
      // }
      // if (get(data, "room_id", false)) {
      //   const { chatClient, chatQuery } = chatService;
      //   get(roomName, "invite", []).map(async (userId) => {
      //     await chatClient.query({
      //       query: chatQuery.inviteUserOnChat,
      //       variables: { matrixName: inviteId, roomId: get(data, "room_id", "") },
      //     });
      //   });
      //   await thunkAPI.dispatch(
      //     onCreateChannel({
      //       name: get(roomName, "name", ""),
      //       description: "",
      //       is_direct: get(roomName, "is_direct", ""),
      //       bookmarks: [],
      //       matrixRoomId: get(data, "room_id", ""),
      //       matrixRoomInfo: {
      //         members: [
      //           "@" +
      //           get(thunkAPI.getState(), "user.userData.matrixUsername", "") +
      //           ":onetab.ai",
      //         ],
      //       },
      //     })
      //   );
      // }

      // const topic = await client.getStateEvent(data.room_id, "m.room.topic");
      console.log(
        "key i need ",
        {
          roomName: get(roomName, "name", ""),
          user: roomName.is_direct
            ? ["@" + roomName.invite[0] + ":matrix.onetab.ai"]
            : [],
          isDirect: roomName.is_direct,
          workspaceId: workspace_id,
        },
        "\norganizationId",
        organizationId
      );
      const { chatClient, chatQuery } = chatService;
      const res = await chatClient.query({
        query: chatQuery.createNewChannels,
        variables: {
          roomName: get(roomName, "name", ""),
          user: roomName.is_direct
            ? ["@" + roomName.invite[0] + ":matrix.onetab.ai"]
            : [],
          isDirect: roomName.is_direct,
          workspaceId: workspace_id,
        },
        context: {
          headers: {
            organizationId,
          },
        },
      });
      thunkAPI.dispatch(getRooms());
      setTimeout(() => {
        thunkAPI.dispatch(getChannels());
      }, 1000);
      console.log("res========", res);
      return res;
    } catch (error) {
      console.log("create room error", error);
    }
  }
);

export const DeleteRoom = createAsyncThunk(
  "room/delete",
  async (createChannelInput, thunkAPI: any) => {
    try {
      const roomId = get(thunkAPI.getState(), "chatStore.room.room_id", "");
      const deleteR = await client.forget(roomId, true);
      thunkAPI.dispatch(updateChannel({ is_archive: true }));
      thunkAPI.dispatch(chatStoreActions.setToogleInviteModal(false));
      thunkAPI.dispatch(chatStoreActions.removeSelectedChannel(null));
    } catch (error) {
      console.log("DeleteRoom", error);
    }
  }
);

export const onCreateChannel = createAsyncThunk(
  "channel/post",
  async (createChannelInput: any, thunkAPI: any) => {
    try {
      let workspace_id = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      console.log("workspace KEY", workspace_id);
      createChannelInput.workspace_id = workspace_id;
      const { chatClient, chatQuery } = chatService;
      const data = await chatClient.mutate({
        mutation: chatQuery.createChannel,
        variables: { createChannelInput },
      });
      thunkAPI.dispatch(getChannels());
      console.log("onCreateChannel ", data);
      // if (get(createChannelInput, "matrixRoomId", false)) {
      // thunkAPI.dispatch(
      //   getChannel({ roomId: get(createChannelInput, "matrixRoomId", "") })
      // );
      // }
      return data;
    } catch (error) {
      console.log("onCreateChannel ", error);
    }
  }
);

export const syncChannel = createAsyncThunk(
  "channel/put",
  async (roomInfo: any, thunkAPI: any) => {
    // console.log("syncChannel ", roomInfo);
    try {
      let workspace_id = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      let channel_id = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      let roomId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom.matrixRoomId",
        ""
      );
      var datas: any = {};
      var keys = [
        "roomId",
        "myUserId",
        "notificationCounts",
        "getTypeWarning",
        "name",
      ];
      keys.forEach((key) => {
        if (get(roomInfo, key, false)) {
          datas[key] = roomInfo[key];
        }
      });
      datas["members"] = [];
      datas["leave_members"] = [];
      datas["membersInfo"] = {};
      if (get(roomInfo, "currentState.members", false)) {
        Object.keys(roomInfo.currentState.members).forEach((member) => {
          datas["membersInfo"][member] =
            roomInfo.currentState.members[member].rawDisplayName;
          if (roomInfo.currentState.members[member].membership !== "leave") {
            datas.members.push(member);
          } else {
            datas.leave_members.push(member);
          }
        });
      }
      const updateChannelInput: any = {};
      updateChannelInput.workspace_id = workspace_id;
      updateChannelInput.channel_id = channel_id;
      updateChannelInput.matrixRoomId = roomId;
      updateChannelInput.matrixRoomInfo = datas;
      console.log("updateChannelInput", updateChannelInput);
      const { chatClient, chatQuery } = chatService;
      // if (roomId && channel_id) {
      // const data = await chatClient.mutate({
      //   mutation: chatQuery.updateChannel,
      //   variables: { updateChannelInput },
      //   fetchPolicy: "no-cache",
      // });
      thunkAPI.dispatch(getChannels());
      // return data;
    } catch (error) {
      console.log("syncChannel ", error);
    }
  }
  // }
);

export const updateChannel = createAsyncThunk(
  "channel/update",
  async (updateChannelInput: any, thunkAPI: any) => {
    try {
      let workspace_id = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      let channel_id = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      let roomId: any = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom.matrixRoomId",
        ""
      );
      updateChannelInput.workspace_id = workspace_id;
      updateChannelInput.channel_id =
        "_id" in updateChannelInput ? updateChannelInput._id : channel_id;
      updateChannelInput.matrixRoomId =
        "matrixRoomId" in updateChannelInput
          ? updateChannelInput.matrixRoomId
          : roomId;
      if ("_id" in updateChannelInput) {
        delete updateChannelInput._id;
      }
      // updateChannelInput.description = datas;
      const { chatClient, chatQuery } = chatService;
      // if (roomId && channel_id) {
      const data = await chatClient.mutate({
        mutation: chatQuery.updateChannel,
        variables: { updateChannelInput },
      });
      thunkAPI.dispatch(getChannel({ roomId }));
      // dispatch(updateChannel({description :"trial"}));
      thunkAPI.dispatch(getChannels());
      return data;
    } catch (error) {
      console.log("updateChannel ", error);
    }
  }
  // }
);

export const getChannel = createAsyncThunk(
  "channel/get",
  async ({ roomId }: any, thunkAPI: any) => {
    try {
      const currentRoomId = get(
        thunkAPI.getState(),
        "chatStore.room.roomId",
        ""
      );
      let workspace_id = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      // const { chatClient, chatQuery } = chatService;
      // const data = await chatClient.mutate({
      //   mutation: chatQuery.getChannel,
      //   variables: { workspace_id, roomId },
      // });
      if (currentRoomId !== roomId) {
        thunkAPI.dispatch(getRoom({ roomId }));
      }
    } catch (error) {
      console.log("getChannel ", error);
    }
    // return data;
  }
);

export const onInviteUser = async (roomId: any, userId: string) => {
  try {
    const invite = await client.invite(
      roomId,
      "@" + userId + ":matrix.onetab.ai"
    );
    // console.log(invite);
    const { chatClient, chatQuery } = chatService;
    const data = await chatClient.query({
      query: chatQuery.inviteUserOnChat,
      variables: { matrixName: userId, roomId: roomId },
      fetchPolicy: "network-only",
    });
    console.log("onInviteUser ", data);
  } catch (error) {
    console.log("onInviteUser ", error);
    // message.error(e.message);
  }
};

export async function leaveChannel(roomId: any) {
  try {
    const roomLv = await client.leave(roomId);
    return roomLv;
  } catch (error) {
    console.log("leaveChannel ", error);
    // message.error(e.message);
  }
}

export const getChannels = createAsyncThunk(
  "channels/get",
  async (_, thunkAPI: any) => {
    // console.log("getChannels 1");
    try {
      let workspace_id = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      console.log("=====>>>>>", workspace_id);
      // let workspace_id = "646c78f5c8625aa5b9e23db6";
      // console.log("getChannels 2");
      if (workspace_id) {
        // console.log("getChannels 3");
        const { chatClient, chatQuery } = chatService;
        // console.log("getChannels 4");
        const data = await chatClient.mutate({
          mutation: chatQuery.getChannels,
          variables: { workspace_id },
          fetchPolicy: "network-only",
        });
        // console.log("getChannels 5 ",data);
        await Promise.all(
          get(data, "data.channels", []).map(async (channel: any, key: any) => {
            try {
              // console.log("getChannels 6 ",channel);
              if (get(channel, "matrixRoomId", "")) {
                // if (get(channel, "is_direct", "") === true) {
                //   await client.roomInitialSync(channel.matrixRoomId);
                // }
                const room = client.getRoom(channel.matrixRoomId);
                // console.log("getChannels 7 ");
                // const roomString = JSON.stringify(room)
                // const roomJson = JSON.parse(roomString)
                //data.data.channels[key]["matrixRoomEvent"] = room;
                //data.data.channels[key].matrixRoomEvent = room;
                // console.log("getChannels 8 ", room)
                var newInput = Object.assign({}, data.data.channels[key], {
                  ["matrixRoomEvent"]: room,
                });
                data.data.channels[key] = newInput;
                // console.log("getChannels 9 ");
              }
            } catch (e: any) {
              console.log("   ", e);
            }
          })
        );

        // console.log("getChannels 10 ");
        // );
        // chatClient.restore();
        return { data, workspace_id };
      }
    } catch (error) {
      console.log("getChannels ", error);
    }
  }
);

export const createMessageThred = createAsyncThunk(
  "room/thread/get",
  async (data: any, thunkAPI: any) => {
    try {
      if (!get(data, "threadId", undefined)) {
        const room: any = get(thunkAPI.getState(), "chatStore.room", {});
        const thread = new Thread(get(data, "event.event_id", ""), data, {
          room,
          client,
        });
        const event = thread.addEvents([data], false);
      }
      return data;
    } catch (error) {
      console.log("createMessageThred ", error);
    }
    // get(data, "event.room_id"),
    // get(data, "event.event_id"),
  }
);

//connect github

export const connectGithub = createAsyncThunk(
  "app/github/connect",
  async (authCode, thunkAPI: any) => {
    try {
      const workspaceId = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      const organizationDomain = get(
        thunkAPI.getState(),
        "userStore.userData.activeOrganizationDomain",
        ""
      );
      const { userClient, userQuery } = userService;
      const gitHubData = await userClient.mutate({
        mutation: userQuery.connectGithub,
        variables: {
          githubInput: {
            workspaceId,
            organizationDomain,
            authCode,
            isActive: false,
          },
        },
      });
      thunkAPI.dispatch(getChannels());
      return gitHubData;
    } catch (error) {
      console.log("connectGithub ", error);
    }
  }
);

export const removeGithubConnection = createAsyncThunk(
  "remove/github/app",
  async (authCode, thunkAPI: any) => {
    try {
      const channelId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      const { userClient, userQuery } = userService;
      const githubData = await userClient.mutate({
        mutation: userQuery.removeGithubConnection,
        variables: {
          channelId,
        },
      });
      //   thunkAPI.dispatch(chatStoreActions.toogleInviteModal(false));
      //   thunkAPI.dispatch(chatStoreActions.removeSelectedChannel());
      thunkAPI.dispatch(getChannels());
      return githubData;
    } catch (error) {
      console.log("removeGithubConnection ", error);
    }
  }
);

export const getGitConnections = createAsyncThunk(
  "app/github/getConnections",
  async (authCode, thunkAPI: any) => {
    try {
      const channelId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      const { userClient, userQuery } = userService;
      const gitContacts = await userClient.query({
        query: userQuery.getAllGitConnection,
        variables: { channelId },
        fetchPolicy: "network-only",
      });
      console.log("gitContacts=======>", gitContacts);
      return gitContacts;
    } catch (error) {
      console.log("getGitConnections ", error);
    }
  }
);

export const getGithubRepositories = createAsyncThunk(
  "app/github/getRepositories",
  async (authCode, thunkAPI: any) => {
    try {
      const channelId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      const { userClient, userQuery } = userService;
      const gitRepo = await userClient.query({
        query: userQuery.getGithubRepositories,
        variables: { channelId },
      });
      console.log("git repo==========>", gitRepo);
      return gitRepo;
    } catch (error) {
      console.log("getGithubRepositories ", error);
    }
  }
);

export const updateGitConnection = createAsyncThunk(
  "update/git/app",
  async (repositories, thunkAPI: any) => {
    try {
      const channelId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      const { userClient, userQuery } = userService;

      const gitData = await userClient.mutate({
        mutation: userQuery.getUpdateGitContacts,
        variables: {
          channelId,
          githubInput: { repositories },
        },
      });
      return gitData;
    } catch (error) {
      console.log("updateGitConnection ", error);
    }
  }
);

//Bitbucket
export const connectBitBucket = createAsyncThunk(
  "app/bitbucket/connect",
  async (authCode, thunkAPI: any) => {
    try {
      const workspaceId = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      console.log("workspaceId-------------->>>>>", workspaceId);
      const organizationDomain = get(
        thunkAPI.getState(),
        "userStore.userData.activeOrganizationDomain",
        ""
      );
      console.log("organizationDomain-------------->>>>>", organizationDomain);
      const { userClient, userQuery } = userService;
      const bucketData = await userClient.mutate({
        mutation: userQuery.connectBitBucket,
        variables: {
          bitbucketInput: {
            workspaceId,
            organizationDomain,
            authCode,
          },
        },
      });
      console.log("bucketData-------------->>>>>", bucketData);
      thunkAPI.dispatch(getChannels());
      return bucketData;
    } catch (error) {
      console.log("connectBitBucket ", error);
    }
  }
);

export const removeBitbucket = createAsyncThunk(
  "remove/bitbucket/app",
  async (authCode, thunkAPI: any) => {
    try {
      const channelId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      const { userClient, userQuery } = userService;
      const bucketData = await userClient.mutate({
        mutation: userQuery.deleteBitbucketConnections,
        variables: {
          channelId,
        },
      });
      // thunkAPI.dispatch(chatStoreActions.toogleInviteModal(false));
      // thunkAPI.dispatch(chatStoreActions.removeSelectedChannel());
      thunkAPI.dispatch(getChannels());
      return bucketData;
    } catch (error) {
      console.log("removeBitbucket ", error);
    }
  }
);

export const deleteBitbucketRepoSubscription = createAsyncThunk(
  "delete/bitbucket/repo/subscription",
  async (repoUid, thunkAPI: any) => {
    try {
      const channelId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      const { userClient, userQuery } = userService;

      const bitbucket = await userClient.mutate({
        mutation: userQuery.deleteBitbucketRepoSubscription,
        variables: { channelId, repoUid },
      });
      return bitbucket;
    } catch (error) {
      console.log("deleteBitbucketRepoSubscription ", error);
    }
  }
);

export const getAllbitConnection = createAsyncThunk(
  "get/bitbucket/getconnection",
  async (authCode, thunkAPI: any) => {
    const channelId = get(
      thunkAPI.getState(),
      "chatStore.selectedRoom._id",
      ""
    );
    const { userClient, userQuery } = userService;
    const bucketContacts = await userClient.query({
      query: userQuery.getbitbucketConnection,
      variables: { channelId },
      fetchPolicy: "network-only",
    });
    console.log("gitContacts=======>", bucketContacts);
    return bucketContacts;
  }
);

export const updateSubcribeBucket = createAsyncThunk(
  "update/bitBucketapp/app",
  async (payload: any, thunkAPI: any) => {
    const channelId = get(
      thunkAPI.getState(),
      "chatStore.selectedRoom._id",
      ""
    );
    const { userClient, userQuery } = userService;

    const bitbucket = await userClient.mutate({
      mutation: userQuery.createSubcription,
      variables: { channelId, ...payload },
    });
    return bitbucket;
  }
);

// jira apis
export const connectJira = createAsyncThunk(
  "app/jira/connect",
  async (authCode, thunkAPI: any) => {
    try {
      const workspaceId = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      const organizationDomain = get(
        thunkAPI.getState(),
        "userStore.userData.activeOrganizationDomain",
        ""
      );
      const { userClient, userQuery } = userService;
      const jiraData = await userClient.mutate({
        mutation: userQuery.connectJira,
        variables: {
          jiraInput: {
            workspaceId,
            organizationDomain,
            authCode,
          },
        },
      });
      console.log("connectJira ", jiraData);
      thunkAPI.dispatch(getChannels());
      return jiraData;
    } catch (error) {
      console.log("connectJira ", error);
    }
  }
);

export const getJiraConnection = createAsyncThunk(
  "app/jira/connection",
  async (authCode, thunkAPI: any) => {
    const channelId = get(
      thunkAPI.getState(),
      "chatStore.selectedRoom._id",
      ""
    );
    const { userClient, userQuery } = userService;
    try {
      console.log("channelId-->", channelId);
      const connection = await userClient.query({
        query: userQuery.getJiraConnection,
        variables: { channelId },
      });
      console.log("getJiraConnection response", connection);
      return connection;
    } catch (error) {
      console.log("getJiraConnection error", error);
    }
  }
);

export const updateJiraSubscription = createAsyncThunk(
  "update/jira/connection",
  async (project: any, thunkAPI: any) => {
    try {
      const channelId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      const { userClient, userQuery } = userService;

      const jiraUpdated = await userClient.mutate({
        mutation: userQuery.updateJiraSubscription,
        variables: { channelId, ...project },
      });
      console.log("updateJiraSubscription ", jiraUpdated);
      return jiraUpdated;
    } catch (error) {
      console.log("updateJiraSubscription ", error);
    }
  }
);

export const removeJiraConnection = createAsyncThunk(
  "remove/jira/app",
  async (authCode, thunkAPI: any) => {
    try {
      const channelId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      const { userClient, userQuery } = userService;
      const jiraData = await userClient.mutate({
        mutation: userQuery.removeJiraConnection,
        variables: { channelId },
      });
      thunkAPI.dispatch(chatStoreActions.setToogleInviteModal(false));
      thunkAPI.dispatch(chatStoreActions.removeSelectedChannel(null));
      thunkAPI.dispatch(getChannels());
      console.log("removeJiraConnection ", jiraData);
      return jiraData;
    } catch (error) {
      console.log("removeJiraConnection ", error);
    }
  }
);

//Zoom
export const connectZoom = createAsyncThunk(
  "app/zoom/connect",
  async (authCode, thunkAPI: any) => {
    try {
      const workspaceId = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      console.log("workspaceId-------------->>>>>", workspaceId);
      const organizationDomain = get(
        thunkAPI.getState(),
        "userStore.userData.activeOrganizationDomain",
        ""
      );
      console.log("organizationDomain-------------->>>>>", organizationDomain);
      const { userClient, userQuery } = userService;
      const zoomData = await userClient.mutate({
        mutation: userQuery.connectZoom,
        variables: {
          zoomInput: {
            workspaceId,
            organizationDomain,
            authCode,
          },
        },
      });
      console.log("zoomData-------------->>>>>", zoomData);
      thunkAPI.dispatch(getChannels());
      return zoomData;
    } catch (error) {
      console.log("connectZoomError --->>> ", error);
    }
  }
);

export const removeZoomConnection = createAsyncThunk(
  "app/zoom/remove",
  async (authCode, thunkAPI: any) => {
    const channelId = get(
      thunkAPI.getState(),
      "chatStore.selectedRoom._id",
      ""
    );
    const { userClient, userQuery } = userService;
    const zoomData = await userClient.mutate({
      mutation: userQuery.deleteZoomConnection,
      variables: { channelId },
    });
    console.log("zoomData-------------->>>>>", zoomData);
    thunkAPI.dispatch(getChannels());
    return zoomData;
  }
);

// gmail apis
export const gmailConnect = createAsyncThunk(
  "app/gmail/connect",
  async (authCode, thunkAPI: any) => {
    try {
      const workspaceId = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      const organizationDomain = get(
        thunkAPI.getState(),
        "userStore.userData.activeOrganizationDomain",
        ""
      );
      const { userClient, userQuery } = userService;
      const gmailData = await userClient.mutate({
        mutation: userQuery.gmailConnect,
        variables: {
          gmailInput: {
            workspaceId,
            organizationDomain,
            authCode,
          },
        },
      });
      thunkAPI.dispatch(getChannels());
      console.log("gmailConnect -->>> ", gmailData);
      return gmailData;
    } catch (error) {
      console.log("gmailConnectError -->>> ", error);
    }
  }
);

export const getGmailContatcts = createAsyncThunk(
  "app/gmail/contacts",
  async (authCode, thunkAPI: any) => {
    try {
      const workspaceId = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      const channelId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      const { userClient, userQuery } = userService;
      const gmailData = await userClient.query({
        query: userQuery.getMailContacts,
        variables: {
          workspaceId,
          channelId,
        },
      });
      console.log("gmailData=======>", gmailData);
      return gmailData;
    } catch (error) {
      console.log("getGmailContatctsError -->> ", error);
    }
  }
);

export const removeGmailConnection = createAsyncThunk(
  "remove/gmail/app",
  async (authCode, thunkAPI: any) => {
    try {
      const workspaceId = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      const channelId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      const { userClient, userQuery } = userService;
      const gmailData = await userClient.mutate({
        mutation: userQuery.removeGmailConnection,
        variables: {
          workspaceId,
          channelId,
        },
      });
      thunkAPI.dispatch(chatStoreActions.setToogleInviteModal(false));
      thunkAPI.dispatch(chatStoreActions.removeSelectedChannel(null));
      thunkAPI.dispatch(getChannels());
      console.log("removeGmailConnection -->  ", gmailData);
      return gmailData;
    } catch (error) {
      console.log("removeGmailConnectionError -->  ", error);
    }
  }
);

export const updateGmailConnection = createAsyncThunk(
  "update/gmail/app",
  async (allowedUsers, thunkAPI: any) => {
    try {
      const channelId = get(
        thunkAPI.getState(),
        "chatStore.selectedRoom._id",
        ""
      );
      const { userClient, userQuery } = userService;

      const gmailData = await userClient.mutate({
        mutation: userQuery.updateMailContacts,
        variables: {
          channelId,
          gmailInput: {
            allowedUsers,
          },
        },
      });
      // thunkAPI.dispatch(getGmailContatcts());
      console.log("updateGmailConnection --> ", gmailData);
      return gmailData;
    } catch (error) {
      console.log("updateGmailConnectionError --> ", error);
    }
  }
);

// connect custom app

export const getCustomApp = createAsyncThunk(
  "get/app/custom",
  async (allowedUsers, thunkAPI: any) => {
    try {
      const { chatClient, chatQuery } = chatService;
      const workspace_id = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      const customAppData = await chatClient.query({
        query: chatQuery.getCustomApp,
        variables: {
          workspace_id,
        },
      });
      // thunkAPI.dispatch(getGmailContatcts());
      console.log("getCustomApp ", customAppData);
      return customAppData;
    } catch (error) {
      console.log("getCustomAppError ", error);
    }
  }
);

export const addCustomApp = createAsyncThunk(
  "add/app/custom",
  async (app: any, thunkAPI: any) => {
    try {
      const { chatClient, chatQuery } = chatService;
      const workspace_id = get(
        thunkAPI.getState(),
        "workspaceStore.currentWorkspaceData._id",
        ""
      );
      const token = await getDeviceTokenToStorage();
      var formData = new FormData();
      formData.append("file", app.icon);
      const data = await fetch(`${env.NX_SERVICE_SERVER}/file-upload`, {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
        },
        body: formData,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          return data;
        });
      const customAppData = await chatClient.mutate({
        mutation: chatQuery.createCustomApp,
        variables: {
          createAppsApiInput: {
            icon: data.Location,
            workspace_id,
            appName: app.name,
            description: app.description,
          },
        },
      });
      thunkAPI.dispatch(getCustomApp());
      console.log("addCustomApp -->> ", customAppData);
      return customAppData;
    } catch (error) {
      console.log("addCustomAppError -->> ", error);
    }
  }
);

export const resetStatus = createAsyncThunk(
  "chat/room/reset",
  async (_: any, thunkAPI: any) => {
    try {
      thunkAPI.dispatch(chatStoreActions.setRoomStatus(false));
      thunkAPI.dispatch(chatStoreActions.setLoadMoreStatus(false));
      thunkAPI.dispatch(chatStoreActions.setLoadMoreList(false));
      return true;
    } catch (e) {
      return false;
    }
  }
);

const replaceSubString = (mainString: any, oldString: any, newString: any) => {
  const re = new RegExp(oldString, "g");
  var new_str = mainString.replace(re, newString);
  return new_str;
};

const updateText = (text: any) => {
  const aa = replaceSubString(text, "<p", "<div");
  const bb = replaceSubString(aa, "</p>", "</div>");
  return bb;
};

const updatedMessage = (text: any) => {
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

const insertItem = (item: any, msgs: any) => {
  var currentTime = new Date(item.getTs());
  var currentOffset = currentTime.getTimezoneOffset();
  var ISTOffset = 330;
  var msgTime = new Date(
    currentTime.getTime() + (ISTOffset + currentOffset) * 60000
  );

  const timelineItem = item;

  if (timelineItem.getType() === "m.room.message") {
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
        userName: get(item, "sender.rawDisplayName", ""),
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
        roomId: item.getRoomId(),
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
        userName: get(item, "sender.rawDisplayName", ""),
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
        roomId: item.getRoomId(),
        roomName: "",
        isDirect: false,
      };

      msgs.push(msgBody);
    }
  } else if (timelineItem.getType() === "m.reaction") {
    const reactionItem = timelineItem.getContent();
    if (reactionItem["m.relates_to"] !== undefined) {
      const reactionItemIndex = msgs.findIndex(
        (x) => x.eventId === reactionItem["m.relates_to"].event_id
      );
      if (reactionItemIndex === -1) {
        msgs.forEach((element) => {
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

const createItemFromArray = (messageArray: any, mainArray: any) => {
  let main = mainArray;
  messageArray.map((item) => {
    insertItem(item, main);
  });
};

export const fetchThreadMessages = createAsyncThunk(
  "get/getThreadMessage/app",
  async (rooms: any, thunkAPI: any) => {
    var mainArray: any = [];
    var messageArray: any = [];
    //console.log("Roomssss => ",rooms)
    for (let index = 0; index < rooms.length; index++) {
      const room: Room | null = client.getRoom(rooms[index]);
      if (room !== null) {
        const messages = await client.scrollback(room, 1000);
        //console.log("Thread Messages ==> ", messages.timeline.length);
        messages.timeline.map((item) => {
          messageArray.push(item);
        });
      }
    }
    //console.log("message array 1 ", messageArray.length,mainArray.length)
    createItemFromArray(messageArray, mainArray);
    const aa = mainArray.filter((item: any) => item.thread.length > 0);
    //console.log("message array 2 ", aa.length)
    return aa;
  }
);
export const resetThreadStatus = createAsyncThunk(
  "chat/thread/reset",
  async (_: any, thunkAPI: any) => {
    try {
      thunkAPI.dispatch(chatStoreActions.setLoadThreadListStatus(false));
      return true;
    } catch (e) {
      return false;
    }
  }
);
export const resetRoom = createAsyncThunk(
  "chat/room/reset",
  async (_: any, thunkAPI: any) => {
    try {
      thunkAPI.dispatch(chatStoreActions.setRoom(false));
      return true;
    } catch (e) {
      return false;
    }
  }
);
interface chatStoreState {
  loadingStatus: "not loaded" | "loading" | "loaded" | "error";
  error: any;
  loginData: any;
  matrixStatus: any;
  roomStatus: any;
  roomsStatus: any;
  createRoomStatus: "not loaded" | "loading" | "loaded" | "error";
  getChannelStatus: "not loaded" | "loading" | "loaded" | "error";
  getChannelChatStatus: "not loaded" | "loading" | "loaded" | "error";
  getChannelsStatus: "not loaded" | "loading" | "loaded" | "error";
  profileModal: any;
  rooms: any;
  selectedRoom: any;
  currentChannel: any;
  access_token: any;
  createRoomModal: any;
  createModal: any;
  folderModal: any;
  folderBookmark: any;
  editBookmark: any;
  editFolderModal: any;
  room: any;
  isLoadOldMessage: any;
  forceUpdate: any;
  inviteModal: any;
  inviteUserModal: any;
  threadLoading: "not loaded" | "loading" | "loaded" | "error";
  threadModal: any;
  directChatInviteModal: any;
  topic: any;
  uploadedFiles: any;
  descrModal: any;
  APIModal: any;
  apiEditorModal: any;
  selectedFile: any;
  connectGmailLoading: "not loaded" | "loading" | "loaded" | "error";
  connectJiraLoading: "not loaded" | "loading" | "loaded" | "error";
  connectZoomLoading: "not loaded" | "loading" | "loaded" | "error";
  gmailContacts: any;
  gitContacts: any;
  bitbucketContacts: any;
  jiraConnection: any;
  previewModal: any;
  toogleSideMenu: any;
  connectGitHubLoading: "not loaded" | "loading" | "loaded" | "error";
  onBoardingChat: any;
  customApps: any;
  connectBitbucketLoading: "not loaded" | "loading" | "loaded" | "error";
  getCustomAppLoading: "not loaded" | "loading" | "loaded" | "error";
  addCustomAppLoading: "not loaded" | "loading" | "loaded" | "error";
  createChannelData: any;
  createChannelStatus: "not loaded" | "loading" | "loaded" | "error";
  channelData: any;
  uploadFilesStatus: "not loaded" | "loading" | "loaded" | "error";
  loadMoreStatus: "not loaded" | "loading" | "loaded" | "error";
  loadMoreMessagesList: any;
  currentEvent: any;
  directMessages: any;
  resetStatusKey: any;
  typingEvent: any;
  threadMessageStatus: any;
  threadmessageList: any;
}
export const initialChatStoreState = chatStoreAdapter.getInitialState({
  loadingStatus: "not loaded",
  error: null || "",
  loginData: {},
  matrixStatus: "not loaded",
  roomStatus: "not loaded",
  roomsStatus: "not loaded",
  createRoomStatus: "not loaded",
  getChannelStatus: "not loaded",
  getChannelChatStatus: "not loaded",
  getChannelsStatus: "not loaded",
  profileModal: false,
  rooms: [],
  selectedRoom: {},
  currentChannel: {},
  access_token: "",
  createRoomModal: false,
  createModal: false,
  folderModal: false,
  folderBookmark: false,
  editBookmark: false,
  editFolderModal: false,
  room: {},
  isLoadOldMessage: false,
  forceUpdate: false,
  inviteModal: false,
  inviteUserModal: false,
  threadLoading: "not loaded",
  threadModal: false,
  directChatInviteModal: false,
  topic: "",
  uploadedFiles: [],
  descrModal: false,
  APIModal: false,
  apiEditorModal: false,
  selectedFile: false,
  connectGmailLoading: "not loaded",
  connectJiraLoading: "not loaded",
  connectZoomLoading: "not loaded",
  gmailContacts: {},
  gitContacts: {},
  bitbucketContacts: {},
  jiraConnection: {},
  previewModal: false,
  toogleSideMenu: false,
  connectGitHubLoading: "not loaded",
  onBoardingChat: false,
  customApps: [],
  connectBitbucketLoading: "not loaded",
  getCustomAppLoading: "not loaded",
  addCustomAppLoading: "not loaded",
  createChannelData: {},
  createChannelStatus: "not loaded",
  channelData: {},
  uploadFilesStatus: "not loaded",
  loadMoreStatus: "not loaded",
  loadMoreMessagesList: {},
  currentEvent: undefined,
  directMessages: [],
  resetStatusKey: "not loaded",
  typingEvent: {},
  threadMessageStatus: "not loaded",
  threadmessageList: [],
} as chatStoreState);

export const chatStoreSlice = createSlice({
  name: CHAT_FEATURE_KEY,
  initialState: initialChatStoreState,
  reducers: {
    add: chatStoreAdapter.addOne,
    remove: chatStoreAdapter.removeOne,
    setLoadingStatus: (state, action) => {
      state.loadingStatus = action.payload;
    },
    setResetCustumAppState: (state) => {
      state.addCustomAppLoading = "not loaded";
    },
    setOnToogleOnBoarding: (state) => {
      state.onBoardingChat = !state.onBoardingChat;
    },
    setOnToogleSideMenu: (state) => {
      state.toogleSideMenu = !state.toogleSideMenu;
    },
    setTooglePreviewModal: (state, action) => {
      state.previewModal = action.payload;
    },
    setUpdateAllowUser: (state, action) => {
      state.gmailContacts.allowedUsers = action.payload;
    },
    setUpdateGitRepo: (state, action) => {
      state.gitContacts.repositories = action.payload;
    },
    setSubcribeBitRepo: (state, action) => {
      state.bitbucketContacts.repositories = action.payload;
    },
    setUpdateJiraSubscription: (state, action) => {
      state.jiraConnection.projects = action.payload;
    },
    setToogleProfileModal: (state, action) => {
      state.profileModal = action.payload;
    },
    setOnSelectFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    setUpdateSelectedRoom: (state, action) => {
      state.selectedRoom = {
        ...state.selectedRoom,
        save_messages: action.payload,
      };
    },
    setUpdateBookmark: (state, action) => {
      state.selectedRoom = {
        ...state.selectedRoom,
        bookmarks: action.payload,
      };
    },
    setToogleApiEditorModal: (state, action) => {
      state.apiEditorModal = action.payload;
      state.threadModal = false;
    },
    setToogleAPIModal: (state, action) => {
      state.APIModal = action.payload;
    },
    setUpdateUploadEvent: (state: any, action) => {
      const id = get(action, "payload.id", "");
      const event = get(action, "payload.event", "");
      const index = state.uploadedFiles.findIndex((e: any) => e.id === id);
      if (index !== -1) {
        state.uploadedFiles[index].event = event;
      }
    },
    setRemoveUploadedFile: (state, action) => {
      const id = get(action, "payload.id", "");
      const index = state.uploadedFiles.findIndex((e: any) => e.id === id);
      if (index !== -1) {
        state.uploadedFiles.splice(index, 1);
      }
    },
    setToogleDirectChatModal: (state, action) => {
      state.directChatInviteModal = action.payload;
    },
    setToogleThreadModal: (state, action) => {
      state.threadModal = action.payload;
      state.apiEditorModal = false;
    },
    setToogleInviteUserModal: (state, action) => {
      state.inviteUserModal = action.payload;
    },
    setForceUpdate: (state, action) => {
      state.forceUpdate = !state.forceUpdate;
    },
    setToogleInviteModal: (state, action) => {
      state.inviteModal = action.payload;
    },
    setResetLoadStatus: (state) => {
      state.isLoadOldMessage = false;
    },
    setPushNewMessageEvent: (state, action) => {
      if (get(state, "room.messages.chunk", false)) {
        state.room.messages.chunk.push(action.payload);
      }
    },
    setOnToogleModal: (state, action) => {
      state.createModal = action.payload;
    },
    setToogleEditBM: (state, action) => {
      state.editBookmark = action.payload;
    },
    setOnToogleFolderBMModal: (state, action) => {
      state.folderBookmark = action.payload;
    },
    setOnToogleFolderModal: (state, action) => {
      state.folderModal = action.payload;
    },
    setOnToogleFolderEditModal: (state, action) => {
      state.editFolderModal = action.payload;
    },
    setOnToogleDescrModal: (state, action) => {
      state.descrModal = action.payload;
    },
    setOnSelectChat: (state, action) => {
      state.selectedRoom = action.payload.room;
      // state.isLoadOldMessage = true;

      const workspaceid =
        get(action, "payload.room.workspace._id", false) ||
        get(action, "payload.room.workspace", false);
      const matrixRoomId = get(action, "payload.room.matrixRoomId", false);

      if (workspaceid && matrixRoomId) {
        try {
          AsyncStorage.setItem(
            `chat-active-channel-${workspaceid}`,
            matrixRoomId
          );
          saveStorage(allStorage());
        } catch (error) {
          console.log("error storage 1", error);
        }
      }
    },
    setOnSelectRoom: (state, action) => {
      state.room = {
        messages: {
          chunk: [],
        },
      };
      state.selectedRoom = action.payload.room;
      console.log(action.payload.room);
      state.getChannelStatus = "loading";
      state.getChannelChatStatus = "loading";
      const workspaceid =
        get(action, "payload.room.workspace._id", false) ||
        get(action, "payload.room.workspace", false);
      const matrixRoomId = get(action, "payload.room.matrixRoomId", false);

      if (workspaceid && matrixRoomId) {
        try {
          AsyncStorage.setItem(
            `chat-active-channel-${workspaceid}`,
            matrixRoomId
          );
          saveStorage(allStorage());
        } catch (error) {
          console.log("error storage 2", error);
        }
      }
    },
    removeSelectedChannel: (state, action) => {
      state.selectedRoom = {};
      const workspaceid =
        get(action, "payload.room.workspace._id", false) ||
        get(action, "payload.room.workspace", false);

      if (workspaceid) {
        try {
          AsyncStorage.removeItem(`chat-active-channel-${workspaceid}`);
          saveStorage(allStorage());
        } catch (error) {
          console.log("error storage 3", error);
        }
      }
    },
    setToogleCreateRoomModal: (state, action) => {
      state.createRoomModal = action.payload;
    },
    setStatus: (state, action) => {
      state.matrixStatus = action.payload;
    },
    getTopic: (state, action) => {
      state.topic = action.payload;
    },
    setUploadStatus: (state, action) => {
      state.uploadFilesStatus = action.payload;
    },
    setUploadedFiles: (state, action) => {
      state.uploadedFiles = action.payload;
    },
    setDirectMessages: (state, action) => {
      // console.log("direct messages", action.payload);
      state.directMessages = action.payload;
    },
    setLoadMoreStatus: (state, action) => {
      state.loadMoreStatus = "not loaded";
    },
    setRoomStatus: (state, action) => {
      state.roomStatus = "not loaded";
    },
    setLoadMoreList: (state, action) => {
      state.loadMoreMessagesList = {};
    },
    setCreateRoomStatus: (state, action) => {
      state.createRoomStatus = action.payload;
    },
    setLoadThreadListStatus: (state, action) => {
      state.threadMessageStatus = "not loaded";
      state.threadmessageList = [];
    },
    setRoom: (state, action) => {
      state.room = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatAccessToken.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(getChatAccessToken.fulfilled, (state, action) => {
        // chatAdapter.setAll(state, action.payload);
        state.loadingStatus = "loaded";
      })
      .addCase(getChatAccessToken.rejected, (state, action) => {
        state.loadingStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(uploadFiles.pending, (state, action) => {
        state.uploadFilesStatus = "loading";
        console.log(action);
        const file = get(action, "meta.arg.file", []);
        const id = get(action, "meta.arg.id", "");
        const url = get(action, "meta.arg.url", "");
        const threadId = get(action, "meta.arg.threadId", "");
        state.uploadedFiles.push({
          file,
          id,
          threadId,
          roomId: get(state, "room.roomId", ""),
          status: "uploading",
          url,
        });
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        // chatAdapter.setAll(state, action.payload);
        state.uploadFilesStatus = "loaded";
        const id = get(action, "payload.id", "");
        const index = state.uploadedFiles.findIndex((e: any) => e.id === id);
        if (index !== -1) {
          state.uploadedFiles[index].status = "uploaded";
          state.uploadedFiles[index].url = get(
            action,
            "payload.data.Location",
            ""
          );
        }
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.uploadFilesStatus = "error";
        const id = get(action, "meta.arg.id", "");
        const index = state.uploadedFiles.findIndex((e: any) => e.id === id);
        if (index !== -1) {
          state.uploadedFiles[index].status = "error";
        }
        // state.error = action.error.message;
      })

      // uploadFiles
      .addCase(getRooms.pending, (state) => {
        state.roomsStatus = "loading";
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        if (
          get(action, "payload.rooms", []).length &&
          !Object.keys(state.selectedRoom).length
        ) {
          state.selectedRoom = get(action, "payload.rooms[0]", {});
        }
        state.rooms = get(action, "payload.rooms", []);
        state.roomsStatus = "loaded";
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.roomsStatus = "error";
      })
      .addCase(DeleteRoom.pending, (state) => {
        state.roomsStatus = "loading";
      })
      .addCase(DeleteRoom.fulfilled, (state, action) => {
        state.roomsStatus = "loaded";
      })
      .addCase(DeleteRoom.rejected, (state, action) => {
        state.roomsStatus = "error";
      })
      .addCase(createMessageThred.pending, (state) => {
        state.threadLoading = "loading";
        state.threadModal = true;
        state.apiEditorModal = false;
      })
      .addCase(createMessageThred.fulfilled, (state, action) => {
        state.threadModal = action.payload;
        state.apiEditorModal = false;
        state.threadLoading = "loaded";
      })
      .addCase(createMessageThred.rejected, (state, action) => {
        state.threadLoading = "error";
      })
      .addCase(getRoomTopic.fulfilled, (state, action) => {
        if (action.payload?.topic !== undefined) {
          state.topic = action.payload.topic.toString() ?? "";
        }
      })

      .addCase(getRoom.pending, (state) => {
        state.roomStatus = "loading";
      })
      .addCase(getRoom.fulfilled, (state, action) => {
        state.room = action.payload.room;

        // setTimeout(() => {
        state.roomStatus = "loaded";
        // }, 500);
      })
      .addCase(getRoom.rejected, (state, action) => {
        console.log("error getroom", action.error.message);
        state.roomStatus = "error";
        // state.room = {};
      })

      .addCase(createRoom.pending, (state) => {
        state.createRoomStatus = "loading";
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        // chatAdapter.setAll(state, action.payload);
        state.createRoomModal = false;
        state.directChatInviteModal = false;
        state.createRoomStatus = "loaded";
        const result = action.payload.data.createPrivateRoomForUser;
        // console.log("result==========>",result);
        state.selectedRoom = result;
     
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.createRoomStatus = "error";
      })
      .addCase(onCreateChannel.pending, (state) => {
        state.createChannelStatus = "loading";
      })
      .addCase(onCreateChannel.fulfilled, (state, action) => {
        state.createChannelData = action.payload ?? {};
        state.createChannelStatus = "loaded";
        state.selectedRoom = action.payload?.data.createChannel;
        const workspaceid = get(
          action,
          "payload.data.createChannel.workspace._id",
          false
        );
        const matrixRoomId = get(
          action,
          "payload.data.createChannel.matrixRoomId",
          false
        );
        console.log(workspaceid, matrixRoomId, "sync data ");
        if (workspaceid && matrixRoomId) {
          try {
            AsyncStorage.setItem(
              `chat-active-channel-${workspaceid}`,
              matrixRoomId
            );
            saveStorage(allStorage());
          } catch (error) {
            console.log("error storage 4", error);
          }
        }
        // chatAdapter.setAll(state, action.payload);
        // state.onSelectChat = action.payload;
        // chatActions.onSelectChat(action.payload);
        // state.createRoomModal = false;
        // state.createRoomStatus = "loaded";
      })
      .addCase(onCreateChannel.rejected, (state, action) => {
        state.createChannelStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(syncChannel.pending, (state) => {
        // state.createRoomStatus = "loading";
      })
      .addCase(syncChannel.fulfilled, (state, action) => {
        // chatAdapter.setAll(state, action.payload);
      })
      .addCase(syncChannel.rejected, (state, action) => {
        console.log("error", action);
      })
      .addCase(getChannel.pending, (state) => {
        // state.createRoomStatus = "loading";
        state.getChannelStatus = "loading";
      })
      .addCase(getChannel.fulfilled, (state, action) => {
        // chatAdapter.setAll(state, action.payload);
        state.currentChannel = get(action, "payload.data.channel", {});
        state.getChannelStatus = "loaded";
        state.getChannelChatStatus = "loaded";
      })
      .addCase(getChannel.rejected, (state, action) => {
        console.log("error", action);
        state.getChannelStatus = "error";
      })
      .addCase(getChannels.pending, (state) => {
        // state.createRoomStatus = "loading";
        state.getChannelsStatus = "loading";
      })
      .addCase(getChannels.fulfilled, (state, action) => {
        state.channelData = action.payload ?? {};
        // console.log("key", action.payload.data.data.channels);
        try {
          const workspace_id = get(action, "payload.workspace_id", "");
          const lastUsedChat = AsyncStorage.getItem(
            `chat-active-channel-${workspace_id}`
          );
          if (
            !get(action, "payload.data.data.channels", []).find(
              (e: any) => e.matrixRoomId === state.selectedRoom.matrixRoomId
            )
          ) {
            state.selectedRoom = {};
          }
          // console.log("selectedRoom============>", state.selectedRoom, action);
          if (!get(state, "selectedRoom.matrixRoomId", "")) {
            if (lastUsedChat) {
              const chatIndex = get(
                action,
                "payload.data.data.channels",
                []
              ).findIndex(
                (e: any) =>
                  e.matrixRoomId === lastUsedChat &&
                  !get(e, "matrixRoomInfo.leave_members", []).includes(
                    get(e, "matrixRoomEvent.myUserId", "")
                  )
              );
              if (chatIndex !== -1) {
                state.selectedRoom = get(
                  action,
                  `payload.data.data.channels[${chatIndex}]`,
                  {}
                );
              } else {
                // state.selectedRoom = get(
                //   action,
                //   `payload.data.data.channels[0]`,
                //   {}
                // );
              }
            }
          }
          if (!get(action, "payload.data.data.channels", []).length) {
            state.selectedRoom = {};
            state.room = {
              messages: {
                chunk: [{}],
              },
            };
          }
          if (
            get(action, "payload.data.data.channels", []).length &&
            !Object.keys(state.selectedRoom).length
          ) {
            state.selectedRoom = get(
              action,
              "payload.data.data.channels[0]",
              {}
            );
          }
          if (
            get(action, "payload.data.data.channels", []).length &&
            Object.keys(state.selectedRoom).length
          ) {
            const selectedIndex = get(
              action,
              "payload.data.data.channels",
              []
            ).findIndex(
              (e: any) => e.matrixRoomId === state.selectedRoom.matrixRoomId
            );
            if (selectedIndex !== -1) {
              state.selectedRoom = get(
                action,
                `payload.data.data.channels[${selectedIndex}]`,
                {}
              );
            }
          }

          state.rooms = get(action, "payload.data.data.channels", []);
          state.getChannelsStatus = "loaded";
        } catch (error) {
          console.log("key Error", error);
        }
      })
      .addCase(getChannels.rejected, (state, action) => {
        state.getChannelsStatus = "error";
        console.log("error", action);
      })
      .addCase(updateChannel.pending, (state) => {
        // state.createRoomStatus = "loading";
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        state.createModal = false;
        state.folderModal = false;
        state.folderBookmark = false;
        state.editBookmark = false;
        state.editFolderModal = false;
        state.descrModal = false;
      })
      .addCase(updateChannel.rejected, (state, action) => {
        // state.updateStatus = "error";
        state.error = action.error.message ?? "";
        // console.log("error", action);
      })
      .addCase(loadMoreMessages.pending, (state) => {
        state.loadMoreStatus = "loading";
      })
      .addCase(loadMoreMessages.fulfilled, (state, action) => {
        state.loadMoreStatus = "loaded";
        state.loadMoreMessagesList = action.payload ?? {};
      })
      .addCase(loadMoreMessages.rejected, (state, action) => {
        state.loadMoreStatus = "error";
      })
      .addCase(currentRoomEvent.pending, (state) => {
        state.currentEvent = undefined;
      })
      .addCase(currentRoomEvent.fulfilled, (state, action) => {
        state.currentEvent = action.payload ?? undefined;
      })
      .addCase(currentRoomEvent.rejected, (state, action) => {
        state.currentEvent = undefined;
      })
      .addCase(resetStatus.pending, (state) => {
        state.resetStatusKey = "loading";
      })
      .addCase(resetStatus.fulfilled, (state, action) => {
        state.resetStatusKey = "loaded";
      })
      .addCase(resetStatus.rejected, (state, action) => {
        state.resetStatusKey = "error";
      })
      .addCase(currentRoomTypingEvent.pending, (state) => {
        state.typingEvent = undefined;
      })
      .addCase(currentRoomTypingEvent.fulfilled, (state, action) => {
        state.typingEvent = action.payload ?? undefined;
      })
      .addCase(currentRoomTypingEvent.rejected, (state, action) => {
        state.typingEvent = undefined;
      })
      .addCase(fetchThreadMessages.pending, (state) => {
        state.threadMessageStatus = "loading";
      })
      .addCase(fetchThreadMessages.fulfilled, (state, action) => {
        state.threadMessageStatus = "loaded";
        state.threadmessageList = action.payload ?? [];
      })
      .addCase(fetchThreadMessages.rejected, (state, action) => {
        state.threadMessageStatus = "error";
      });
  },
});
/*
 * Export reducer for store configuration.
 */
export const chatReducer = chatStoreSlice.reducer;
/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(storeActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const chatStoreActions = chatStoreSlice.actions;
/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllStore);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = chatStoreAdapter.getSelectors();
export const getChatStoreState = (rootState) => rootState[CHAT_FEATURE_KEY];
export const selectAllChatStore = createSelector(getChatStoreState, selectAll);
export const selectChatStoreEntities = createSelector(
  getChatStoreState,
  selectEntities
);
