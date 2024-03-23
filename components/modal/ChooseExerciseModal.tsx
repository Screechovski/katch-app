import { IExercise } from "../../entity/IExercise";
import { CModal } from "../ui/CModal";
import { ExerciseListSearch } from "../elements/ExerciseListSearch";
import { StyleSheet } from "react-native";

interface Props {
  visible: boolean;
  onSelect(item: IExercise): void;
  onVisible(flag: boolean): void;
}

const style = StyleSheet.create({
  wrap: {
    flex: 1,
  },
});

export function ChooseExerciseModal(props: Props) {
  return (
    <CModal
      style={style.wrap}
      visible={props.visible}
      onHide={() => props.onVisible(false)}
    >
      <ExerciseListSearch count={3} onSelect={props.onSelect} />
    </CModal>
  );
}
