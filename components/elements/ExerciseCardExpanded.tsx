import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "../../theme";
import { useMemo } from "react";
import { CIconButton } from "../ui/CIconButton";
import { IExercise } from "../../entity/IExercise";
import { IApproach } from "../../entity/IApproach";

type ExerciseCardProps = IExercise & {
  approuches: IApproach[];
  style?: StyleProp<ViewStyle>;
  onPress?: (e: number) => void;
  children?: JSX.Element | JSX.Element[];
  onDeleteExercise: () => void;
  onDeleteApprouch: (id: number) => void;
};

const style = StyleSheet.create({
  wrapper: {},
  inner: {
    borderRadius: 10,
    gap: 5,
  },
  image: {
    width: 90,
    height: 81,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  textLine: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 3,
  },
  text: {
    flex: 1,
    fontSize: 18,
    textAlign: "left",
    color: Colors.dark.i7,
    height: "auto",
  },
  approachesTextLine: {
    flexDirection: "row",
    gap: 4,
  },
  approachesList: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5,
  },
  approaches: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  approachesText: {
    fontSize: 16,
    width: 64,
    textAlign: "right",
  },
});

export function ExerciseCardExpanded(props: ExerciseCardProps) {
  const wrapperStyle = useMemo(() => {
    if (props.style && typeof props.style === "object") {
      return {
        ...props.style,
        ...style.wrapper,
      };
    }

    return style.wrapper;
  }, [props.style]);

  function pressHandler() {
    if ("onPress" in props && typeof props.onPress === "function") {
      props.onPress(props.id);
    }
  }

  return (
    <Pressable style={wrapperStyle} onPress={pressHandler}>
      <View style={style.inner}>
        <View style={style.textLine}>
          <Text style={style.text}>{props.name}</Text>

          <CIconButton
            onPress={props.onDeleteExercise}
            size="m"
            variant="error"
            name="close"
          />
        </View>

        <View style={style.content}>
          <Image source={props.photo} style={style.image} />

          <View style={style.approachesList}>
            {props.approuches.map((ap, key) => (
              <View style={style.approaches} key={key}>
                <View style={style.approachesTextLine}>
                  <Text style={style.approachesText}>
                    {ap.approaches} подх.
                  </Text>

                  <Text style={style.approachesText}>
                    {ap.repetitions} повт.
                  </Text>
                  <Text style={style.approachesText}>{ap.weight} вес</Text>
                </View>

                <CIconButton
                  name="close"
                  iconColor={Colors.light.i2}
                  variant="error"
                  onPress={() => props.onDeleteApprouch(ap.id)}
                  size="s"
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
