import { useTheme } from '@/components/ThemeProvider';
import { Api } from '@/helpers/Api';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
    trains: Awaited<ReturnType<typeof Api.exerciseHistory>>['trains'];
};

function prettyDate(dateString: string) {
    const date = new Date(dateString);
    const daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    const day = String(date.getDate()).padStart(2, '0');
    const montss = [
        'янв',
        'февр',
        'мар',
        'апр',
        'май',
        'июн',
        'июль',
        'авг',
        'сен',
        'окт',
        'нояб',
        'дек',
    ];
    const dayOfWeek = daysOfWeek[date.getDay()].toUpperCase();
    return `${day} ${montss[date.getMonth()]} (${dayOfWeek})`;
}

export const HistoryExercises = (props: Props) => {
    const theme = useTheme();
    const styles = StyleSheet.create({
        wrapper: {
            maxHeight: 200,
            height: 200,
        },
        scrollView: {
            flex: 1,
        },
        item: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 5,
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
        <View style={styles.wrapper}>
            <ScrollView style={styles.scrollView}>
                {props.trains.map((train) => (
                    <View style={styles.item} key={train.trainId}>
                        <View style={styles.dot}></View>
                        <Text style={styles.date}>
                            {prettyDate(train.trainDate)}
                        </Text>
                        <View>
                            {train.approaches.map((set) => (
                                <Text
                                    style={{ display: 'flex' }}
                                    key={`${train.trainId} ${set.weight} ${set.sets} ${set.reps}`}
                                >
                                    <Text
                                        style={{
                                            width: 20,
                                            textAlign: 'right',
                                        }}
                                    >
                                        {set.sets}
                                    </Text>
                                    {' подх. по '}
                                    <Text
                                        style={{
                                            width: 20,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {set.reps}
                                    </Text>{' '}
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            width: 51,
                                            textAlign: 'left',
                                        }}
                                    >
                                        {' ' + set.weight}кг
                                    </Text>
                                </Text>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};
