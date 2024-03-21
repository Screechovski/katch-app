import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { IPhysicalExercise } from "../../entity/IExercise";
import { COLORS } from "../../theme";
import { useMemo } from "react";

type ExerciseCardProps = IPhysicalExercise & {
  style?: StyleProp<ViewStyle>;
  onPress?: (e: number) => void;
  children?: JSX.Element | JSX.Element[];
};

const style = StyleSheet.create({
  wrapper: {
    padding: 5,
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: COLORS.light.i2,
    borderRadius: 10,
    padding: 5,
  },
  image: {
    width: "100%",
    height: 100,
    marginBottom: 5,
  },
  textWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginLeft: 0,
    marginTop: 0,
  },
  text: {
    display: "flex",
    flex: 1,
    fontSize: 12,
    textAlign: "center",
    color: COLORS.dark.i7,
    height: 12 * 1.2 * 3,
  },
});

export function ExerciseCardVertical(props: ExerciseCardProps) {
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
        <Image source={props.photo} style={style.image} />
        <View style={style.textWrap}>
          <Text style={style.text}>{props.name}</Text>
        </View>
      </View>
    </Pressable>
  );
}
