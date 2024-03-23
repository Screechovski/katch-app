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

export function CButtonBase(props: Props) {

  const colors = useMemo(() => {
    switch (props.variant) {
      case "error":
        return [COLORS.danger.i6, COLORS.danger.i7];
      case "success":
        return [COLORS.success.i7, COLORS.success.i9];
      case "warning":
        return [COLORS.warning.i8, COLORS.warning.i9];
      default:
        return [COLORS.primary.i70, COLORS.primary.i90];
    }
  }, [props.variant]);

  const style = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          height: 40,
          backgroundColor: colors[0],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          borderWidth: 3,
          borderColor: colors[1],
          opacity: props.disabled ? 0.5 : 1,
        },
      }),
    [props.variant, colors, props.disabled],
  );

  function pressHandler() {
    if (props.disabled) {
      return;
    }

    props.onPress();
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
