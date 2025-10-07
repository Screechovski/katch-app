import { Colors } from '@/constants/Theme';
import { StyleSheet, Text, View } from 'react-native';

const style = StyleSheet.create({
    wrap: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: Colors.danger.i2,
    },

    text: {
        fontSize: 18,
        color: Colors.danger.i5,
    },
});

export function CInformerError({ message }: { message: string }) {
    return (
        <View style={style.wrap}>
            <Text style={style.text}>{message}</Text>
        </View>
    );
}
