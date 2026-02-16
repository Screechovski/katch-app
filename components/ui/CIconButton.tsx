import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useMemo } from 'react';
import { CLoader } from '@/components/ui/CLoader';
import { useTheme } from '@/components/ThemeProvider';

interface Props {
    onPress(): void;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    variant?: 'error' | 'primary';
    inline?: boolean;
    name: keyof typeof AntDesign.glyphMap;
}

export function CIconButton(props: Props) {
    const theme = useTheme();
    const style = useMemo(() => {
        let backgroundColor;
        let borderColor;
        switch (props.variant) {
            case 'error':
                if (props.inline) {
                    backgroundColor = 'transparent';
                } else {
                    borderColor = theme?.colors.danger.i7;
                    backgroundColor = theme?.colors.danger.i6;
                }
                break;
            case 'primary':
            default:
                if (props.inline) {
                    backgroundColor = 'transparent';
                } else {
                    borderColor = theme?.colors.primary.i90;
                    backgroundColor = theme?.colors.primary.i80;
                }
                break;
        }
        return StyleSheet.create({
            wrap: {
                height: props.inline ? 28 : 30,
                width: props.inline ? 28 : 30,
                backgroundColor,
                borderWidth: props.inline ? 0 : 2,
                borderColor,
                borderRadius: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
        });
    }, [theme?.theme, props.inline]);

    const iconColor = useMemo(() => {
        switch (props.variant) {
            case 'error':
                if (props.inline) {
                    return theme?.colors.danger.i6;
                }
            case 'primary':
            default:
                if (props.inline) {
                    return theme?.colors.primary.i80;
                }
                return theme?.colors.background.i2;
        }
    }, []);

    function pressHandler() {
        if (props.disabled || props.loading) {
            return;
        }

        props.onPress();
    }

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={[style.wrap, props.style]}
            onPress={pressHandler}
            disabled={props.disabled}
        >
            {props.loading && <CLoader />}
            {!props.loading && (
                <AntDesign
                    name={props.name}
                    size={props.inline ? 18 : 16}
                    color={iconColor}
                />
            )}
        </TouchableOpacity>
    );
}
