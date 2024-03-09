import { Text, View } from "react-native";
import { useState } from "react";
import { ChooseExerciseModal } from "../modal/ChooseExerciseModal";
import { IPhysicalExercise } from "../../entity/PhysicalExercise";
import { CButton } from "../ui/CButton";
import { CWrapper } from "../ui/CWrapper";
import { getPrettyDate } from "../../utility/prettyDate";
import { ITraining, ITrainingExecise } from "../../entity/Training";
import { ExerciseCardWithApprouches } from "../elements/ExerciseCardWithApprouches";
import { ApproachCreate } from "../elements/ApproachCreate";
import { IApproach } from "../../entity/Approach";
import { ExerciseCardExpanded } from "../elements/ExerciseCardExpanded";
import { COLORS } from "../../theme";

interface Props {
  saveTraining(training: ITraining): void;
}

export function TrainingPage(props: Props) {
  const [chooseExerciseIsOpen, toggleChooseExerciseIsOpen] = useState(false);
  const [exercises, setExercise] = useState<ITrainingExecise[]>([]);

  const date = new Date();
  const prettyDate = getPrettyDate(date);
  const name = `train_${prettyDate}`;

  function setExerciseProxy(item: IPhysicalExercise) {
    setExercise((prev) => [
      ...prev,
      {
        ...item,
        trainingExeciseId: new Date().getTime(),
        approuch: [],
      },
    ]);
    toggleChooseExerciseIsOpen(false);
  }

  const addApprouch = (id: number) => (approuch: IApproach) =>
    setExercise((prev) =>
      prev.map((ex) => {
        if (ex.trainingExeciseId !== id) return ex;

        return {
          ...ex,
          approuch: [...ex.approuch, approuch],
        };
      }),
    );

  const save = () =>
    props.saveTraining({
      date,
      name,
      exercises: exercises,
    });

  return (
    <>
      <>
        <Text>Дата: {prettyDate}</Text>
        <Text>Название тренировки: {name}</Text>

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
                id={ex.id}
                name={ex.name}
                photo={ex.photo}
                approuch={ex.approuch}
                trainingExeciseId={ex.trainingExeciseId}
              />
              <ApproachCreate onAdd={addApprouch(ex.trainingExeciseId)} />
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
          <CButton variant="success" onPress={save}>
            Сохранить
          </CButton>
        )}
      </>

      <ChooseExerciseModal
        visible={chooseExerciseIsOpen}
        onVisible={toggleChooseExerciseIsOpen}
        onSelect={setExerciseProxy}
      />
    </>
  );
}
