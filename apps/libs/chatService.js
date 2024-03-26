import {
  ApolloClient,
  HttpLink,
  gql,
  InMemoryCache,
  concat,
} from "@apollo/client";
import authMiddleware from "./middleware/authMiddleware";

const httpLink = new HttpLink({ uri: "https://stg-connect.onetab.ai/api/graphql" });

const chatClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

const createChannel = gql`
  mutation createChannel($createChannelInput: CreateChannelInput!) {
    createChannel(createChannelInput: $createChannelInput) {
      _id
      workspace {
        _id
        userId
        name
      }
      name
      description
      bookmarks {
        link
        name
        folderName
        bookmarks {
          name
          url
        }
      }
      matrixRoomId
      matrixRoomInfo {
        roomId
        myUserId
        name
        members
        notificationCounts {
          total
          highlight
        }
        leave_members
      }
      is_direct
      is_archive
      leave_members
      file_upload {
        event_id
        age
        origin_server_ts
        room_id
        sender
        senderId
        type
        date
        matrixUserId
        unsigned {
          age
          transaction_id
        }
        content {
          body
          url
          msgtype
          info {
            size
            mimetype
            name
          }
        }
      }
      save_messages {
        event_id
        age
        origin_server_ts
        room_id
        sender
        senderId
        type
        date
        matrixUserId
        unsigned {
          age
          transaction_id
        }
        content {
          body
          url
          msgtype
          info {
            size
            mimetype
            name
          }
        }
      }
    }
  }
`;

const updateChannel = gql`
  mutation updateChannel($updateChannelInput: UpdateChannelInput!) {
    updateChannel(updateChannelInput: $updateChannelInput) {
      _id
      workspace {
        _id
        userId
        name
      }
      name
      description
      bookmarks {
        link
        name
        folderName
        bookmarks {
          name
          url
        }
      }
      matrixRoomId
      matrixRoomInfo {
        roomId
        myUserId
        name
        members
        notificationCounts {
          total
          highlight
        }
        leave_members
      }
      is_direct
      is_archive
      leave_members
      file_upload {
        event_id
        age
        origin_server_ts
        room_id
        sender
        senderId
        type
        date
        saveMessageDate
        matrixUserId
        unsigned {
          age
          transaction_id
        }
        content {
          body
          url
          msgtype
          info {
            size
            mimetype
            name
            organization_id
            workspace_id
            type
            body
            body_type
            created_at
            headers {
              token
            }
            method
            request_description
            request_name
            response
            responseCode
            saved_response
            show_in_history
            updated_at
            url
            user_id
            workspace
            _id
          }
        }
      }
      save_messages {
        event_id
        age
        origin_server_ts
        room_id
        sender
        senderId
        type
        date
        saveMessageDate
        matrixUserId
        user_id
        unsigned {
          age
          transaction_id
        }
        content {
          body
          url
          msgtype
          info {
            size
            organization_id
            workspace_id
            type
            mimetype
            name
            event {
              agoraToken
              channel
              channelName
              created_at
              endAt
              endTime
              eventId
              iconUri
              kind
              matrixRoomId
              meetExpiration
              meetId
              meetUrl
              organizationDomain
              participants
              startAt
              startTime
              timeZone
              title
              updated_at
              user
              workspace
              _id
            }
            user {
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`;

const getChannel = gql`
  query getChannel($workspace_id: String!, $roomId: String!) {
    channel(workspace_id: $workspace_id, roomId: $roomId) {
      _id
      workspace {
        _id
        userId
        name
      }
      name
      description
      bookmarks {
        link
        name
        folderName
        bookmarks {
          name
          url
        }
      }
      matrixRoomId
      matrixRoomInfo {
        roomId
        myUserId
        name
        membersInfo
        members
        notificationCounts {
          total
          highlight
        }
        leave_members
      }
      is_direct
      is_archive
      leave_members
      file_upload {
        event_id
        age
        origin_server_ts
        room_id
        sender
        senderId
        type
        date
        matrixUserId
        unsigned {
          age
          transaction_id
        }
        content {
          body
          url
          msgtype
          info {
            size
            mimetype
            name
          }
        }
      }
      save_messages {
        event_id
        age
        origin_server_ts
        room_id
        sender
        senderId
        type
        date
        matrixUserId
        unsigned {
          age
          transaction_id
        }
        content {
          body
          url
          msgtype
          info {
            size
            mimetype
            name
          }
        }
      }
    }
  }
`;

const getChannels = gql`
  query getChannels($workspace_id: String!) {
    channels(workspace_id: $workspace_id)
  }
`;

const inviteUserOnChat = gql`
  query inviteUserOnChat($matrixName: [String!]!, $roomId: String!) {
    getuserData(matrixName: $matrixName, roomId: $roomId)
  }
`;

const getCustomApp = gql`
  query getCustomApp($workspaceId: String!) {
    getAllApps(workspaceId: $workspaceId) {
      _id
      appName
      icon
      secretKey
      userId {
        _id
        firstName
      }
      organizationId
      description
      workspace {
        _id
        name
        userId
      }
      customAppChannel {
        _id
        name
      }
    }
  }
`;

const createCustomApp = gql`
  mutation createCustomApp($createAppsApiInput: CreateAppsApiInput!) {
    createAppApi(createAppsApiInput: $createAppsApiInput) {
      appName
    }
  }
`;

const removeCustomApp = gql`
  mutation removeAppApi($workspaceId: String!, $hookId: String!) {
    removeAppApi(workspaceId: $workspaceId, hookId: $hookId)
  }
`;

const getChatPreferenceByUser = gql`
  query getChatPreferenceByUser($workspace: String!) {
    getChatPreferenceByUser(workspace: $workspace) {
      _id
      notification {
        event
        allowedDays
        durations {
          day
          startTime {
            hour
            minute
          }
          endTime {
            hour
            minute
          }
        }
      }
      connectedApps
      notifyApi {
        isEnable
        channels
      }
      notifyKanban {
        isEnable
        channels
      }
    }
  }
`;

const createChatPreference = gql`
  mutation createChatPreference($chatPreferenceInput: InputPreference!) {
    createChatPreference(chatPreferenceInput: $chatPreferenceInput) {
      _id
      notification {
        event
        allowedDays
        durations {
          day
          startTime {
            hour
            minute
          }
          endTime {
            hour
            minute
          }
        }
      }
      connectedApps
      notifyApi {
        isEnable
        channels
      }
      notifyKanban {
        isEnable
        channels
      }
    }
  }
`;

const getCalendarEventsByWorkspace = gql`
  query getCalendarEventsByWorkspace(
    $workspaceId: String!
    $matrixUserId: String!
  ) {
    getCalendarEventsByWorkspace(
      workspaceId: $workspaceId
      matrixUserId: $matrixUserId
    )
  }
`;

const getGoogleCalendarEvents = gql`
  query getGoogleCalendarEvents($workspaceId: String!) {
    getGoogleCalendarEvents(workspaceId: $workspaceId) {
      id
      title
      description
      htmlLink
      startAt
      endAt
      iconUri
      creator
      hangoutLink
    }
  }
`;

const getEventById = gql`
  query getEventById($eventId: String!) {
    getEventById(eventId: $eventId) {
      _id
      channelName
      agoraToken
      meetId
    }
  }
`;

const createCalendarEvent = gql`
  mutation createCalendarEvent($calendarEventInput: InputCalendarEvent!) {
    createCalendarEvent(calendarEventInput: $calendarEventInput) {
      title
      startAt
      endAt
    }
  }
`;

const deleteCalendarEvent = gql`
  mutation deleteCalendarEvent($calendarEventInput: InputCalendarEvent!) {
    deleteCalendarEvent(calendarEventInput: $calendarEventInput)
  }
`;

const getSaveMessage = gql`
  query getSaveMessage($workspace_id: String!) {
    saveMessages(workspace_id: $workspace_id)
  }
`;

const connectCalendar = gql`
  mutation connectCalendar($calendarInput: CalendarInput!) {
    connectCalendar(calendarInput: $calendarInput) {
      _id
    }
  }
`;

const getCalendarConnection = gql`
  query getCalendarConnection($workspaceId: String!) {
    getCalendarConnection(workspaceId: $workspaceId) {
      _id
    }
  }
`;

const deleteCalendarConnection = gql`
  mutation deleteCalendarConnection($workspaceId: String!) {
    deleteCalendarConnection(workspaceId: $workspaceId)
  }
`;

const connectChatKanban = gql`
  mutation connectChatKanban(
    $organizationDomain: String!
    $workspaceId: String!
  ) {
    connectChatKanban(
      organizationDomain: $organizationDomain
      workspaceId: $workspaceId
    ) {
      _id
      isActive
    }
  }
`;

const getChatKanban = gql`
  query getChatKanban($workspaceId: String!, $includeBoards: Boolean!) {
    getChatKanban(workspaceId: $workspaceId, includeBoards: $includeBoards) {
      _id
      isActive
      subscribedBoards
      boards {
        _id
        name
      }
    }
  }
`;

const updateChatKanban = gql`
  mutation updateChatKanban($workspaceId: String!, $kanbanInput: KanbanInput!) {
    updateChatKanban(workspaceId: $workspaceId, kanbanInput: $kanbanInput) {
      _id
      isActive
      subscribedBoards
    }
  }
`;

const deleteChatKanban = gql`
  mutation deleteChatKanban($workspaceId: String!) {
    deleteChatKanban(workspaceId: $workspaceId) {
      _id
      isActive
    }
  }
`;

const connectChatCICD = gql`
  mutation connectChatCICD(
    $organizationDomain: String!
    $workspaceId: String!
  ) {
    connectChatCICD(
      organizationDomain: $organizationDomain
      workspaceId: $workspaceId
    ) {
      _id
      isActive
    }
  }
`;

const getChatCICD = gql`
  query getChatCICD($workspaceId: String!) {
    getChatCICD(workspaceId: $workspaceId) {
      _id
      isActive
    }
  }
`;

const deleteChatCICD = gql`
  mutation deleteChatCICD($workspaceId: String!) {
    deleteChatCICD(workspaceId: $workspaceId) {
      _id
      isActive
    }
  }
`;

const createNewChannels = gql`
  query createPrivateRoom(
    $roomName: String!
    $workspaceId: String!
    $isDirect: Boolean!
    $user: [String!]!
  ) {
    createPrivateRoomForUser(
      roomName: $roomName
      workspaceId: $workspaceId
      isDirect: $isDirect
      user: $user
    ) {
      _id
      workspace {
        _id
        userId
        name
      }
      name
      description
      bookmarks {
        link
        name
        folderName
        bookmarks {
          name
          url
        }
      }
      matrixRoomId
      matrixRoomInfo {
        roomId
        myUserId
        name
        members
        notificationCounts {
          total
          highlight
        }
        leave_members
      }
      is_direct
      is_archive
      leave_members
      file_upload {
        event_id
        age
        origin_server_ts
        room_id
        sender
        senderId
        type
        date
        matrixUserId
        unsigned {
          age
          transaction_id
        }
        content {
          body
          url
          msgtype
          info {
            size
            mimetype
            name
          }
        }
      }
      save_messages {
        event_id
        age
        origin_server_ts
        room_id
        sender
        senderId
        type
        date
        matrixUserId
        unsigned {
          age
          transaction_id
        }
        content {
          body
          url
          msgtype
          info {
            size
            mimetype
            name
          }
        }
      }
    }
  }
`;

const getApps = gql`
  query getApps {
    getApps {
      _id
      appId
      name
      path
      description
      isActive
    }
  }
`;

const removeUser = gql`
  query removeUser($room_Id: [String!]!, $userId: String!) {
    removeUser(room_Id: $room_Id, userId: $userId)
  }
`;

const createUsersActivitiesLog = gql`
  mutation createUsersActivitiesLog(
    $workspace: String!
    $type: String!
    $messageType: String!
    $count: Float!
  ) {
    createUsersActivitiesLog(
      workspace: $workspace
      type: $type
      messageType: $messageType
      count: $count
    ) {
      _id
    }
  }
`;

const oneAskQuery = gql`
  mutation oneAskQuery($directoryId: String!, $userInput: String!) {
    oneAskQuery(directoryId: $directoryId, userInput: $userInput) {
      success
      data
    }
  }
`;
export const chatService = {
  chatClient,
  chatQuery: {
    createChannel,
    createNewChannels,
    getSaveMessage,
    removeUser,
    updateChannel,
    inviteUserOnChat,
    getChannel,
    getChannels,
    getCustomApp,
    createCustomApp,
    removeCustomApp,
    getChatPreferenceByUser,
    createChatPreference,
    getCalendarEventsByWorkspace,
    createCalendarEvent,
    getEventById,
    connectCalendar,
    getCalendarConnection,
    getGoogleCalendarEvents,
    deleteCalendarConnection,
    deleteCalendarEvent,
    connectChatKanban,
    getChatKanban,
    updateChatKanban,
    deleteChatKanban,
    connectChatCICD,
    getChatCICD,
    deleteChatCICD,
    getApps,
    createUsersActivitiesLog,
    oneAskQuery,
  },
};
