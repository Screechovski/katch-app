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
    wrapper: {},
    inner: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Colors.light.i2,
        width: '100%',
        borderRadius: 8,
    },
    image: {
        width: '100%',
        maxWidth: 100,
        height: 100,
        marginBottom: 5,
    },
    textWrap: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 0,
        marginTop: 0,
        width: '100%',
    },
    text: {
        display: 'flex',
        fontSize: 12,
        lineHeight: 12,
        textAlign: 'center',
        width: '100%',
        color: Colors.dark.i7,
        height: 12 * 1.2 * 4,
        flexWrap: 'wrap',
    },
});

export function ExerciseCardVertical(props: ExerciseCardProps) {
    return (
        <Pressable
            style={[props.style, style.wrapper]}
            onPress={() => props.onPress(props.id)}
        >
            <View style={style.inner}>
                <Image source={props.photo} style={style.image} />

                <View style={style.textWrap}>
                    <Text style={style.text} numberOfLines={4}>
                        {props.name}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
