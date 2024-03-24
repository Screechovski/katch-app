import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { IExercise } from "../../entity/IExercise";
import { Colors } from "../../theme";
import { useMemo } from "react";

type ExerciseCardProps = IExercise & {
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
    backgroundColor: Colors.light.i2,
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
    color: Colors.dark.i7,
    height: 12 * 1.2 * 3,
  },
  countsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 2,
    flexWrap: 'wrap',
    minHeight: 5,
    marginTop: 5
  },
  countsItem: {
    display: 'flex',
    height: 5,
    width: 5,
    backgroundColor: Colors.primary.i50,
    borderRadius: 3
  }
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
        <View style={style.countsList}>
          {Array.from({ length: props.count }).map(() => (
            <View style={style.countsItem} />
          ))}
        </View>
      </View>
    </Pressable>
  );
}
