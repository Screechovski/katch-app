import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { CButton } from '@/components/ui/CButton';
import { WeightInputModal } from '@/components/WeightInputModal';

interface CurrentTraintSaveButtonProps {
    onSave: (weight?: number) => void;
}

export function CurrentTraintSaveButton({
    onSave,
}: CurrentTraintSaveButtonProps) {
    const [showWeightModal, setShowWeightModal] = useState(false);

    function handleSavePress() {
        setShowWeightModal(true);
    }

    function handleWeightSave(weight: number) {
        onSave(weight);
    }

    function handleWeightCancel() {
        setShowWeightModal(false);
    }

    return (
        <>
            <CButton
                variant={'success'}
                style={styles.save}
                onPress={handleSavePress}
            >
                Сохранить
            </CButton>

            <WeightInputModal
                visible={showWeightModal}
                onClose={handleWeightCancel}
                onSave={handleWeightSave}
            />
        </>
    );
}

const styles = StyleSheet.create({
    save: {
        marginBottom: 10,
    },
});
