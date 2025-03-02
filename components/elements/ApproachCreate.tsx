import { StyleSheet, View } from "react-native";
import { IApproach } from "../../entity/IApproach";
import { CInput } from "../ui/CInput";
import { CIconButton } from "../ui/CIconButton";
import { useState } from "react";

interface Props {
  onAdd: (items: IApproach) => void;
}

const style = StyleSheet.create({
  wrap: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 15,
    height: 60,
  },
});

export function ApproachCreate(props: Props) {
  const [approaches, setApproaches] = useState("4");
  const [repetitions, setRepetitions] = useState("8");
  const [weight, setWeight] = useState("40");

  function addHandler() {
    props.onAdd({
      id: new Date().getTime(),
      weight: +weight,
      approaches: +approaches,
      repetitions: +repetitions,
    });
  }

  return (
    <View style={style.wrap}>
      <CInput
        style={{ flex: 1 }}
        value={approaches}
        onInput={setApproaches}
        placeholder="Кол-во"
        label="Подходы"
        type="number"
      />
      <CInput
        style={{ flex: 1.2 }}
        value={repetitions}
        onInput={setRepetitions}
        placeholder="4"
        label="Повторения"
        type="number"
      />
      <CInput
        style={{ flex: 1 }}
        value={weight}
        onInput={setWeight}
        placeholder="4"
        label="Вес"
        type="number"
      />

      <CIconButton name="plus" onPress={addHandler} />
    </View>
  );
}
