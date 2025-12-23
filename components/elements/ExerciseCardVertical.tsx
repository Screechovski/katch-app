import { useTheme } from '@/components/ThemeProvider';
import { useMemo } from 'react';
import {
    Image,
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
    photo: { uri: string };
} & {
    style?: StyleProp<ViewStyle>;
    onPress(e: number): void;
};

export function ExerciseCardVertical(props: ExerciseCardProps) {
    const theme = useTheme();
    const style = useMemo(
        () =>
            StyleSheet.create({
                inner: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: theme?.colors.background.i3,
                    width: '100%',
                    borderRadius: 10,
                    padding: 4,
                },
                imageWrap: {
                    filter: theme?.theme === 'dark' ? 'invert(1)' : undefined,
                    marginBottom: 5,
                    width: '100%',
                    height: 110,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 4,
                    backgroundColor:
                        theme?.theme === 'dark'
                            ? theme?.colors.background.i9
                            : theme?.colors.background.i2,
                },
                image: {
                    width: '100%',
                    height: '100%',
                    maxWidth: 110,
                    borderRadius: 4,
                },
                text: {
                    display: 'flex',
                    fontSize: 15,
                    lineHeight: 15,
                    textAlign: 'center',
                    width: '100%',
                    color: theme?.colors.background.i8,
                    height: 15 * 1.2 * 4,
                    flexWrap: 'wrap',
                },
            }),
        [theme?.theme],
    );

    return (
        <Pressable style={props.style} onPress={() => props.onPress(props.id)}>
            <View style={style.inner}>
                <View style={style.imageWrap}>
                    <Image source={props.photo} style={style.image} />
                </View>

                <Text style={style.text} numberOfLines={4}>
                    {props.name}
                </Text>
            </View>
        </Pressable>
    );
}
