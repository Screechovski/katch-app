import { StyleSheet, Text, View } from "react-native";
import { ExerciseCardHistory } from "./ExerciseCardHistory";
import { ITrainingExecise } from "../../entity/Training";
import { getPrettyDate } from "../../utility/prettyDate";
import { COLORS } from "../../theme";

interface Props {
  name: string;
  date: Date;
  exercises: ITrainingExecise[];
}

const style = StyleSheet.create({
  wrap: {
    padding: 10,
    backgroundColor: COLORS.light.i5,
    borderRadius: 10,
  },
  headlint: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
  },
  date: {
    fontSize: 12,
    color: COLORS.dark.i5,
  },
  list: {},
});

export function TrainingCard(props: Props) {
  return (
    <View style={style.wrap}>
      <View style={style.headlint}>
        <Text style={style.name}>{props.name}</Text>
        <Text style={style.date}>{getPrettyDate(props.date)}</Text>
      </View>
      <View style={style.list}>
        {props.exercises.map((ex, i) => (
          <ExerciseCardHistory
            key={i}
            approuch={ex.approuch}
            id={ex.id}
            name={ex.name}
            photo={ex.photo}
            trainingExeciseId={ex.trainingExeciseId}
          />
        ))}
      </View>
    </View>
  );
}
