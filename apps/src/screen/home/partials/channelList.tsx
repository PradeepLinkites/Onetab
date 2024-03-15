import { Image, Pressable, Text, View } from "react-native";
import React from "react";
import { styles } from "../styles";

interface ChannelListPropType {
  channelMessageList: any;
  openChannel: any;
  navigation: any;
}
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Hash_Icon } from "../../../assets";
import { RootRoutes } from "../../../navigation/routes";
import { Ionicons, Octicons } from "@expo/vector-icons";
export const ChannelList = (props: ChannelListPropType) => {
  const { channelMessageList, openChannel, navigation } = props;
  const [isOpenChannels, setOpenChannels] = React.useState(true);
  const channelProgress = useSharedValue(1);
  React.useEffect(() => {
    channelProgress.value = withTiming(isOpenChannels ? 1 : 0, {
      duration: 200,
    });
  }, [isOpenChannels]);
  const animatedChannelIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${channelProgress.value * -180}deg` }],
      marginRight: 8,
    };
  });
  const animatedChannnellistStyle = useAnimatedStyle(() => {
    return {
      opacity: channelProgress.value,
      height: 35 * channelProgress.value * (channelMessageList.length + 1),
      paddingLeft: 12,
    };
  });
  return (
    <View style={styles.contentViewStyle}>
      <Pressable
        onPress={() => setOpenChannels(!isOpenChannels)}
        style={styles.headerPressableStyle}
      >
        <Text style={styles.headingStyle}>{"Channels"}</Text>
        <Animated.View style={animatedChannelIconStyle}>
          <Ionicons name="chevron-down" size={22} color="black" />
        </Animated.View>
      </Pressable>
      <Animated.View style={animatedChannnellistStyle}>
        {channelMessageList.map((item: any, index: number) => {
          return (
            <Pressable
              key={item.name + index}
              style={[styles.itemContainerStyle, { paddingLeft: 5 }]}
              onPress={() => channelProgress.value === 1 && openChannel(item)}
            >
              {/* <Hash_Icon /> */}
              {item.name === "public channel" ? (
                <Image
                  source={require("../../../assets/icons/onetabIcon.png")}
                  style={{ height: 18, width: 20, marginLeft: -5 }}
                />
              ) : (
                <Image
                  source={require("../../../assets/icons/hash.png")}
                  style={styles.image}
                />
              )}

              {/* {item.status === channelStatus.active ? (
              <Octicons name="hash" size={20} color="#656971" />
            ) : (
              <Octicons name="lock" size={20} color="#656971" />
            )} */}
              <Text style={styles.textStyle}>{item.name}</Text>
            </Pressable>
          );
        })}
        <Pressable
          style={styles.addElementContainerStyle}
          onPress={() =>
            channelProgress.value === 1 &&
            navigation.navigate(RootRoutes.NewChannel)
          }
        >
          <Octicons
            name="plus"
            size={20}
            color="#171C26"
            style={{
              paddingHorizontal: 3.5,
              paddingVertical: 2.5,
            }}
          />
          <Text style={styles.textStyle}>Add Channnel</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};
