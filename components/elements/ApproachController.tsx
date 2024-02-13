import { TextInput, View } from "react-native";
import { IApproach } from "../../model/Approach";

interface Props {
  approaches: IApproach[];
  onAdd: (items: IApproach[]) => void;
}

export function ApproachController(props: Props) {
  return (
    <View>
      <View>
        <TextInput keyboardType="numeric"></TextInput>
        <TextInput></TextInput>
      </View>
    </View>
  );
}
