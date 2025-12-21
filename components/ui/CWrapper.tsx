import { useTheme } from '@/components/ThemeProvider';
import { ReactNode, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
    padding?: 's' | 'm' | 'l';
    children: ReactNode;
    style?: ViewStyle;
}

export function CWrapper(props: Props) {
    const theme = useTheme();
    const style = useMemo(
        () =>
            StyleSheet.create({
                wrap: {
                    flex: 1,
                    paddingHorizontal: 5,
                    paddingTop: 5,
                    width: '100%',
                    backgroundColor: theme?.colors.background.i2,
                },
            }),
        [theme?.theme],
    );

    return <View style={[style.wrap, props.style]}>{props.children}</View>;
}
