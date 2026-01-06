import { StyleSheet, Text, TextInput, TextStyle, View } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';

interface Props {
    placeholder: string;
    value: string;
    onInput(value: string): void;
    style?: TextStyle;
    type?: 'text' | 'number';
    label?: string;
}

export function CInput({
    type,
    style,
    value,
    placeholder,
    label,
    onInput,
}: Props) {
    const theme = useTheme();

    const styles = useMemo(
        () =>
            StyleSheet.create({
                wrap: {},
                label: {
                    fontFamily: 'Montserrat',
                    fontSize: 16,
                    color: theme?.colors.background.i8,
                    height: 16 * 1.5,
                },
                input: {
                    fontFamily: 'Montserrat',
                    paddingHorizontal: 15,
                    borderRadius: 10,
                    borderWidth: 3,
                    borderColor: theme?.colors.primary.i80,
                    backgroundColor: theme?.colors.background.i2,
                    color:
                        theme?.theme === 'dark'
                            ? theme?.colors.primary.i5
                            : theme?.colors.primary.i80,
                    fontSize: 16,
                    height: 50,
                    display: 'flex',
                },
            }),
        [theme?.theme],
    );

    const keyboardType = useMemo(() => {
        return type === 'number' ? 'numeric' : 'default';
    }, [type]);

    return (
        <View style={[styles.wrap, style]}>
            {label !== undefined && <Text style={styles.label}>{label}</Text>}
            <TextInput
                keyboardType={keyboardType}
                style={styles.input}
                value={value}
                placeholder={placeholder}
                onChangeText={onInput}
            />
        </View>
    );
}
