import { StyleSheet, Text, ViewStyle } from "react-native";
import { Colors } from "../../theme";
import { CButtonBase, CButtonBaseType } from "./CButtonBase";

interface Props {
  children: string;
  onPress(): void;
  style?: ViewStyle;
  variant?: CButtonBaseType;
  disabled?: boolean;
}

const style = StyleSheet.create({
  wrap: {
    height: 50
  },
  text: {
    fontSize: 16,
    color: Colors.light.i3,
    textTransform: "uppercase",
    paddingHorizontal: 20,
  },
});

export function CButton(props: Props) {
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
