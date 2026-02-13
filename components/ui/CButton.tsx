import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { CLoader } from '@/components/ui/CLoader';
import { useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';

interface Props {
    children: string;
    onPress(): void;
    style?: ViewStyle;
    variant?: 'primary' | 'success' | 'error';
    disabled?: boolean;
    loading?: boolean;
}

export function CButton(props: Props) {
    const theme = useTheme();
    const style = useMemo(() => {
        let backgroundColor;
        let borderColor;
        let color = theme?.colors.background.i3;
        switch (props.variant) {
            case 'success':
                backgroundColor = theme?.colors.success.i7;
                borderColor = theme?.colors.success.i9;
                break;
            case 'error':
                backgroundColor = theme?.colors.danger.i6;
                borderColor = theme?.colors.danger.i7;
                break;
            case 'primary':
            default:
                backgroundColor = theme?.colors.primary.i80;
                borderColor = theme?.colors.primary.i95;
                break;
        }
        return StyleSheet.create({
            wrap: {
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor,
                paddingHorizontal: 20,
                boxSizing: 'border-box',
                borderRadius: 10,
                borderWidth: 2,
                borderColor,
                opacity: props.disabled ? 0.5 : 1,
            },
            text: {
                fontSize: 20,
                fontFamily: 'Montserrat',
                textTransform: 'lowercase',
                color,
            },
        });
    }, [props.variant, props.disabled, theme?.theme]);

    function pressHandler() {
        if (props.disabled) {
            return;
        }

        props.onPress();
    }

    const loaderColor = useMemo(() => {
        switch (props.variant) {
            case 'success':
                return theme?.colors.success.i9;
            case 'error':
                return theme?.colors.danger.i7;
            case 'primary':
            default:
                return theme?.colors.primary.i95;
        }
    }, [theme?.theme]);

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={[style.wrap, props.style]}
            onPress={pressHandler}
            disabled={props.disabled}
        >
            {props.loading && <CLoader color={loaderColor} />}
            {!props.loading && <Text style={style.text}>{props.children}</Text>}
        </TouchableOpacity>
    );
}
