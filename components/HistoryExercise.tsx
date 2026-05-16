import { useTheme } from '@/components/ThemeProvider';
import { Api } from '@/helpers/api/v1';
import { prettyDate } from '@/helpers/PrettyDate';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
    trains: Awaited<ReturnType<typeof Api.exerciseHistory>>['trains'];
};

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
                {(props.trains || []).map((train) => (
                    <View style={styles.item} key={train.trainId}>
                        <View style={styles.dot}></View>
                        <Text style={styles.date}>{prettyDate(train.trainDate)}</Text>
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
                                            width: 55,
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
