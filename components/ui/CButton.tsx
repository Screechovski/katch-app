import { StyleSheet, Text, ViewStyle } from "react-native";
import { CButtonBase, CButtonBaseType } from "./CButtonBase";
import { Colors } from "@/constants/Theme";

interface Props {
  children: string;
  onPress(): void;
  style?: ViewStyle;
  variant?: CButtonBaseType;
  disabled?: boolean;
}

export function CButton(props: Props) {
  const style = StyleSheet.create({
    wrap: {
      height: 50,
    },
    text: {
      fontSize: 16,
      color: props.variant !== "primary-outline"  ? Colors.light.i3 : Colors.primary.i90,
      textTransform: "uppercase",
      paddingHorizontal: 20,
    },
  });

  return (
    <CButtonBase
      variant={props.variant}
      style={[props.style, style.wrap]}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <Text style={style.text}>{props.children}</Text>
    </CButtonBase>
  );
}
