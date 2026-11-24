import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { workoutColors as colors, workoutFonts as fonts } from './workout/theme';

type Props = {
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
};

export function Checkbox({ label, checked, onCheckedChange, disabled }: Props) {
    const [focused, setFocused] = useState(false);

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === ' ' && !disabled) {
            event.preventDefault();
            if (!event.repeat) onCheckedChange(!checked);
        }
    }

    return (
        <Pressable
            {...(Platform.OS === 'web' && { onKeyDown: handleKeyDown })}
            accessibilityRole="checkbox"
            accessibilityLabel={label}
            aria-checked={checked}
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => onCheckedChange(!checked)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={({ pressed }) => [
                styles.row,
                checked && styles.selectedRow,
                pressed && styles.pressedRow,
                focused && !disabled && styles.focused,
                disabled && styles.disabled,
            ]}
        >
            <View style={[styles.box, checked && styles.checkedBox]}>
                {checked && <MaterialCommunityIcons aria-hidden name="check" size={16} color={colors.surface} />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        minHeight: 44,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
    },
    selectedRow: { backgroundColor: colors.mint },
    pressedRow: { backgroundColor: colors.mintPressed },
    focused: { outlineStyle: 'solid', outlineColor: colors.accent, outlineWidth: 2, outlineOffset: 2 },
    disabled: { opacity: 0.55 },
    box: {
        width: 22,
        height: 22,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: colors.fieldBorder,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: { borderColor: colors.accentFill, backgroundColor: colors.accentFill },
    label: { flexShrink: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink },
});
