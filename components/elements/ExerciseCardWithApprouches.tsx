import { Text } from "react-native";
import { ITrainingExecise } from "../../entity/Training";
import { ExerciseCard } from "./ExerciseCard";

export function ExerciseCardWithApprouches(props: Omit<ITrainingExecise, 'trainingExeciseId'>) {
  return (
    <ExerciseCard
      id={props.id}
      name={props.name}
      photo={props.photo}
      horizontal={true}
    >
      {props.approuch.map((ap) => (
        <Text key={ap.id}>
          {ap.approaches}/{ap.repetitions}/{ap.weight}
        </Text>
      ))}
    </ExerciseCard>
  );
}
