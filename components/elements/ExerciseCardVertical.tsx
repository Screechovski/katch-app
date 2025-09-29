import { Colors } from '@/constants/Theme';
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

const style = StyleSheet.create({
    inner: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Colors.light.i2,
        width: '100%',
        borderRadius: 10,
    },
    image: {
        width: '100%',
        maxWidth: 100,
        height: 100,
        marginBottom: 5,
    },
    text: {
        display: 'flex',
        fontSize: 15,
        lineHeight: 15,
        textAlign: 'center',
        width: '100%',
        color: Colors.dark.i7,
        height: 15 * 1.2 * 4,
        flexWrap: 'wrap',
    },
});

export function ExerciseCardVertical(props: ExerciseCardProps) {
    return (
        <Pressable style={props.style} onPress={() => props.onPress(props.id)}>
            <View style={style.inner}>
                <Image source={props.photo} style={style.image} />

                <Text style={style.text} numberOfLines={4}>
                    {props.name}
                </Text>
            </View>
        </Pressable>
    );
}
