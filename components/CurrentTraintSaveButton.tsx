import { StyleSheet } from 'react-native';
import { CButton } from '@/components/ui/CButton';
import { useSystemStore } from '@/store/systemStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useModal } from '@/hooks/useModal';

interface CurrentTraintSaveButtonProps {
    onSave: (weight: number) => void;
}

export function CurrentTraintSaveButton({ onSave }: CurrentTraintSaveButtonProps) {
    const systemStore = useSystemStore();
    const settingsStore = useSettingsStore();
    const modal = useModal('weightInput');

    function handleSavePress() {
        if (settingsStore.isWeightAfterTrain) {
            modal.open({ setWeight: onSave });
        } else {
            onSave(0);
        }
    }

    return (
        <CButton variant="success" style={styles.save} onPress={handleSavePress}>
            {systemStore.isOffline ? 'Сохранить в очередь' : 'Сохранить'}
        </CButton>
    );
}

const styles = StyleSheet.create({
    save: {
        marginBottom: 10,
    },
});
