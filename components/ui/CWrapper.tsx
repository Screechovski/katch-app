import { ReactNode, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
    padding?: 's' | 'm' | 'l';
    children: ReactNode;
    style?: ViewStyle;
}

export function CWrapper(props: Props) {
    const getPadding = useMemo(() => {
        if (props.padding === 's') {
            return 5;
        }

        if (props.padding === 'l') {
            return 15;
        }

        return 10;
    }, [props.padding]);

    const style = useMemo(
        () =>
            StyleSheet.create({
                wrap: {
                    flex: 1,
                    paddingHorizontal: getPadding,
                    marginVertical: getPadding,
                    width: '100%',
                },
            }),
        [],
    );

    return <View style={[style.wrap, props.style]}>{props.children}</View>;
}
