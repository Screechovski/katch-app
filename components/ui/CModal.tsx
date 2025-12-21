import React, { ReactNode } from 'react';
import { Modal, StyleSheet, View, ViewStyle } from 'react-native';
import { CIconButton } from './CIconButton';
import { useTheme } from '@/components/ThemeProvider';

interface Props {
    children: ReactNode;
    visible: boolean;
    onHide: () => void;
    style?: ViewStyle;
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        flex: 1,
    },
});

export function CModal({ children, visible, onHide, style }: Props) {
    const theme = useTheme();
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
                <View
                    style={{
                        backgroundColor: theme?.colors.background.i2,
                        padding: 15,
                        borderRadius: 10,
                        marginBottom: 15,
                    }}
                >
                    {children}
                </View>

                <CIconButton onPress={onHide} name="close" />
            </View>
        </Modal>
    );
}
