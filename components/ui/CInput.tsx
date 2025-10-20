import { StyleSheet, Text, TextInput, TextStyle, View } from 'react-native';
import { useMemo } from 'react';
import { Colors } from '@/constants/Theme';

interface Props {
    placeholder: string;
    value: string;
    onInput(value: string): void;
    style?: TextStyle;
    type?: 'text' | 'number';
    label?: string;
    disabled?: boolean;
}

export function CInput({
    disabled,
    type,
    style,
    value,
    placeholder,
    label,
    onInput,
}: Props) {
    const isDisabled = useMemo(() => !!disabled, [disabled]);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                wrap: {},
                label: {
                    fontSize: 16,
                    color: Colors.dark.i4,
                    height: 16 * 1.5,
                },
                input: {
                    paddingHorizontal: 15,
                    borderRadius: 10,
                    borderWidth: 3,
                    borderColor: isDisabled
                        ? Colors.dark.i3
                        : Colors.primary.i90,
                    backgroundColor: isDisabled
                        ? Colors.light.i4
                        : Colors.light.i2,
                    color: isDisabled ? Colors.dark.i4 : Colors.primary.i80,
                    fontSize: 16,
                    height: 50,
                    display: 'flex',
                },
            }),
        [isDisabled],
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
                editable={!disabled}
                placeholder={placeholder}
                selectTextOnFocus={!disabled}
                onChangeText={onInput}
            />
        </View>
    );
}
