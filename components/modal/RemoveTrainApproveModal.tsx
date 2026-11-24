import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { CModal } from '@/shared/ui/CModal';
import { workoutColors as colors, workoutFonts as fonts } from '@/shared/ui/workout/theme';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

interface Props {
    visible: boolean;
    trainDate?: string;
    onClose: () => void;
    onRemove: () => void;
}

export function RemoveTrainApproveModal({ visible, trainDate, onClose, onRemove }: Props) {
    const [enteredDate, setEnteredDate] = useState('');
    const { width } = useWindowDimensions();

    useEffect(() => {
        setEnteredDate('');
    }, [visible, trainDate]);

    return (
        <CModal visible={visible} onHide={onClose}>
            <View style={[styles.container, { width: Math.min(320, width - 48) }]}>
                <Text accessibilityRole="header" style={styles.title}>Удалить тренировку?</Text>
                <Input
                    label="Дата тренировки для подтверждения"
                    placeholder={trainDate}
                    value={enteredDate}
                    onChangeText={setEnteredDate}
                />
                <Button onPress={onRemove} disabled={enteredDate !== (trainDate ?? '')} variant="secondary">
                    Удалить
                </Button>
            </View>
        </CModal>
    );
}

const styles = StyleSheet.create({
    container: { gap: 14 },
    title: { fontFamily: fonts.semibold, fontSize: 18, color: colors.ink },
});
