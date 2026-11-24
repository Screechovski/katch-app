import { useState } from 'react';
import type { SetStateAction } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExerciseCardVertical } from '@/entities/exercise';
import { HistoryCard } from '@/entities/train';
import { RemoveTrainApproveModal } from '@/components/modal/RemoveTrainApproveModal';
import type { TrainV2 } from '@/helpers/api/v2';
import { prettySetParams } from '@/helpers/PrettySetParams';
import { useModal } from '@/hooks/useModal';
import type { CurrentTrainExercise } from '@/store/currentTrainStore';
import { CWheelPicker } from '@/shared/ui/CWheelPicker';
import { Button, IconButton } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
import { workoutColors as colors, workoutFonts as fonts } from '@/shared/ui/workout/theme';

const exercises = ['Жим лёжа', 'Приседания', 'Тяга гантели'];
const exerciseCards = [
    { id: 4, name: 'Жим штанги стоя', photo: require('../assets/images/exercise/4.jpg') },
    { id: 51, name: 'Подтягивания широким хватом', photo: require('../assets/images/exercise/51.jpg') },
    { id: 63, name: 'Приседания в тренажёре', photo: require('../assets/images/exercise/63.jpg') },
];
const cardioCard = { id: 91, name: 'Беговая дорожка', photo: require('../assets/images/exercise/91.jpg') };
const historyExample: TrainV2 = {
    id: 1,
    date: '2026-11-24T12:00:00',
    difficulty: 'normal',
    userWeight: 78.5,
    exercises: exerciseCards.map(({ id, name }, index) => ({
        id,
        name,
        imageName: `${id}.jpg`,
        groups: [{ id: index + 1, level: 1 }],
        sets: 3,
        reps: index === 1 ? 8 : 10,
        weight: [35, 0, 60][index],
    })),
};
const approachOptions = Array.from({ length: 12 }, (_, index) => index + 1);
const repOptions = Array.from({ length: 30 }, (_, index) => index + 1);
const weightOptions = Array.from({ length: 49 }, (_, index) => index * 2.5);

function countReps(value: string) {
    const count = Number(value);
    return /^\d+$/.test(value.trim()) && Number.isSafeInteger(count) && count > 0 ? count : 0;
}

export default function UiPreview() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { bottom } = useSafeAreaInsets();

    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedExercises, setSelectedExercises] = useState([exercises[0]]);
    const [selectedCard, setSelectedCard] = useState<CurrentTrainExercise>();
    const [showHistoryExample, setShowHistoryExample] = useState(true);
    const [confirmHistoryRemoval, setConfirmHistoryRemoval] = useState(false);
    const [wheelApproaches, setWheelApproaches] = useState(3);
    const [wheelReps, setWheelReps] = useState(10);
    const [wheelWeight, setWheelWeight] = useState(60);
    const [savedWorkout, setSavedWorkout] = useState<number>();
    const parametersModal = useModal('exerciseParametersSelector');
    const workoutModal = useModal('weightInput');

    const weightValue = weight.trim().replace(',', '.');
    const weightValid = /^\d+(?:\.\d+)?$/.test(weightValue) && Number.isFinite(Number(weightValue));
    const repsCount = countReps(reps);
    const repsValid = repsCount > 0;
    const query = search.trim().toLowerCase();
    const matches = exercises.filter((exercise) => exercise.toLowerCase().includes(query));

    function changeReps(value: SetStateAction<string>) {
        setReps(value);
        setSubmitted(false);
    }

    function stepReps(step: number) {
        changeReps((current) => String(Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, countReps(current) + step))));
    }

    function openParameters(exercise: typeof cardioCard) {
        parametersModal.open({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            exercisePhoto: exercise.photo,
            onComplete: (params) => {
                setSelectedCard(params);
                parametersModal.close();
            },
        });
    }

    function openWorkoutSave(showWeight: boolean) {
        workoutModal.open({
            showWeight,
            onSave: (value) => {
                setSavedWorkout(value);
                workoutModal.close();
            },
        });
    }

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={[styles.content, { paddingBottom: Math.max(24, bottom + 16) }]}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.hero}>
                <View style={styles.heroCopy}>
                    <Text style={styles.brand}>Katchapp</Text>
                    <Text accessibilityRole="header" style={styles.title}>Компоненты</Text>
                    <Text style={styles.body}>Запишите подход или выберите упражнения.</Text>
                </View>
                <View style={[styles.heroIcon, width < 380 && styles.smallHeroIcon]}>
                    <MaterialCommunityIcons aria-hidden name="dumbbell" size={width < 380 ? 28 : 42} color={colors.mintDark} />
                </View>
            </View>

            <View style={styles.card}>
                <Text accessibilityRole="header" style={styles.cardTitle}>Сохранение тренировки</Text>
                <View style={styles.actions}>
                    <Button variant="secondary" onPress={() => openWorkoutSave(true)}>С весом</Button>
                    <Button variant="secondary" onPress={() => openWorkoutSave(false)}>Без веса</Button>
                </View>
                {savedWorkout !== undefined && (
                    <Text accessibilityLiveRegion="polite" style={styles.success}>
                        {savedWorkout ? `Пример сохранён · ${String(savedWorkout).replace('.', ',')} кг` : 'Пример сохранён без веса'}
                    </Text>
                )}
            </View>

            <View style={styles.historyExample}>
                <Text accessibilityRole="header" style={styles.cardTitle}>История тренировок</Text>
                {showHistoryExample ? (
                    <HistoryCard
                        train={historyExample}
                        remove={() => setConfirmHistoryRemoval(true)}
                        photoSource={(imageName) => exerciseCards.find(({ id }) => `${id}.jpg` === imageName)?.photo}
                    />
                ) : (
                    <Button variant="secondary" onPress={() => setShowHistoryExample(true)}>Вернуть пример</Button>
                )}
                <RemoveTrainApproveModal
                    visible={confirmHistoryRemoval}
                    trainDate={historyExample.date.substring(0, 10)}
                    onClose={() => setConfirmHistoryRemoval(false)}
                    onRemove={() => {
                        setShowHistoryExample(false);
                        setConfirmHistoryRemoval(false);
                    }}
                />
            </View>

            <View style={styles.card}>
                <View style={styles.heading}>
                    <View style={styles.icon}>
                        <MaterialCommunityIcons aria-hidden name="dumbbell" size={22} color={colors.mintDark} />
                    </View>
                    <View style={styles.headingCopy}>
                        <Text accessibilityRole="header" style={styles.cardTitle}>Каталог упражнений</Text>
                        {selectedCard !== undefined && (
                            <Text accessibilityLiveRegion="polite" style={styles.body}>
                                {selectedCard.name} · {prettySetParams(selectedCard)}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={styles.exerciseGrid}>
                    {exerciseCards.map((exercise) => (
                        <ExerciseCardVertical
                            key={exercise.id}
                            {...exercise}
                            style={styles.column}
                            onPress={() => openParameters(exercise)}
                        />
                    ))}
                </View>
                <Button variant="secondary" onPress={() => openParameters(cardioCard)}>Параметры кардио</Button>
            </View>

            <View style={[styles.panels, width >= 680 && styles.columns]}>
                <View style={[styles.card, styles.column]}>
                    <View style={styles.heading}>
                        <View style={styles.icon}>
                            <MaterialCommunityIcons aria-hidden name="clipboard-outline" size={22} color={colors.mintDark} />
                        </View>
                        <View style={styles.headingCopy}>
                            <Text accessibilityRole="header" style={styles.cardTitle}>Новый подход</Text>
                            <Text style={styles.body}>Жим лёжа</Text>
                        </View>
                    </View>
                    <View style={styles.columns}>
                        <View style={styles.column}>
                            <Input
                                label="Вес"
                                unit="кг"
                                type="decimal"
                                value={weight}
                                placeholder="60"
                                error={submitted && !weightValid ? 'Укажите вес' : undefined}
                                onChangeText={(value) => {
                                    setWeight(value);
                                    setSubmitted(false);
                                }}
                            />
                        </View>
                        <View style={styles.column}>
                            <Input
                                label="Повторения"
                                type="numeric"
                                value={reps}
                                placeholder="10"
                                error={submitted && !repsValid ? 'Укажите число от 1' : undefined}
                                onChangeText={changeReps}
                            />
                        </View>
                    </View>
                    <View style={styles.stepper}>
                        <Text style={[styles.body, styles.stepperLabel]}>Изменить число повторений</Text>
                        <IconButton
                            label="Уменьшить число повторений"
                            icon="minus"
                            variant="secondary"
                            disabled={repsCount <= 1}
                            onPress={() => stepReps(-1)}
                        />
                        <IconButton
                            label="Увеличить число повторений"
                            icon="plus"
                            disabled={repsCount === Number.MAX_SAFE_INTEGER}
                            onPress={() => stepReps(1)}
                        />
                    </View>
                    <View style={styles.actions}>
                        <Button icon="check" onPress={() => setSubmitted(true)}>Записать подход</Button>
                        <Button
                            variant="secondary"
                            onPress={() => {
                                setWeight('');
                                setReps('');
                                setSubmitted(false);
                            }}
                        >
                            Сбросить
                        </Button>
                    </View>
                    {submitted && weightValid && repsValid && (
                        <Text accessibilityLiveRegion="polite" style={styles.success}>
                            Подход записан в примере · {weight.trim()} кг × {reps.trim()}
                        </Text>
                    )}
                </View>

                <View style={[styles.card, styles.column]}>
                    <View style={styles.heading}>
                        <View style={styles.icon}>
                            <MaterialCommunityIcons aria-hidden name="magnify" size={22} color={colors.mintDark} />
                        </View>
                        <Text accessibilityRole="header" style={styles.cardTitle}>Упражнения</Text>
                    </View>
                    <Input
                        label="Поиск упражнения"
                        type="search"
                        value={search}
                        placeholder="Например, жим"
                        onChangeText={setSearch}
                    />
                    <View style={styles.exerciseOptions}>
                        {matches.map((exercise) => (
                            <Checkbox
                                key={exercise}
                                label={exercise}
                                checked={selectedExercises.includes(exercise)}
                                onCheckedChange={(checked) => setSelectedExercises((current) => (
                                    checked ? [...current, exercise] : current.filter((item) => item !== exercise)
                                ))}
                            />
                        ))}
                        {matches.length === 0 && (
                            <Text accessibilityLiveRegion="polite" style={styles.body}>Упражнения не найдены</Text>
                        )}
                    </View>
                    <Input label="Единицы измерения" value="Килограммы" disabled />
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.heading}>
                    <View style={styles.icon}>
                        <MaterialCommunityIcons aria-hidden name="tune-variant" size={22} color={colors.mintDark} />
                    </View>
                    <View style={styles.headingCopy}>
                        <Text accessibilityRole="header" style={styles.cardTitle}>Параметры упражнения</Text>
                        <Text accessibilityLiveRegion="polite" style={styles.body}>
                            {wheelApproaches} подх. × {wheelReps} повт. · {String(wheelWeight).replace('.', ',')} кг
                        </Text>
                    </View>
                </View>
                <View style={styles.columns}>
                    <View style={styles.wheelColumn}>
                        <Text style={styles.wheelLabel}>Подходы</Text>
                        <CWheelPicker variant="workout" list={approachOptions} value={wheelApproaches} onChange={setWheelApproaches} />
                    </View>
                    <View style={styles.wheelColumn}>
                        <Text style={styles.wheelLabel}>Повторения</Text>
                        <CWheelPicker variant="workout" list={repOptions} value={wheelReps} onChange={setWheelReps} />
                    </View>
                    <View style={styles.wheelColumn}>
                        <Text style={styles.wheelLabel}>Вес, кг</Text>
                        <CWheelPicker variant="workout" list={weightOptions} value={wheelWeight} onChange={setWheelWeight} />
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <Button variant="secondary" icon="arrow-left" onPress={() => router.replace('/')}>На главную</Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.canvas },
    content: { paddingHorizontal: 16, paddingTop: 24, gap: 16 },
    hero: {
        minHeight: 154,
        paddingHorizontal: 22,
        paddingVertical: 22,
        gap: 16,
        borderRadius: 24,
        backgroundColor: colors.mint,
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroCopy: { flex: 1, gap: 6 },
    heroIcon: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallHeroIcon: { width: 54, height: 54 },
    brand: { fontFamily: fonts.semibold, fontSize: 13, color: colors.mintDark },
    title: { fontFamily: fonts.semibold, fontSize: 29, lineHeight: 35, color: colors.ink },
    body: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 20, color: colors.muted },
    panels: { gap: 16, alignItems: 'stretch' },
    columns: { flexDirection: 'row', gap: 12 },
    column: { flex: 1, minWidth: 0 },
    wheelColumn: { flex: 1, minWidth: 0, gap: 8 },
    wheelLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink, textAlign: 'center' },
    card: {
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        padding: 18,
        gap: 18,
    },
    heading: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
    headingCopy: { flex: 1, gap: 2 },
    icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontFamily: fonts.semibold, fontSize: 18, color: colors.ink, flexShrink: 1 },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    stepperLabel: { flex: 1 },
    actions: { gap: 8 },
    exerciseOptions: { gap: 4 },
    exerciseGrid: { flexDirection: 'row', gap: 8 },
    historyExample: { gap: 12 },
    success: { fontFamily: fonts.medium, fontSize: 13, color: colors.mintDark },
    footer: { alignItems: 'flex-start' },
});
