import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
export const BinkingMic = (props) => {
  const { recordingStart, setRecordingStart, pauseState, recording } = props;
  const openProgress = useSharedValue(0);
  const interval = React.useRef<ReturnType<typeof setInterval>>();
  React.useEffect(() => {
    if (recordingStart) {
      timeInterval();
    } else {
      clearInterval(interval.current);
      interval.current = undefined;
      openProgress.value = pauseState ? 1 : 0;
    }
  }, [recordingStart]);
  React.useEffect(() => {
    if (recording === undefined) {
      openProgress.value = 0;
    }
  }, [pauseState]);
  const timeInterval = () => {
    interval.current = setInterval(() => {
      openProgress.value = withTiming(
        parseInt(openProgress.value.toFixed(0)) === 0 ? 1 : 0,
        {
          duration: 400,
        }
      );
      return;
    }, 400);
  };
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      opacity: openProgress.value,
    };
  });
  return (
    <Animated.View style={animatedIconStyle}>
      <Ionicons name="mic" size={24} color="red" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({});
