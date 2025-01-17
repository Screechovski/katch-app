import React, { ReactNode, useMemo } from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Colors } from "../../theme";
import { CLoader } from "./CLoader";

export type CButtonBaseType = "primary" | "success" | "error" | "warning";

interface Props {
  children: ReactNode;
  onPress(): void;
  style?: ViewStyle | (ViewStyle | undefined)[];
  variant?: CButtonBaseType;
  disabled?: boolean;
  loading?: boolean;
}

export function CButtonBase(props: Props) {

  const colors = useMemo(() => {
    switch (props.variant) {
      case "error":
        return [Colors.danger.i6, Colors.danger.i7];
      case "success":
        return [Colors.success.i7, Colors.success.i9];
      case "warning":
        return [Colors.warning.i8, Colors.warning.i9];
      default:
        return [Colors.primary.i70, Colors.primary.i90];
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
      {props.loading && <CLoader />}
      {!props.loading && props.children}
    </TouchableOpacity>
  );
}
