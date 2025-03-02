import { Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ChooseExerciseModal } from "../modal/ChooseExerciseModal";
import { IApproach } from "../../entity/IApproach";
import { IExercise } from "../../entity/IExercise";
import { IExerciseApproach } from "../../entity/IExerciseApproach";
import { ITraining } from "../../entity/ITraining";
import { CButton } from "../ui/CButton";
import { CWrapper } from "../ui/CWrapper";
import { CInput } from "../ui/CInput";
import { getPrettyDate } from "../../utility/prettyDate";
import { dateMask } from "../../utility/dateMask";
import { getDateFromPrettyDate } from "../../utility/getDateFromPrettyDate";
import { ApproachCreate } from "../elements/ApproachCreate";
import { ExerciseCardExpanded } from "../elements/ExerciseCardExpanded";
import { Colors } from "../../theme";
import { Database } from "../../database/database";
import { Storage } from "../../storage/storage";

interface Props {
  callback: () => void;
}

export function TrainingPage(props: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [chooseExerciseIsOpen, toggleChooseExerciseIsOpen] = useState(false);
  const [exercises, setExercise] = useState<IExerciseApproach[]>([]);
  const [inputDate, setInputDate] = useState(getPrettyDate(new Date()));
  const [name, setName] = useState(`train_${inputDate}`);

  async function onMounted() {
    try {
      const train = Storage.read();
      if (train) {
        setName(train.name);
        setExercise(train.exercises);
      }
    } catch (error) {}
  }

  useEffect(() => {
    onMounted();
  }, []);

  const dateValue = useMemo(() => {
    try {
      if (![16, 10].includes(inputDate.length)) {
        return undefined;
      }

      const date = new Date(inputDate);
      date.toISOString();

      return date;
    } catch (error) {
      return undefined;
    }
  }, [inputDate]);

  const isDisabled = useMemo(() => {
    if (exercises.length === 0) {
      return true;
    }

    if (exercises.some((ex) => ex.approaches.length === 0)) {
      return true;
    }

    if (getDateFromPrettyDate(inputDate) === null) {
      return true;
    }

    return false;
  }, [exercises, dateValue]);

  const currentTrain = useMemo<ITraining>(() => {
    return {
      date: getDateFromPrettyDate(inputDate) ?? new Date(),
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
        <CInput
          style={{ marginTop: 20 }}
          placeholder={name}
          value={inputDate}
          onInput={(v) => setInputDate(dateMask(v))}
          label="Дата"
        />

        <CInput
          placeholder={name}
          value={name}
          onInput={setName}
          label="Название тренировки"
        />

        <CWrapper style={{ marginBottom: 10, marginTop: 15 }} padding="s">
          {exercises.map((ex, key) => (
            <View
              style={{
                marginBottom: 7,
                backgroundColor: Colors.primary.i5,
                borderRadius: 10,
                padding: 10,
              }}
              key={key}
            >
              <ExerciseCardExpanded
                count={ex.exercise.count}
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
          variant="warning"
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
