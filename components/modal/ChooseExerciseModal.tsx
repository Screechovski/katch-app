import { ExerciseList } from "../elements/ExerciseList";
import { IExercise } from "../../model/PhysicalExercise";
import { CModal } from "../ui/CModal";

interface Props {
  visible: boolean;
  onSelect(item: IExercise): void;
  onVisible(flag: boolean): void;
}

export function ChooseExerciseModal(props: Props) {
  return (
    <CModal visible={props.visible} onHide={() => props.onVisible(false)}>
      <ExerciseList count={3} onPress={props.onSelect} />
    </CModal>
  );
}
