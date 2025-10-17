import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { CModal } from '@/components/ui/CModal';
import { CInput } from '@/components/ui/CInput';
import { CButton } from '@/components/ui/CButton';

interface WeightInputModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (weight: number) => void;
}

export function WeightInputModal({
    visible,
    onClose,
    onSave,
}: WeightInputModalProps) {
    const [weight, setWeight] = useState<string>('');

    function handleSave() {
        const weightNumber = parseFloat(weight);

        if (!isNaN(weightNumber) && weightNumber > 0) {
            onSave(weightNumber);
            setWeight('');
            onClose();
        }
    }

    function handleCancel() {
        setWeight('');
        onClose();
    }

    return (
        <CModal visible={visible} onHide={handleCancel}>
            <View style={styles.container}>
                <CInput
                    style={styles.input}
                    value={weight}
                    onInput={setWeight}
                    placeholder="Вес после тренировки (кг)"
                    type="number"
                />
                <CButton variant="success" onPress={handleSave}>
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
        marginBottom: 20,
    },
});
