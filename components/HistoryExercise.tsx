import { useTheme } from '@/components/ThemeProvider';
import { ApiV2 } from '@/helpers/api/v2';
import { prettyDate } from '@/helpers/PrettyDate';
import { prettySetParams } from '@/helpers/PrettySetParams';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    trains: Awaited<ReturnType<typeof ApiV2.exerciseHistory>>['history'];
};

export const HistoryExercises = (props: Props) => {
    const theme = useTheme();
    const styles = StyleSheet.create({
        list: {
            gap: 5,
        },
        item: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        date: {
            marginRight: 'auto',
            marginLeft: 5,
        },
        dot: {
            height: 6,
            width: 6,
            borderRadius: 3,
            marginTop: 8,
            backgroundColor: theme?.colors.primary.i80,
        },
    });

    return (
        <View style={styles.list}>
            {(props.trains || []).map((train) => (
                <View style={styles.item} key={train.id}>
                    <View style={styles.dot}></View>
                    <Text style={styles.date}>{prettyDate(train.date)}</Text>
                    <View>
                        {train.approaches.map((set, i) => (
                            <Text style={{ display: 'flex' }} key={i}>
                                {prettySetParams(set)}
                            </Text>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
};
