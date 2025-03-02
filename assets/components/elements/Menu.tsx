import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Routes } from "../../router/router";
import { useCallback } from "react";
import { Colors } from "../../theme";

interface Props {
  page: Routes;
  setPage(page: Routes): void;
}

export function Menu(props: Props) {
  const getButtonStyle = useCallback(
    (page: Routes): ViewStyle => {
      const style: ViewStyle = {
        width: "50%",
        paddingVertical: 13,
      };

      if (page === props.page) {
        style.backgroundColor = Colors.light.i2;
        style.borderBottomLeftRadius = 10;
        style.borderBottomRightRadius = 10;
      }

      return style;
    },
    [props.page],
  );

  const getButtonTextStyle = useCallback(
    (page: Routes): TextStyle => {
      const style: TextStyle = {
        fontSize: 14,
        color: Colors.light.i3,
        textAlign: "center",
      };

      if (page === props.page) {
        style.color = Colors.primary.i90;
      }

      return style;
    },
    [props.page],
  );

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: Colors.primary.i90,
        paddingBottom: 7,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={getButtonStyle(Routes.CREATE_TRAINING)}
        onPress={() => props.setPage(Routes.CREATE_TRAINING)}
      >
        <Text style={getButtonTextStyle(Routes.CREATE_TRAINING)}>
          Новая тренировка
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.9}
        style={getButtonStyle(Routes.VIEW_TRAINS)}
        onPress={() => props.setPage(Routes.VIEW_TRAINS)}
      >
        <Text style={getButtonTextStyle(Routes.VIEW_TRAINS)}>История</Text>
      </TouchableOpacity>
    </View>
  );
}
