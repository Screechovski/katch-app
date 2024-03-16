import { ReactNode, useMemo, useState } from "react";
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

const createStyle = (isActive: boolean, bgColor: string, borderColor: string) =>
  StyleSheet.create({
    wrap: {
      height: 40,
      backgroundColor: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      borderBottomWidth: isActive ? 1 : 3,
      borderRightWidth: isActive ? 1 : 3,
      borderTopColor: bgColor,
      borderLeftColor: bgColor,
      borderBottomColor: borderColor,
      borderRightColor: borderColor,
    },
  });

export function CButtonBase(props: Props) {
  const [isActive, setIsActive] = useState(false);

  const style = useMemo(() => {
    switch (props.variant) {
      case "error":
        return createStyle(isActive, COLORS.danger.i6, COLORS.danger.i7);
      case "success":
        return createStyle(isActive, COLORS.success.i7, COLORS.success.i9);
      case "warning":
        return createStyle(isActive, COLORS.warning.i8, COLORS.warning.i9);
      default:
        return createStyle(isActive, COLORS.primary.i70, COLORS.primary.i90);
    }
  }, [props.variant, isActive]);

  function pressHandler(){
    if (props.disabled) return;

    setIsActive(true);
    props.onPress();
    setTimeout(() => setIsActive(false), 300)
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[style.wrap, props.style].flat()}
      onPress={pressHandler}
      disabled={props.disabled}
    >
      {props.children}
    </TouchableOpacity>
  );
}
