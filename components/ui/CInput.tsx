import { StyleSheet, Text, TextInput, TextStyle, View } from "react-native";
import { COLORS } from "../../theme";
import { useMemo } from "react";

interface Props {
  placeholder: string;
  value: string;
  onInput(value: string): void;
  style?: TextStyle;
  type?: "text" | "number";
  label?: string;
  disabled?: boolean;
}

export function CInput(props: Props) {
  const isDisabled = useMemo(() => !!props.disabled, [props.disabled])
  const style = useMemo(() => StyleSheet.create({
    wrap: {},
    label: {
      fontSize: 16,
      color: COLORS.dark.i4,
      height: 16 * 1.5,
    },
    input: {
      paddingHorizontal: 15,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: isDisabled ? COLORS.dark.i3 : COLORS.primary.i90,
      backgroundColor: isDisabled ? COLORS.light.i4 : COLORS.light.i2,
      color: isDisabled ? COLORS.dark.i4 : COLORS.primary.i80,
      fontSize: 16,
      height: 50,
      display: "flex",
    },
  }), [props]);

  const keyboardType = useMemo(() => {
    return props.type === "number" ? "numeric" : "default";
  }, [props.type]);

  return (
    <View style={[style.wrap, props.style]}>
      {props.label !== undefined && (
        <Text style={style.label}>{props.label}</Text>
      )}
      <TextInput
        keyboardType={keyboardType}
        style={style.input}
        value={props.value}
        editable={!props.disabled}
        placeholder={props.placeholder}
        selectTextOnFocus={!props.disabled}
        onChangeText={props.onInput}
      />
    </View>
  );
}
