import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { CButton } from '@/components/ui/CButton';
import { WeightInputModal } from '@/components/WeightInputModal';
import { useSystemStore } from '@/store/systemStore';
import { useSettingsStore } from '@/store/settingsStore';

interface CurrentTraintSaveButtonProps {
    onSave: (weight?: number) => void;
}

export function CurrentTraintSaveButton({
    onSave,
}: CurrentTraintSaveButtonProps) {
    const [showWeightModal, setShowWeightModal] = useState(false);
    const systemStore = useSystemStore();
    const settingsStore = useSettingsStore();

    function handleSavePress() {
        if (settingsStore.isWeightAfterTrain) {
            setShowWeightModal(true);
        } else {
            onSave();
        }
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
                variant="success"
                style={styles.save}
                onPress={handleSavePress}
            >
                {systemStore.isOffline ? 'Сохранить в очередь' : 'Сохранить'}
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
