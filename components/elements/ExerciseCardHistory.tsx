import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "../../theme";
import { useMemo } from "react";
import { IExerciseApproach } from "../../entity/IExerciseApproach";

type Props = IExerciseApproach['exercise'] & {
  approaches: IExerciseApproach['approaches'],
  style?: StyleProp<ViewStyle>;
  children?: JSX.Element | JSX.Element[];
};

const style = StyleSheet.create({
  wrapper: {},
  inner: {
    borderRadius: 10,
    gap: 5,
  },
  image: {
    width: 70,
    height: 70 * 0.9,
    marginRight: 10,
    borderRadius: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  textLine: {
    flexDirection: "row",
    marginBottom: -3,
  },
  text: {
    flex: 1,
    fontSize: 16,
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
  },
  approaches: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  approachesText: {
    fontSize: 14,
    width: 64,
    textAlign: "right",
  },
});

export function ExerciseCardHistory(props: Props) {
  const wrapperStyle = useMemo(() => {
    if (props.style && typeof props.style === "object") {
      return {
        ...props.style,
        ...style.wrapper,
      };
    }

    return style.wrapper;
  }, [props.style]);

  return (
    <View style={wrapperStyle}>
      <View style={style.inner}>
        <View style={style.textLine}>
          <Text style={style.text}>{props.name}</Text>
        </View>

        <View style={style.content}>
          <Image source={props.photo} style={style.image} />

          <View style={style.approachesList}>
            {props.approaches.map((ap, key) => (
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
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
