import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
    padding?: 's' | 'm' | 'l';
    children: ReactNode;
    style?: ViewStyle;
}

export function CWrapper(props: Props) {
    return <View style={[style.wrap, props.style]}>{props.children}</View>;
}

const style = StyleSheet.create({
    wrap: {
        flex: 1,
        paddingHorizontal: 5,
        paddingTop: 5,
        width: '100%',
    },
});
