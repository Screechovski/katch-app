import React, {ReactNode} from "react";
import {
    GestureResponderEvent,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import {CIconButton} from "./CIconButton";
import {Colors} from "@/constants/Theme";

interface Props {
    children: ReactNode;
    visible: boolean;
    onHide: () => void;
    style?: ViewStyle;
}

const style = StyleSheet.create({
    wrap: {
        flexDirection: "row",
        flex: 1,
    },
});

export function CModal(props: Props) {
    function onPressHandler(e: GestureResponderEvent) {
        e.stopPropagation();
        e.preventDefault();
        props.onHide();
    }

    if (!props.visible) return <></>;

    return (
        <Modal
            style={[style.wrap, props.style]}
            visible={props.visible}
            animationType="slide"
            transparent={true}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    paddingVertical: 20,
                }}
            >
                <View
                    style={{
                        backgroundColor: Colors.light.i4,
                        padding: 15,
                        borderRadius: 10,
                        marginBottom: 15,
                    }}
                >
                    {props.children}
                </View>

                <CIconButton onPress={props.onHide} name="close"/>
            </View>
        </Modal>
    );
}
