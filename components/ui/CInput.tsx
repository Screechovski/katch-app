import { Pressable, StyleSheet, Text, TextInput, TextStyle, View } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { AntDesign } from '@expo/vector-icons';

interface Props {
    placeholder: string;
    value: string;
    onInput(value: string): void;
    style?: TextStyle;
    type?: 'text' | 'number';
    label?: string;
}

export function CInput({ type, style, value, placeholder, label, onInput }: Props) {
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
                    backgroundColor: 'transparent',
                    color:
                        theme?.theme === 'dark'
                            ? theme?.colors.primary.i5
                            : theme?.colors.primary.i80,
                    fontSize: 16,
                    height: '100%',
                    flex: 1,
                    paddingLeft: 10,
                },
                inputWrapper: {
                    borderRadius: 10,
                    height: 50,
                    backgroundColor: theme?.colors.background.i2,
                    borderWidth: 3,
                    borderColor: theme?.colors.primary.i80,
                    display: 'flex',
                    flexDirection: 'row',
                },
                clear: {
                    height: 44,
                    width: 44,
                    paddingTop: 11,
                    paddingLeft: 11,
                },
            }),
        [theme?.theme],
    );
    const isClearVisible = useMemo(() => value.length > 0, [value]);

    return (
        <View style={[styles.wrap, style]}>
            {label !== undefined && <Text style={styles.label}>{label}</Text>}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onInput}
                    keyboardType={type === 'number' ? 'decimal-pad' : 'default'}
                    inputMode={type === 'number' ? 'decimal' : 'search'}
                />
                {isClearVisible && (
                    <Pressable onPress={() => onInput('')} style={styles.clear}>
                        <AntDesign name={'close'} size={20} color={theme?.colors.primary.i80} />
                    </Pressable>
                )}
            </View>
        </View>
    );
}
