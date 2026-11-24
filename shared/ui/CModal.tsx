import React, { ReactNode } from 'react';
import { Modal, StyleSheet, View, type ViewStyle } from 'react-native';
import { IconButton } from './Button';
import { Colors } from '@/constants/Theme';
import { workoutColors } from './workout/theme';

interface Props {
    children: ReactNode;
    visible: boolean;
    onHide: () => void;
    style?: ViewStyle;
    variant?: 'workout';
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        flex: 1,
    },
    panel: {
        backgroundColor: Colors.background.i2,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    workoutPanel: {
        width: '92%',
        maxWidth: 420,
        maxHeight: '85%',
        flexShrink: 1,
        backgroundColor: workoutColors.surface,
        borderColor: workoutColors.border,
        borderWidth: 1,
        borderRadius: 22,
        padding: 16,
    },
});

export function CModal({ children, visible, onHide, style, variant }: Props) {
    return (
        <Modal
            style={[styles.wrap, style]}
            visible={visible}
            animationType="fade"
            transparent={true}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    paddingVertical: 20,
                }}
            >
                <View style={[styles.panel, variant === 'workout' && styles.workoutPanel]}>
                    {children}
                </View>

                <IconButton
                    label="Закрыть окно"
                    icon="close"
                    variant="secondary"
                    onPress={onHide}
                />
            </View>
        </Modal>
    );
}
