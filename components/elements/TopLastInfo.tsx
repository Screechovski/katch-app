import { useTheme } from '@/components/ThemeProvider';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    topRes?: number;
    topWeight?: number;
    lastReps?: number;
    lastWeight?: number;
};
export const TopLastInfo = (props: Props) => {
    const theme = useTheme();
    const styles = useMemo(
        () =>
            StyleSheet.create({
                info: {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 5,
                    marginBottom: 5,
                },
                infoLine: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                },
                infoCircle: {
                    height: 10,
                    width: 10,
                    borderRadius: '50%',
                },
                infoText: {
                    fontFamily: 'Montserrat',
                    color: theme?.colors.background.i9,
                },
            }),
        [theme?.theme],
    );

    const hasTop = useMemo(
        () => (props.topRes || props.topWeight) !== -1,
        [props.topRes, props.topWeight],
    );
    const hasLast = useMemo(
        () => (props.lastReps || props.lastWeight) !== -1,
        [props.lastReps, props.lastWeight],
    );

    if (!hasLast && !hasTop) {
        return null;
    }

    return (
        <View style={styles.info}>
            {hasTop && (
                <View style={styles.infoLine}>
                    <View
                        style={{
                            ...styles.infoCircle,
                            backgroundColor: theme?.colors.danger.i5,
                        }}
                    ></View>
                    <Text style={styles.infoText}> - лучший</Text>
                </View>
            )}
            {hasLast && (
                <View style={styles.infoLine}>
                    <View
                        style={{
                            ...styles.infoCircle,
                            backgroundColor: theme?.colors.success.i7,
                        }}
                    ></View>
                    <Text style={styles.infoText}> - предыдущий</Text>
                </View>
            )}
        </View>
    );
};
