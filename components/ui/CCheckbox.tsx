import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { AntDesign } from '@expo/vector-icons';

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
                    borderColor: theme?.colors.primary.i95,
                    borderRadius: 8,
                    backgroundColor: props.checked
                        ? theme?.colors.primary.i80
                        : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: props.disabled ? 0.5 : 1,
                },
                checkmark: {
                    color: theme?.colors.background.i2,
                    fontSize: 14,
                    fontWeight: 'bold',
                },
                label: {
                    marginLeft: 8,
                    fontSize: 16,
                    color: theme?.colors.background.i7,
                },
            }),
        [theme?.theme, props.checked],
    );

    return (
        <TouchableOpacity
            onPress={props.onPress}
            disabled={props.disabled}
            style={[style.container, props.style]}
            activeOpacity={1}
        >
            <View style={style.wrap}>
                {props.checked && (
                    <AntDesign style={style.checkmark} name="check"></AntDesign>
                )}
            </View>
            <Text style={style.label}>{props.children}</Text>
        </TouchableOpacity>
    );
}
