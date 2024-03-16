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
import { CInput } from "../ui/CInput";

interface Props {
  saveTraining(training: ITraining): void;
}

export function TrainingPage(props: Props) {
  const [chooseExerciseIsOpen, toggleChooseExerciseIsOpen] = useState(false);
  const [exercises, setExercise] = useState<ITrainingExecise[]>([]);

  const date = new Date();
  const prettyDate = getPrettyDate(date);
  const [name, setName] = useState(`train_${prettyDate}`);

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

  function save() {
    const date = new Date();

    props.saveTraining({
      date: date,
      name,
      exercises,
    });
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
