import { Pressable, Text, View } from "react-native";
import React from "react";
import { styles } from "../styles";

interface AppListPropType {
  appData: any;
}
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Jira, Trello } from "../../../assets";
import { Ionicons, Octicons } from "@expo/vector-icons";
enum status {
  active = "active",
  inActive = "inActive",
}
export const AppList = (props: AppListPropType) => {
  const { appData } = props;
  const [isOpenApp, setIsOpenApp] = React.useState(true);
  const appProgress = useSharedValue(1);
  React.useEffect(() => {
    appProgress.value = withTiming(isOpenApp ? 1 : 0, { duration: 200 });
  }, [isOpenApp]);
  const animatedAppIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${appProgress.value * -180}deg` }],
      marginRight: 8,
    };
  });
  const animatedApplistStyle = useAnimatedStyle(() => {
    return {
      opacity: appProgress.value,
      height: 39 * appProgress.value * (appData.length + 1),
      paddingLeft: 12,
    };
  });
  return (
    <View style={styles.contentViewStyle}>
      <Pressable
        onPress={() => setIsOpenApp(!isOpenApp)}
        style={styles.headerPressableStyle}
      >
        <Text style={styles.headingStyle}>{"Recent apps"}</Text>

        <Animated.View style={animatedAppIconStyle}>
          <Ionicons name="chevron-down" size={24} color="black" />
        </Animated.View>
      </Pressable>
      <Animated.View style={animatedApplistStyle}>
        {appData.map((item: any, index: any) => {
          return (
            <View key={item.name + index} style={styles.itemContainerStyle}>
              {item.name === "Jira" ? <Jira /> : <Trello />}
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
              <Text style={styles.textStyle}>{item.name}</Text>
            </View>
          );
        })}
        <Pressable style={styles.addElementContainerStyle}>
          <Octicons
            name="plus"
            size={20}
            color="#171C26"
            style={{
              paddingHorizontal: 5,
              paddingVertical: 2.5,
            }}
          />
          <Text style={styles.textStyle}>Add app</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};
