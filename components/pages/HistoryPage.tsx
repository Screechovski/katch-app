import { StyleSheet, Text, View } from "react-native";
import { ITraining } from "../../entity/Training";
import { getPrettyDate } from "../../utility/prettyDate";
import { useMemo } from "react";
import { ExerciseCardExpanded } from "../elements/ExerciseCardExpanded";
import { COLORS } from "../../theme";

interface Props {
  trains: ITraining[];
}

const style = StyleSheet.create({
  list: {
    flexDirection: "column",
    gap: 10
  },
  train: {
    padding: 5,
    backgroundColor: COLORS.light.i5,
    borderRadius: 10
  }
})

export function HistoryPage(props: Props) {
  const hasTrainings = useMemo(() => props.trains.length > 0, [props.trains]);

  return (
    <>
      <View style={style.list}>
        {hasTrainings &&
          props.trains.map((tr) => (
            <View style={style.train}>
              <Text>Дата: {getPrettyDate(tr.date)}</Text>
              <Text>Название: {tr.name}</Text>
              {tr.exercises.map((ex) => (
                <ExerciseCardExpanded
                  saved
                  approuch={ex.approuch}
                  id={ex.id}
                  name={ex.name}
                  photo={ex.photo}
                  onPress={() => {}}
                  trainingExeciseId={ex.trainingExeciseId}
                />
              ))}
            </View>
          ))}
      </View>
      {!hasTrainings && <Text>Нет тренировок</Text>}
    </>
  );
}
