import { StyleSheet } from 'react-native';
import { CButton } from '@/shared/ui/CButton';
import { useSystemStore } from '@/store/systemStore';
import { useModal } from '@/hooks/useModal';
import type { TrainDifficulty } from '@/helpers/api/v2';

interface CurrentTraintSaveButtonProps {
    onSave: (weight: number, difficulty: TrainDifficulty | null) => void;
}

export function CurrentTraintSaveButton({ onSave }: CurrentTraintSaveButtonProps) {
    const systemStore = useSystemStore();
    const modal = useModal('weightInput');

    function handleSavePress() {
        modal.open({ onSave });
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
