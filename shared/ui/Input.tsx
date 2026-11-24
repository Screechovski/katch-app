import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { IconButton } from './Button';
import { workoutColors as colors, workoutFonts as fonts } from './workout/theme';

type Props = {
    label: string;
    hideLabel?: boolean;
    value: string;
    onChangeText?: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'search' | 'decimal' | 'numeric';
    unit?: string;
    error?: string;
    disabled?: boolean;
    clearable?: boolean;
    style?: StyleProp<ViewStyle>;
};

export function Input({
    label,
    hideLabel,
    value,
    onChangeText,
    placeholder,
    type = 'text',
    unit,
    error,
    disabled,
    clearable = type === 'search',
    style,
}: Props) {
    const [focused, setFocused] = useState(false);
    const search = type === 'search';

    return (
        <View style={[styles.group, style]}>
            {!hideLabel && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.field, focused && styles.focused, error && styles.invalid, disabled && styles.disabled]}>
                {search && <MaterialCommunityIcons aria-hidden name="magnify" size={20} color={colors.muted} />}
                <TextInput
                    accessibilityLabel={unit ? `${label}, ${unit}` : label}
                    accessibilityState={{ disabled }}
                    accessibilityHint={error}
                    editable={!disabled}
                    inputMode={type}
                    onBlur={() => setFocused(false)}
                    onFocus={() => setFocused(true)}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.muted}
                    selectionColor={colors.accent}
                    style={[styles.input, disabled && styles.disabledText]}
                    value={value}
                />
                {unit && <Text style={styles.unit}>{unit}</Text>}
                {clearable && value !== '' && !disabled && onChangeText && (
                    <IconButton
                        label={search ? 'Очистить поиск' : 'Очистить поле'}
                        icon="close"
                        variant="secondary"
                        onPress={() => onChangeText('')}
                        style={styles.clear}
                    />
                )}
            </View>
            {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    group: { gap: 8 },
    label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
    field: {
        minHeight: 50,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.fieldBorder,
        backgroundColor: colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 13,
        paddingRight: 12,
    },
    focused: { borderColor: colors.accent },
    invalid: { borderColor: colors.danger },
    disabled: { borderColor: colors.border, borderStyle: 'dashed' },
    input: {
        flex: 1,
        minWidth: 0,
        paddingHorizontal: 0,
        paddingVertical: 12,
        fontFamily: fonts.medium,
        fontSize: 16,
        color: colors.ink,
        outlineStyle: 'solid',
        outlineWidth: 0,
    },
    disabledText: { color: colors.muted },
    unit: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
    clear: { marginRight: -4 },
    error: { fontFamily: fonts.medium, fontSize: 12, color: colors.danger },
});
