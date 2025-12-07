import { Colors } from '@/constants/Theme';
import { StyleSheet, Text, View } from 'react-native';

const style = StyleSheet.create({
    wrap: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: Colors.danger.i2,
    },

    successWrap: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: Colors.success.i4,
    },

    errorText: {
        fontSize: 18,
        color: Colors.danger.i5,
    },

    successText: {
        fontSize: 18,
        color: Colors.success.i7,
    },
});

type Props = {
    message: string;
    type: 'success' | 'error';
};

export function CInformer({ message, type }: Props) {
    return (
        <View style={type === 'error' ? style.wrap : style.successWrap}>
            <Text
                style={type === 'error' ? style.errorText : style.successText}
            >
                {message}
            </Text>
        </View>
    );
}
