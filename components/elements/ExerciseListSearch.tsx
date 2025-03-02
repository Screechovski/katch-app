import { Dimensions, StyleSheet, Text, View } from "react-native";
import { ExerciseList } from "./ExerciseList";
import { IExercise, getSortedExercises } from "../../entity/IExercise";
import { getExercises } from "../../entity/IExercise";
import { useMemo, useState } from "react";
import { CInput } from "../ui/CInput";

const { width } = Dimensions.get("window");

interface Props {
  count: number;
  onSelect(item: IExercise): void;
}

const ExerciseListSearchStyle = StyleSheet.create({
  wrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    width: width - 60,
  },
  input: { marginBottom: 15 },
  emptyText: {
    width: "100%",
    textAlign: "center",
  },
});

export function ExerciseListSearch(props: Props) {
  const [searchValue, setSearchValue] = useState<string>("");
  const exercises = getSortedExercises();

  const filteredExercises = useMemo<IExercise[]>(
    () => {
      const searchValueLower = searchValue.toLowerCase();

      return exercises.filter((ex) => {
        const nameLower = ex.name.toLowerCase();

        return nameLower.includes(searchValueLower)
      })
    },
    [searchValue],
  );

  return (
    <View style={ExerciseListSearchStyle.wrap}>
      <CInput
        style={ExerciseListSearchStyle.input}
        value={searchValue}
        onInput={setSearchValue}
        placeholder="Поиск"
      />

      {filteredExercises.length > 0 && (
        <ExerciseList
          exercises={filteredExercises}
          count={3}
          onPress={props.onSelect}
        />
      )}

      {filteredExercises.length === 0 && (
        <Text style={ExerciseListSearchStyle.emptyText}>Пусто</Text>
      )}
    </View>
  );
}
