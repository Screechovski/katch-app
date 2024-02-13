import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { IExercise } from "../../model/PhysicalExercise";
import { color } from "../../theme";
import { useMemo } from "react";

type ExerciseCardProps = IExercise & {
  style?: StyleProp<ViewStyle>;
  onPress?: (e: number) => void;
};

const ExerciseCardStyle = StyleSheet.create({
  wrapper: {
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    color: color.dark.i7,
    height: 14 * 1.2 * 2,
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    width: "100%",
  },
});

export function ExerciseCard(props: ExerciseCardProps) {
  const wrapperStyle = useMemo(() => {
    if (props.style && typeof props.style === "object") {
      return {
        ...props.style,
        ...ExerciseCardStyle.wrapper,
      };
    }

    return ExerciseCardStyle.wrapper;
  }, [props.style]);

  function pressHandler() {
    if ("onPress" in props && typeof props.onPress === "function") {
      props.onPress(props.id);
    }
  }

  return (
    <Pressable style={wrapperStyle} onPress={pressHandler}>
      <View style={ExerciseCardStyle.inner}>
        <Image source={props.photo} style={ExerciseCardStyle.image} />
        <Text style={ExerciseCardStyle.text}>{props.name}</Text>
      </View>
    </Pressable>
  );
}
