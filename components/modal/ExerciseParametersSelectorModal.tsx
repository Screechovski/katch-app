import { ExerciseParametersSelector } from '@/components/ExerciseParametersSelector';
import { CModal } from '@/shared/ui/CModal';
import { useModal } from '@/hooks/useModal';

export const ExerciseParametersSelectorModal = () => {
    const modal = useModal('exerciseParametersSelector');

    return (
        <CModal visible={modal.visible} onHide={modal.close} variant="workout">
            {modal.payload && (
                <ExerciseParametersSelector
                    exercisePhoto={modal.payload.exercisePhoto}
                    exerciseId={modal.payload.exerciseId}
                    exerciseName={modal.payload.exerciseName}
                    onComplete={modal.payload.onComplete}
                />
            )}
        </CModal>
    );
};
