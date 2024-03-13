import React, { useEffect, useRef } from "react";
import { useWindowDimensions, ImageBackground, Animated } from "react-native";

export const AnimatedImageBackGround = () => {
    const opacity = useRef(new Animated.Value(1)).current;
    const { width, height } = useWindowDimensions();
    useEffect(() => {
        const opacityAnimation = Animated.sequence([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]);
        Animated.parallel([opacityAnimation]).start();
        return () => {
            opacityAnimation.stop();
        };
    }, []);

    return (
        <Animated.View
            style={{
                flex: 1,
                backgroundColor: "transparent",
                transform: [{ scale: opacity }],
                opacity: opacity,
            }}
        >
            <ImageBackground
                source={require("../../src/assets/images/authBackground.png")}
                imageStyle={{
                    resizeMode: "contain",
                    height: height,
                    zIndex: -2,
                    top: -height / 2 + 100,
                    left: -width + 120,
                }}
            />
        </Animated.View>
    );
};
