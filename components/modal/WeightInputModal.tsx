import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { CModal } from '@/components/ui/CModal';
import { CInput } from '@/components/ui/CInput';
import { CButton } from '@/components/ui/CButton';
import { CText } from '@/components/ui/CText';
import { Storage } from '@/helpers/Storage';
import { ApiV2 } from '@/helpers/api/v2';
import { useModal } from '@/hooks/useModal';

export function WeightInputModal() {
    const [weight, setWeight] = useState<string>('');
    const modal = useModal('weightInput');

    function handleSave() {
        const weightNumber = parseFloat(weight.replace(/,/gi, '.'));

        if (weight === '' || weightNumber > 0) {
            modal.payload?.setWeight(weight === '' ? 0 : weightNumber);
        }
    }

    function handleCancel() {
        setWeight('');
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
        if (modal.visible) {
            getWeights();
        }
    }, [modal.visible]);

    return (
        <CModal visible={modal.visible} onHide={handleCancel}>
            <View style={styles.container}>
                <CInput
                    style={styles.input}
                    value={weight}
                    onInput={setWeight}
                    placeholder="Вес после тренировки (кг)"
                    type="number"
                />
                {userWeight && (
                    <CText variant="text-small">{`Последний вес: ${userWeight}кг`}</CText>
                )}
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
    button: {
        marginTop: 8,
    },
});
