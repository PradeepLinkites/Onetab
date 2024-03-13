import { Image, Pressable, Text, View } from "react-native";
import React, { useMemo } from "react";
import { styles } from "../styles";

interface DirectListPropType {
  directMessageList: any;
  openDirect: any;
  setIsVisible: any;
}
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons, Octicons } from "@expo/vector-icons";

import { getUserNameForDirectMessage } from "../../../../store";
enum status {
  active = "active",
  inActive = "inActive",
}
export const DirectList = (props: DirectListPropType) => {
  const { directMessageList, openDirect, setIsVisible } = props;
  const [isOpenDM, setIsOpenDM] = React.useState(true);
  const dMProgress = useSharedValue(1);
  React.useEffect(() => {
    dMProgress.value = withTiming(isOpenDM ? 1 : 0, { duration: 200 });
  }, [isOpenDM]);

  const animatedDMIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${dMProgress.value * -180}deg` }],
      marginRight: 8,
    };
  });

  const animatedDMlistStyle = useAnimatedStyle(() => {
    return {
      opacity: dMProgress.value,
      height: 39 * dMProgress.value * (directMessageList.length + 1),
      paddingLeft: 12,
    };
  }, [directMessageList.length]);

  return (
    <View style={styles.contentViewStyle}>
      <Pressable
        onPress={() => setIsOpenDM(!isOpenDM)}
        style={styles.headerPressableStyle}
      >
        <Text style={styles.headingStyle}>{"Direct messages"}</Text>

        <Animated.View style={animatedDMIconStyle}>
          <Ionicons name="chevron-down" size={24} color="black" />
        </Animated.View>
      </Pressable>
      <Animated.View style={animatedDMlistStyle}>
        {directMessageList.map((item: any, index: any) => {
          return (
            <Pressable
              key={item.name + index}
              style={[styles.itemContainerStyle, { alignItems: "center" }]}
              onPress={() => {
                dMProgress.value === 1 && openDirect(item);
              }}
            >
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
                    top: 25,
                    left: 18.5,
                  },
                ]}
              ></View>
              <Text style={styles.textStyle}>
                {getUserNameForDirectMessage(item)}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          style={styles.addElementContainerStyle}
          onPress={() => setIsVisible(true)}
        >
          <Octicons
            name="plus"
            size={20}
            color="#656971"
            style={{
              paddingHorizontal: 4,
              paddingVertical: 2.5,
            }}
          />
          <Text style={styles.textStyle}>Invite member</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};
