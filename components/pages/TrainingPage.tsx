import { Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { ChooseExerciseModal } from "../modal/ChooseExerciseModal";
import { CButton } from "../ui/CButton";
import { CWrapper } from "../ui/CWrapper";
import { getPrettyDate } from "../../utility/prettyDate";
import { ApproachCreate } from "../elements/ApproachCreate";
import { IApproach } from "../../entity/IApproach";
import { ExerciseCardExpanded } from "../elements/ExerciseCardExpanded";
import { COLORS } from "../../theme";
import { CInput } from "../ui/CInput";
import { IExercise } from "../../entity/IExercise";
import { IExerciseApproach } from "../../entity/IExerciseApproach";
import { Database } from "../../database/database";
import { Storage } from "../../storage/storage";
import { ITraining } from "../../entity/ITraining";

interface Props {
  callback: () => void;
}

export function TrainingPage(props: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [chooseExerciseIsOpen, toggleChooseExerciseIsOpen] = useState(false);
  const [exercises, setExercise] = useState<IExerciseApproach[]>([]);
  const date = new Date();
  const prettyDate = getPrettyDate(date);
  const [name, setName] = useState(`train_${prettyDate}`);

  async function onMounted(){
    try {
      const train = await Storage.read();
      setName(train.name);
      setExercise(train.exercises);
    } catch (error) {

    }
  }

  useEffect(() => {
    onMounted()
  }, []);

  const isDisabled = useMemo(() => {
    if (exercises.length === 0) {
      return true;
    }

    if (exercises.some((ex) => ex.approaches.length === 0)) {
      return true;
    }

    return false;
  }, [exercises]);

  const currentTrain = useMemo<ITraining>(() => {
    const date = new Date();

    return {
      date,
      name,
      exercises,
    };
  }, [name, exercises]);

  useEffect(() => {
    if (exercises.length === 0) {
      return;
    }
    Storage.save(currentTrain);
  }, [exercises, name]);

  function addExercise(exercise: IExercise) {
    setExercise((prev) => [
      ...prev,
      {
        id: new Date().getTime(),
        exercise,
        approaches: [],
      },
    ]);
    toggleChooseExerciseIsOpen(false);
  }

  const addApprouch = (id: number) => (approuch: IApproach) => {
    setExercise((prev) =>
      prev.map((ex) => {
        if (ex.id !== id) return ex;

        return {
          ...ex,
          approaches: [...ex.approaches, approuch],
        };
      }),
    );
  };

  function deleteExercise(id: number) {
    setExercise((prev) => prev.filter((ex) => ex.id !== id));
  }

  function deleteApprouch(exId: number, apId: number) {
    setExercise((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) {
          return ex;
        }

        return {
          ...ex,
          approaches: ex.approaches.filter((ap) => ap.id !== apId),
        };
      }),
    );
  }

  async function save() {
    setIsLoading(true);

    await Database.insertTraining(currentTrain);
    Storage.clear();
    props.callback();

    setIsLoading(false);
  }

  if (isLoading) {
    return <Text>Loading</Text>;
  }

  return (
    <>
      <>
        <Text style={{ marginTop: 20 }}>Дата: {prettyDate}</Text>

        <CInput
          placeholder={name}
          value={name}
          onInput={setName}
          label="Название тренировки"
        />

        <CWrapper style={{ marginBottom: 10 }} padding="s">
          {exercises.map((ex, key) => (
            <View
              style={{
                marginBottom: 7,
                backgroundColor: COLORS.primary.i5,
                borderRadius: 10,
                padding: 10,
              }}
              key={key}
            >
              <ExerciseCardExpanded
                id={ex.exercise.id}
                name={ex.exercise.name}
                photo={ex.exercise.photo}
                approuches={ex.approaches}
                onDeleteExercise={() => deleteExercise(ex.id)}
                onDeleteApprouch={(id: number) => deleteApprouch(ex.id, id)}
              />
              <ApproachCreate onAdd={addApprouch(ex.id)} />
            </View>
          ))}
        </CWrapper>

        <CButton
          style={{ marginBottom: 10 }}
          onPress={() => toggleChooseExerciseIsOpen(true)}
        >
          Добавить упражнение
        </CButton>

        {exercises.length > 0 && (
          <CButton disabled={isDisabled} variant="success" onPress={save}>
            Сохранить
          </CButton>
        )}
      </>

      <ChooseExerciseModal
        visible={chooseExerciseIsOpen}
        onVisible={toggleChooseExerciseIsOpen}
        onSelect={addExercise}
      />
    </>
  );
}
