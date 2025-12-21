import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';

interface Props {
    checked: boolean;
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
    children: string;
}

export function CCheckbox(props: Props) {
    const theme = useTheme();
    const style = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flexDirection: 'row',
                    alignItems: 'center',
                },
                wrap: {
                    width: 24,
                    height: 24,
                    borderWidth: 2,
                    borderColor: theme?.colors.primary.i80,
                    borderRadius: 4,
                    backgroundColor: props.checked
                        ? theme?.colors.primary.i80
                        : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: props.disabled ? 0.5 : 1,
                },
                checkmark: {
                    color: theme?.colors.background.i7,
                    fontSize: 16,
                    fontWeight: 'bold',
                },
                label: {
                    marginLeft: 8,
                    fontSize: 16,
                    color: theme?.colors.background.i7,
                },
            }),
        [theme?.theme],
    );

    return (
        <TouchableOpacity
            onPress={props.onPress}
            disabled={props.disabled}
            style={[style.container, props.style]}
            activeOpacity={0.7}
        >
            <View style={style.wrap}>
                {props.checked && <Text style={style.checkmark}>✓</Text>}
            </View>
            <Text style={style.label}>{props.children}</Text>
        </TouchableOpacity>
    );
}
