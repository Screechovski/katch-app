import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
    variant: 'h1' | 'h2' | 'h3' | 'text' | 'text-small';
    lines?: number;
    children: string;
};
export const CText = (props: Props) => {
    const styles = useMemo(() => {
        const base = {
            color: '#141414',
        };
        switch (props.variant) {
            case 'h3':
                return StyleSheet.create({
                    root: {
                        ...base,
                        fontSize: 18,
                        fontWeight: 600,
                    },
                });
            case 'text':
                return StyleSheet.create({
                    root: {
                        ...base,
                        fontSize: 16,
                    },
                });
            case 'text-small':
                return StyleSheet.create({
                    root: {
                        ...base,
                        fontSize: 14,
                    },
                });
            default:
                return StyleSheet.create({
                    root: {
                        ...base,
                        fontSize: 18,
                    },
                });
        }
    }, [props.variant]);

    return (
        <Text style={styles.root} numberOfLines={props.lines}>
            {props.children}
        </Text>
    );
};
