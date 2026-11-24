import { ComponentProps, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { workoutColors as colors, workoutFonts as fonts } from './workout/theme';

const variants = {
    primary: { background: colors.accentFill, pressed: colors.mintDark, text: colors.surface },
    secondary: { background: colors.mint, pressed: colors.mintPressed, text: colors.mintDark },
};

type ButtonOptions = {
    onPress: () => void;
    variant?: keyof typeof variants;
    disabled?: boolean;
    selected?: boolean;
    style?: StyleProp<ViewStyle>;
};

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type IconButtonProps = ButtonOptions & { label: string; icon: IconName; children?: never };
type Props = (ButtonOptions & { children: string; icon?: IconName; label?: never }) | IconButtonProps;

export function IconButton(props: IconButtonProps) {
    return <Button {...props} />;
}

export function Button({ children, label, onPress, variant = 'primary', icon, disabled, selected, style }: Props) {
    const [focused, setFocused] = useState(false);
    const iconOnly = label !== undefined;
    const palette = variants[variant];
    const foreground = disabled ? colors.muted : palette.text;

    return (
        <Pressable
            {...(Platform.OS === 'web' && selected !== undefined && { 'aria-pressed': selected })}
            accessibilityRole="button"
            accessibilityLabel={label ?? children}
            accessibilityState={{ disabled, selected }}
            disabled={disabled}
            hitSlop={iconOnly ? 4 : undefined}
            onPress={onPress}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: disabled ? colors.disabled : pressed || focused ? palette.pressed : palette.background },
                style,
                iconOnly && styles.iconButton,
            ]}
        >
            {icon && <MaterialCommunityIcons aria-hidden name={icon} size={iconOnly ? 20 : 19} color={foreground} />}
            {children !== undefined && <Text style={[styles.label, { color: foreground }]}>{children}</Text>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 48,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        outlineWidth: 0,
    },
    iconButton: {
        width: 36,
        height: 36,
        minHeight: 36,
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderRadius: 10,
    },
    label: { fontFamily: fonts.semibold, fontSize: 14, textAlign: 'center', flexShrink: 1 },
});
