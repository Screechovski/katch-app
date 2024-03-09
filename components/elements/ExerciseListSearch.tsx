import { StyleSheet, TextInput, View } from "react-native";
import { ExerciseList } from "./ExerciseList";
import { IPhysicalExercise } from "../../entity/PhysicalExercise";
import { exercises } from "../../entity/PhysicalExercise";
import { useMemo, useState } from "react";
import { CInput } from "../ui/CInput";

interface Props {
  count: number;
  onSelect(item: IPhysicalExercise): void;
}

const ExerciseListSearchStyle = StyleSheet.create({
  wrap: { flex: 1, display: "flex", flexDirection: "column" },
  input: { marginBottom: 15 },
});

export function ExerciseListSearch(props: Props) {
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredExercises = useMemo<IPhysicalExercise[]>(() => {
    return exercises.filter((ex) => ex.name.includes(searchValue));
  }, []);

  return (
    <View style={ExerciseListSearchStyle.wrap}>
      <CInput
        style={ExerciseListSearchStyle.input}
        value={searchValue}
        onInput={setSearchValue}
        placeholder="Поиск"
      />

      <ExerciseList
        exercises={filteredExercises}
        count={3}
        onPress={props.onSelect}
      />
    </View>
  );
}
