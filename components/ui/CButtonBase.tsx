import { ReactNode, useMemo } from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { COLORS } from "../../theme";

export type CButtonBaseType = "primary" | "success" | "error" | "warning";

interface Props {
  children: ReactNode;
  onPress(): void;
  style?: ViewStyle | (ViewStyle | undefined)[];
  variant?: CButtonBaseType;
  disabled?: boolean;
}

const createStyle = (bgColor: string) =>
  StyleSheet.create({
    wrap: {
      height: 40,
      backgroundColor: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },
  });

export function CButtonBase(props: Props) {
  const style = useMemo(() => {
    switch (props.variant) {
      case "error":
        return createStyle(COLORS.danger.i6);
      case "success":
        return createStyle(COLORS.success.i7);
      case "warning":
        return createStyle(COLORS.warning.i9);
      default:
        return createStyle(COLORS.primary.i90);
    }
  }, [props.variant]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[style.wrap, props.style].flat()}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      {props.children}
    </TouchableOpacity>
  );
}
