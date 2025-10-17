import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
    padding?: 's' | 'm' | 'l';
    children: ReactNode;
    style?: ViewStyle;
}

const style = StyleSheet.create({
    wrap: {
        flex: 1,
        paddingHorizontal: 5,
        marginVertical: 5,
        width: '100%',
    },
});

export function CWrapper(props: Props) {
    return <View style={[style.wrap, props.style]}>{props.children}</View>;
}
