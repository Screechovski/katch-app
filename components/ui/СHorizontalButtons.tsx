import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Theme";
import { CButtonBase } from "@/components/ui/CButtonBase";

interface Props {
  selected: number;
  options: number[];
  onSelect(index: number): void;
}

export const HorizontalButtons = (props: Props) => {
  const handleSelect = (value: number) => {
    props.onSelect(value);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.track}>
        {props.options.map((option, key) => (
          <CButtonBase
            key={key}
            variant={props.selected === option ? "primary" : "success"}
            style={styles.wrap}
            onPress={() => handleSelect(option)}
            disabled={false}
          >
            <Text style={styles.text}>{option.toString()}</Text>
          </CButtonBase>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  track: {
    gap: 3,
    flexDirection: "row",
  },
  text: {
    fontSize: 16,
    color: Colors.light.i3,
    textTransform: "uppercase",
  },
  wrap: {
    height: 36,
    width: 36,
  },
});
