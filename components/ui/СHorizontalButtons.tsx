import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import {CButton} from "@/components/ui/CButton";

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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {props.options.map((option, key) => (
          <CButton key={key} variant={props.selected === option ? 'primary' : 'success'} onPress={() => handleSelect(option)}>
            {option.toString()}
          </CButton>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: "row",
  },
});