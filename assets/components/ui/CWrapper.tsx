import { ReactNode, useMemo } from "react";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";

interface Props {
  padding?: "s" | "m" | "l";
  children: ReactNode;
  style?: ViewStyle;
}

export function CWrapper(props: Props) {
  const getPadding = useMemo(() => {
    if (props.padding === "s") {
      return 5;
    }
    if (props.padding === "l") {
      return 30;
    }
    return 15;
  }, [props.padding]);

  const style = useMemo(() => StyleSheet.create({
    wrap: {
      paddingHorizontal: getPadding,
      marginVertical: getPadding,
      flex: 1,
    }
  }), [])

  return (
    <ScrollView
      style={[style.wrap, props.style]}
    >
      {props.children}
    </ScrollView>
  );
}

