import { StyleSheet, ViewStyle } from "react-native";
import { CButtonBase, CButtonBaseType } from "./CButtonBase";
import { AntDesign } from "@expo/vector-icons";
import { useMemo } from "react";
import {Colors} from "@/constants/Theme";

interface Props {
  onPress(): void;
  disabled?: boolean;
  style?: ViewStyle;
  name: GLYPHS;
  variant?: CButtonBaseType;
  size?: 's' | 'm' | 'l';
  iconColor?: string;
}

export function CIconButton(props: Props) {
  const size = useMemo(() => {
    if (props.size === 's') {
      return 25
    }
    if (props.size === 'm') {
      return 30
    }
    return 40;
  }, [props.size]);
  const borderRadius = useMemo(() => {
    if (props.size === 'l' || props.size === undefined) {
      return 10
    }
    return 7;
  }, [props.size])
  const style = useMemo(() => StyleSheet.create({
    wrap: {
      width: size,
      height: size,
      padding: 0,
      borderRadius,
    },
  }), [size]);
  const iconSize = useMemo(() => size * 0.6, [size]);
  const iconColor = useMemo(() => props.iconColor ?? Colors.light.i2, [props.iconColor])

  return (
    <CButtonBase
      variant={props.variant}
      style={[props.style, style.wrap]}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <AntDesign name={props.name} size={iconSize} color={iconColor} />
    </CButtonBase>
  );
}
