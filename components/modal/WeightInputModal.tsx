import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/shared/ui/Button';
import { CModal } from '@/shared/ui/CModal';
import { Input } from '@/shared/ui/Input';
import { workoutColors as colors, workoutFonts as fonts } from '@/shared/ui/workout/theme';
import { Storage } from '@/helpers/Storage';
import { ApiV2 } from '@/helpers/api/v2';
import type { TrainDifficulty } from '@/helpers/api/v2';
import { useModal } from '@/hooks/useModal';
import { useSettingsStore } from '@/store/settingsStore';

const DIFFICULTIES = [
    { value: 'easy', label: 'Легко', icon: 'feather' },
    { value: 'normal', label: 'Средне', icon: 'equalizer-outline' },
    { value: 'hard', label: 'Тяжело', icon: 'fire' },
] as const;

export function WeightInputModal() {
    const modal = useModal('weightInput');
    const askWeight = useSettingsStore((state) => state.isWeightAfterTrain);

    return (
        <CModal visible={modal.visible} onHide={modal.close} variant="workout">
            {modal.payload && (
                <WorkoutSaveForm
                    showWeight={modal.payload.showWeight ?? askWeight}
                    onSave={modal.payload.onSave}
                />
            )}
        </CModal>
    );
}

type FormProps = {
    showWeight: boolean;
    onSave: (weight: number, difficulty: TrainDifficulty) => void;
};

function WorkoutSaveForm({ showWeight, onSave }: FormProps) {
    const [weight, setWeight] = useState('');
    const [lastWeight, setLastWeight] = useState<number>();
    const [difficulty, setDifficulty] = useState<TrainDifficulty>('normal');
    const enteredWeight = weight.trim();
    const weightNumber = enteredWeight === '' ? 0 : parseFloat(enteredWeight.replace(',', '.'));
    const invalidWeight = showWeight && enteredWeight !== ''
        && (!Number.isFinite(weightNumber) || weightNumber <= 0);

    useEffect(() => {
        if (!showWeight) return;

        let active = true;

        async function loadLastWeight() {
            try {
                const token = await Storage.getData<string>(Storage.token);
                if (!token) return;
                const [latest] = await ApiV2.getUserWeight(token);
                if (active) setLastWeight(latest?.weight);
            } catch (error) {
                console.log(error);
            }
        }

        void loadLastWeight();
        return () => {
            active = false;
        };
    }, [showWeight]);

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <View style={styles.icon}>
                    <MaterialCommunityIcons aria-hidden name="clipboard-check-outline" size={23} color={colors.mintDark} />
                </View>
                <Text accessibilityRole="header" style={styles.title}>Сохранить тренировку</Text>
            </View>

            {showWeight && (
                <View style={styles.section}>
                    <Input
                        label="Вес после тренировки"
                        unit="кг"
                        placeholder="Необязательно"
                        value={weight}
                        onChangeText={setWeight}
                        type="decimal"
                        error={invalidWeight ? 'Введите вес больше нуля' : undefined}
                        clearable
                    />
                    {!!lastWeight && (
                        <Text style={styles.detail}>Последний вес · {String(lastWeight).replace('.', ',')} кг</Text>
                    )}
                </View>
            )}

            <View style={styles.section}>
                <Text accessibilityRole="header" style={styles.sectionTitle}>Как далась тренировка?</Text>
                <View style={styles.difficultyRow}>
                    {DIFFICULTIES.map(({ value, label, icon }) => (
                        <Button
                            key={value}
                            icon={icon}
                            selected={difficulty === value}
                            variant={difficulty === value ? 'primary' : 'secondary'}
                            style={styles.difficultyButton}
                            onPress={() => setDifficulty(value)}
                        >
                            {label}
                        </Button>
                    ))}
                </View>
            </View>

            <Button icon="check" disabled={invalidWeight} onPress={() => onSave(showWeight ? weightNumber : 0, difficulty)}>
                Сохранить
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flexGrow: 0, flexShrink: 1 },
    form: { gap: 16 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 16,
        padding: 10,
        backgroundColor: colors.canvas,
    },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.mint,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { flexShrink: 1, fontFamily: fonts.semibold, fontSize: 18, color: colors.ink },
    section: { gap: 8 },
    sectionTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
    detail: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
    difficultyRow: { flexDirection: 'row', gap: 6 },
    difficultyButton: {
        flex: 1,
        minWidth: 0,
        minHeight: 60,
        flexDirection: 'column',
        gap: 4,
        paddingHorizontal: 4,
    },
});
