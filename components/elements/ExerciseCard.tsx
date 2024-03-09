import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { IPhysicalExercise } from "../../entity/PhysicalExercise";
import { COLORS } from "../../theme";
import { useMemo } from "react";

type ExerciseCardProps = IPhysicalExercise & {
  style?: StyleProp<ViewStyle>;
  horizontal?: boolean;
  onPress?: (e: number) => void;
  children?: JSX.Element | JSX.Element[];
};

const createStyle = (isHorizontal = false) =>
  StyleSheet.create({
    wrapper: {
      padding: 5,
    },
    inner: {
      display: "flex",
      flexDirection: isHorizontal ? "row" : "column",
      alignItems: isHorizontal ? "flex-start" : "center",
      backgroundColor: COLORS.light.i2,
      borderRadius: 10,
      padding: 5,
    },
    image: {
      width: isHorizontal ? 100 : "100%",
      height: 100,
      marginBottom: 5,
    },
    textWrap: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      marginLeft: isHorizontal ? 20 : 0,
      marginTop: isHorizontal ? 5 : 0,
    },
    text: {
      display: "flex",
      flex: 1,
      fontSize: isHorizontal ? 20 : 12,
      textAlign: isHorizontal ? "left" : "center",
      color: COLORS.dark.i7,
      height: isHorizontal ? "auto" : 12 * 1.2 * 3,
    },
  });

export function ExerciseCard(props: ExerciseCardProps) {
  const style = useMemo(
    () => createStyle(props.horizontal),
    [props.horizontal]
  );

  const wrapperStyle = useMemo(() => {
    if (props.style && typeof props.style === "object") {
      return {
        ...props.style,
        ...style.wrapper,
      };
    }

    return style.wrapper;
  }, [props.style, props.horizontal]);

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
          {(props.children && props.horizontal) &&  props.children}
        </View>
      </View>
    </Pressable>
  );
}
