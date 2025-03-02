import { Dimensions, FlatList, StyleProp } from "react-native";
import {
  IExercise, getSortedExercises,
} from "../../entity/IExercise";
import { useMemo } from "react";
import { ExerciseCardVertical } from "./ExerciseCardVertical";

const { width } = Dimensions.get("window");

interface Props {
  count?: number;
  exercises?: IExercise[];
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

  const exercises = useMemo(() => {
    if (props.exercises) {
      return props.exercises;
    }
    return getSortedExercises();
  }, [props.exercises]);

  return (
    <FlatList
      data={exercises}
      style={style}
      renderItem={({ item }) => (
        <ExerciseCardVertical
          onPress={() => pressHandler(item)}
          style={{ width: (width - 60) / count }}
          photo={item.photo}
          name={item.name}
          id={item.id}
          count={item.count}
        />
      )}
      numColumns={count}
      key={count}
    />
  );
}
