import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { CModal } from '@/shared/ui/CModal';
import { CInput } from '@/shared/ui/CInput';
import { CButton } from '@/shared/ui/CButton';
import { CText } from '@/shared/ui/CText';
import { Storage } from '@/helpers/Storage';
import { ApiV2 } from '@/helpers/api/v2';
import type { TrainDifficulty } from '@/helpers/api/v2';
import { useModal } from '@/hooks/useModal';
import { useSettingsStore } from '@/store/settingsStore';
import { CHr } from '@/shared/ui/CHr';

const DIFFICULTIES: { value: TrainDifficulty; label: string }[] = [
    { value: 'easy', label: 'Легко' },
    { value: 'normal', label: 'Средне' },
    { value: 'hard', label: 'Тяжело' },
];

export function WeightInputModal() {
    const [weight, setWeight] = useState<string>('');
    const [difficulty, setDifficulty] = useState<TrainDifficulty>('normal');
    const modal = useModal('weightInput');
    const settingsStore = useSettingsStore();

    function handleSave() {
        const weightNumber = parseFloat(weight.replace(/,/gi, '.'));

        if (weight === '' || weightNumber > 0) {
            modal.payload?.onSave(weight === '' ? 0 : weightNumber, difficulty);
        }
    }

    function handleCancel() {
        setWeight('');
        setDifficulty('normal');
        modal.close();
    }

    const [userWeight, setUserWeight] = useState(0);
    const getWeights = async () => {
        try {
            const token = await Storage.getData<string>(Storage.token);

            if (token) {
                const res = await ApiV2.getUserWeight(token);
                setUserWeight(res[0].weight);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (!modal.visible) return;
        setDifficulty('normal');
        if (!settingsStore.isWeightAfterTrain) return;
        getWeights();
    }, [modal.visible, settingsStore.isWeightAfterTrain]);

    return (
        <CModal visible={modal.visible} onHide={handleCancel}>
            <View style={styles.container}>
                {settingsStore.isWeightAfterTrain && (
                    <View>
                        <CInput
                            style={styles.input}
                            value={weight}
                            onInput={setWeight}
                            placeholder="Вес после тренировки (кг)"
                            type="number"
                        />
                        {!!userWeight && (
                            <CText variant="text-small">{`Последний вес: ${userWeight}кг`}</CText>
                        )}
                        <CHr />
                    </View>
                )}

                <CText variant="text">Насколько тяжело далась тренировка?</CText>
                <View style={styles.difficultyRow}>
                    {DIFFICULTIES.map((item) => (
                        <CButton
                            key={item.value}
                            style={styles.difficultyButton}
                            variant={difficulty === item.value ? 'success' : 'primary'}
                            onPress={() => setDifficulty(item.value)}
                        >
                            {item.label}
                        </CButton>
                    ))}
                </View>

                <CButton style={styles.button} variant="success" onPress={handleSave}>
                    Сохранить
                </CButton>
            </View>
        </CModal>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        minWidth: 300,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 2,
    },
    difficultyRow: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 4,
    },
    difficultyButton: {
        flex: 1,
        paddingHorizontal: 4,
    },
    button: {
        marginTop: 8,
    },
});
