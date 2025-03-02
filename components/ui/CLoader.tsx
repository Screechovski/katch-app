import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useEffect, useMemo, useRef } from "react";
import {Colors} from "@/constants/Theme";

interface Props {
  color?: string;
  size?: number;
}

const DEFAULT_SIZE = 40;

export function CLoader(props: Props) {
  const size = useMemo(() => props.size ?? DEFAULT_SIZE, [props.size]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    });
  }, [fadeAnim]);

  // const spin = spinValue.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["0deg", "360deg"],
  // });

  const style = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          height: size,
          width: size,
          opacity: fadeAnim
        },
        icon: {
          height: size,
          width: size,
        },
      }),
    [size, fadeAnim],
  );

  return (
    <View style={style.wrap}>
      <Svg
        fill={props.color ?? Colors.primary.i50}
        style={style.icon}
        width={size}
        height={size}
        viewBox="0 0 32.707 32.707"
      >
        <Path d="M21.477 4.511a4.511 4.511 0 0 1-4.508 4.508 4.51 4.51 0 0 1 0-9.019 4.51 4.51 0 0 1 4.508 4.511zM16.972 27.68a2.514 2.514 0 0 0-2.517 2.508 2.51 2.51 0 0 0 2.505 2.52 2.509 2.509 0 0 0 2.519-2.506 2.512 2.512 0 0 0-2.507-2.522zm14.479-10.328a1.64 1.64 0 0 0-1.641-1.641 1.64 1.64 0 0 0-1.644 1.641 1.644 1.644 0 0 0 3.285 0zm-24.456 0a2.87 2.87 0 1 0-5.739-.001 2.87 2.87 0 0 0 5.739.001zm19.967-9.998a1.289 1.289 0 0 0-1.825 0 1.297 1.297 0 0 0 0 1.832c.506.506 1.321.506 1.825 0s.504-1.326 0-1.832zm-16.989 17a2.96 2.96 0 0 0-4.17-.002 2.937 2.937 0 0 0 0 4.16 2.95 2.95 0 0 0 4.168 0 2.932 2.932 0 0 0 .002-4.158zm17.278 3.277a1.699 1.699 0 0 0-.002-2.396 1.684 1.684 0 0 0-2.385.004 1.7 1.7 0 0 0 0 2.395 1.685 1.685 0 0 0 2.387-.003zM10.047 10.427a3.053 3.053 0 0 0 0-4.311 3.044 3.044 0 0 0-4.305 0c-1.188 1.189-1.188 3.119.001 4.311s3.115 1.191 4.304 0z" />
      </Svg>
    </View>
  );
}
