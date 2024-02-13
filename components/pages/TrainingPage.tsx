import { Button, View } from "react-native";
import { useState } from "react";
import { ChooseExerciseModal } from "../modal/ChooseExerciseModal";
import { IExercise } from "../../model/PhysicalExercise";
import { ExerciseCard } from "../elements/ExerciseCard";

export function TrainingPage() {
  // const [trainingDate, setTrainingDate] = useState(new Date());
  const [chooseExerciseIsOpen, toggleChooseExerciseIsOpen] = useState(false);
  const [exercise, setExercise] = useState<IExercise | null>(null);

  function setExerciseProxy(item: IExercise) {
    setExercise(item);
    toggleChooseExerciseIsOpen(false);
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-end",
          borderStyle: "solid",
          borderWidth: 1,
          padding: 20,
        }}
      >
        {exercise === null && (
          <Button
            title="Выбрать упражнение"
            onPress={() => toggleChooseExerciseIsOpen(true)}
          />
        )}
        {exercise !== null && <ExerciseCard {...exercise} />}
      </View>

      <ChooseExerciseModal
        visible={chooseExerciseIsOpen}
        onVisible={toggleChooseExerciseIsOpen}
        onSelect={setExerciseProxy}
      />
    </>
  );
}
