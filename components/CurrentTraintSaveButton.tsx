import { StyleSheet } from 'react-native';
import { Button } from '@/shared/ui/Button';
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
        <Button style={styles.save} onPress={handleSavePress}>
            {systemStore.isOffline ? 'Сохранить в очередь' : 'Сохранить'}
        </Button>
    );
}

const styles = StyleSheet.create({
    save: {
        marginBottom: 10,
    },
});
