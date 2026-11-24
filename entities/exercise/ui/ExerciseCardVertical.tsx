import { workoutColors as colors, workoutFonts as fonts } from '@/shared/ui/workout/theme';
import { useState } from 'react';
import {
    Image,
    ImageSourcePropType,
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

type ExerciseCardProps = {
    id: number;
    name: string;
    photo: ImageSourcePropType;
    style?: StyleProp<ViewStyle>;
    onPress(e: number): void;
};

export function ExerciseCardVertical({ id, name, photo, style, onPress }: ExerciseCardProps) {
    const [focused, setFocused] = useState(false);

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={name}
            onPress={() => onPress(id)}
            onFocus={(event) => {
                const target = event.currentTarget as unknown as HTMLElement;
                setFocused(Platform.OS !== 'web' || target.matches(':focus-visible'));
            }}
            onBlur={() => setFocused(false)}
            onPointerDown={() => setFocused(false)}
            style={[styles.card, style]}
        >
            <Image source={photo} style={styles.image} resizeMode="contain" />
            <View style={[styles.caption, focused && styles.focusedCaption]}>
                <Text style={styles.name} numberOfLines={4}>
                    {name}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        padding: 7,
        gap: 7,
        outlineWidth: 0,
    },
    image: {
        alignSelf: 'center',
        width: '100%',
        height: 110,
        maxWidth: 144,
    },
    caption: {
        flexGrow: 1,
        minHeight: 56,
        paddingHorizontal: 7,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: colors.canvas,
    },
    focusedCaption: { backgroundColor: colors.mint },
    name: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 13, lineHeight: 17 },
});
