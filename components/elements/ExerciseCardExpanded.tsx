import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { COLORS } from "../../theme";
import { useMemo } from "react";
import { ITrainingExecise } from "../../entity/Training";
import { CIconButton } from "../ui/CIconButton";

type ExerciseCardProps = ITrainingExecise & {
  style?: StyleProp<ViewStyle>;
  onPress?: (e: number) => void;
  children?: JSX.Element | JSX.Element[];
  saved?: boolean;
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
    color: COLORS.dark.i7,
    height: "auto",
  },
  approachesTextLine: {
    flexDirection: "row",
    gap: 4,
  },
  approachesList: {
    flexDirection: "column",
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

          {!props.saved && (
            <CIconButton
              onPress={() => {}}
              size="m"
              variant="error"
              name="close"
            />
          )}
        </View>

        <View style={style.content}>
          <Image source={props.photo} style={style.image} />

          <View style={style.approachesList}>
            {props.approuch.map((ap) => (
              <View style={style.approaches} key={ap.id}>
                <View style={style.approachesTextLine}>
                  <Text style={style.approachesText}>
                    {ap.approaches} подх.
                  </Text>

                  <Text style={style.approachesText}>
                    {ap.repetitions} повт.
                  </Text>
                  <Text style={style.approachesText}>{ap.weight} вес</Text>
                </View>

                {!props.saved && (
                  <CIconButton
                    name="close"
                    iconColor={COLORS.light.i2}
                    variant="error"
                    onPress={() => {}}
                    size="s"
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
