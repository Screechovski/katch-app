import React from "react";
import {
  Button,
  Dimensions,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { IChildren } from "../../model/Children";

type Props = {
  children: IChildren;
  visible: boolean;
  onHide: () => void;
};

export function CModal(props: Props) {
  const size = Dimensions.get("window");

  return (
    <Modal visible={props.visible} animationType="slide" transparent={true}>
      {props.visible && (
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onPress={props.onHide}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 15,
              width: size.width - 30,
              height: size.height - 100,
              borderRadius: 10,
              marginBottom: 15,
            }}
          >
            {props.children}
          </View>

          <Button title="Close" onPress={props.onHide} />
        </TouchableOpacity>
      )}
    </Modal>
  );
}
