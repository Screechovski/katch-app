import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { COLORS } from "../../theme";
import { CButtonBase, CButtonBaseType } from "./CButtonBase";

interface Props {
  children: string;
  onPress(): void;
  style?: ViewStyle;
  variant?: CButtonBaseType;
}

const style = StyleSheet.create({
  text: {
    fontSize: 16,
    color: COLORS.light.i3,
    textTransform: "uppercase",
    paddingHorizontal: 20,
  },
});

export function CButton(props: Props) {
  return (
    <CButtonBase
      variant={props.variant}
      style={props.style}
      onPress={props.onPress}
    >
      <Text style={style.text}>{props.children}</Text>
    </CButtonBase>
  );
}
