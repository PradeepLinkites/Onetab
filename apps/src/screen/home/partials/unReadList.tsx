import { Image, Pressable, Text, View } from "react-native";
import React from "react";
import { styles } from "../styles";

import { getUserNameForDirectMessage } from "../../../../store";
interface unReadPropType {
  unreadMessageList: any;
  openDirect: any;
}
enum status {
  active = "active",
  inActive = "inActive",
}
export const UnReadList = (props: unReadPropType) => {
  const { unreadMessageList, openDirect } = props;

  return (
    <View style={styles.contentViewStyle}>
      <Pressable
        // onPress={() => setOpen(!isOpen)}
        style={styles.headerPressableStyle}
      >
        <Text style={styles.headingStyle}>{"Unread DMs"}</Text>

        {/* <Animated.View style={animatedIconStyle}>
        <Ionicons name="chevron-down" size={24} color="black" />
      </Animated.View> */}
      </Pressable>
      <View style={{ paddingLeft: 12, marginTop: 8 }}>
        {unreadMessageList.map((item: any, index: any) => {
          return (
            <Pressable
              key={item.name + index}
              style={[
                styles.itemContainerStyle,
                { justifyContent: "space-between" },
              ]}
              onPress={() => openDirect(item)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {item.url !== undefined && item.url !== "" ? (
                  <Image
                    source={{ uri: item.url }}
                    style={{
                      height: 25,
                      width: 25,
                      resizeMode: "cover",
                      borderRadius: 5,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 25,
                      height: 25,
                      backgroundColor: "#176FFC",
                      marginRight: 0,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.nameHeader}>
                      {getUserNameForDirectMessage(item).substring(0, 1)}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.badgeStyle,
                    {
                      backgroundColor:
                        item.status === status.active ? "#5BDA15" : "#FF8E29",
                      top: 18.5,
                      left: 18.5,
                    },
                  ]}
                ></View>
                <Text style={styles.nameStyle}>
                  {getUserNameForDirectMessage(item)}
                </Text>
              </View>
              <View style={styles.unreadViewStyle}>
                <Text style={styles.unReadNumStyle}>
                  {item.matrixRoomEvent.notificationCounts.total > 9
                    ? "9+"
                    : item.matrixRoomEvent.notificationCounts.total}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
