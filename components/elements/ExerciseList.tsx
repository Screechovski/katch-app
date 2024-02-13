import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleProp,
  StyleSheet,
} from "react-native";
import { IExercise, exercises } from "../../model/PhysicalExercise";
import { ExerciseCard } from "./ExerciseCard";
import { useMemo } from "react";

const { width } = Dimensions.get("window");

interface Props {
  count?: number;
  style?: StyleProp<FlatList>;
  onPress?(item: IExercise): void;
}

export function ExerciseList(props: Props) {
  const style = useMemo(() => {
    if (props.style) {
      return props.style;
    }
    return {};
  }, [props.style]);

  const count = useMemo(() => {
    if ("count" in props && typeof props.count === "number") {
      return props.count;
    }
    return 3;
  }, [props.count]);

  function pressHandler(item: IExercise) {
    if ("onPress" in props && typeof props.onPress === "function") {
      props.onPress(item);
    }
  }

  return (
    <FlatList
      data={exercises}
      style={style}
      renderItem={({ item }) => (
        <ExerciseCard
          onPress={() => pressHandler(item)}
          style={{ width: (width - 60) / count }}
          {...item}
        />
      )}
      numColumns={count}
      key={count}
    />
  );
}
