import { workoutColors as colors, workoutFonts as fonts } from '@/shared/ui/workout/theme';
import { ApiV2 } from '@/helpers/api/v2';
import { prettyDate } from '@/helpers/PrettyDate';
import { prettySetParams } from '@/helpers/PrettySetParams';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    trains: Awaited<ReturnType<typeof ApiV2.exerciseHistory>>['history'];
};

export const HistoryExercises = (props: Props) => {
    return (
        <View style={styles.list}>
            {(props.trains || []).map((train) => (
                <View style={styles.item} key={train.id}>
                    <Text style={styles.date}>{prettyDate(train.date)}</Text>
                    <View style={styles.approaches}>
                        {train.approaches.map((set, i) => (
                            <Text style={styles.params} key={i}>
                                {prettySetParams(set)}
                            </Text>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    list: { gap: 5 },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 10,
        padding: 8,
        borderRadius: 10,
        backgroundColor: colors.canvas,
    },
    date: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink },
    approaches: { flexShrink: 1, alignItems: 'flex-end' },
    params: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted, textAlign: 'right' },
});
