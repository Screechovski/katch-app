import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, View } from "react-native";
import { useState } from "react";
import { IExercise } from "./model/PhysicalExercise";
import { ChooseExerciseModal } from "./components/modal/ChooseExerciseModal";
import { ExerciseCard } from "./components/elements/ExerciseCard";
import { ApproachController } from "./components/elements/ApproachController";

export default function App() {
  const [chooseExerciseIsOpen, toggleChooseExerciseIsOpen] = useState(false);
  const [exercise, setExercise] = useState<IExercise | null>(null);

  function setExerciseProxy(item: IExercise) {
    setExercise(item);
    toggleChooseExerciseIsOpen(false);
  }

  return (
    <>
      <StatusBar style="dark" />
      <View>
        <View>
          {/* <Datepicker date={trainingDate} onSelect={setTrainingDate} /> */}
          {exercise === null && (
            <Button
              title="Выбрать упражнение"
              onPress={() => toggleChooseExerciseIsOpen(true)}
            />
          )}
          {exercise !== null && (
            <>
              <ExerciseCard {...exercise} />
              <ApproachController approaches={[]} onAdd={() => {}} />
            </>
          )}
        </View>
      </View>

      <ChooseExerciseModal
        visible={chooseExerciseIsOpen}
        onVisible={toggleChooseExerciseIsOpen}
        onSelect={setExerciseProxy}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
  },
});
