import { ExerciseParametersSelector } from '@/components/ExerciseParametersSelector';
import { CModal } from '@/components/ui/CModal';
import { Api } from '@/helpers/api/v1';
import { useModal } from '@/hooks/useModal';

export const ExerciseParametersSelectorModal = () => {
    const modal = useModal('exerciseParametersSelector');

    return (
        <CModal visible={modal.visible} onHide={modal.close}>
            {modal.payload && (
                <ExerciseParametersSelector
                    exercisePhoto={{
                        uri: Api.getPhotoUrl(modal.payload.imageName),
                    }}
                    exerciseId={modal.payload.exerciseId}
                    exerciseName={modal.payload.exerciseName}
                    onComplete={modal.payload.onComplete}
                />
            )}
        </CModal>
    );
};
