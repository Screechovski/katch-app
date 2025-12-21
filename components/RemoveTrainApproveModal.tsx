import { useTheme } from '@/components/ThemeProvider';
import { CButton } from '@/components/ui/CButton';
import { CInput } from '@/components/ui/CInput';
import { CModal } from '@/components/ui/CModal';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    visible: boolean;
    trainWeight?: number;
    onClose: () => void;
    onRemove: () => void;
}

export function RemoveTrainApproveModal({
    visible,
    trainWeight,
    onClose,
    onRemove,
}: Props) {
    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            borderRadius: 10,
            minWidth: 300,
        },
        title: {
            fontSize: 18,
            marginBottom: 10,
            color: theme?.colors.background.i8,
        },
        input: {
            marginBottom: 10,
        },
    });
    const [trainDate, setTrainDate] = useState('');

    const removeHandle = () => {
        if ((!trainWeight && trainDate === '') || trainWeight === +trainDate) {
            onRemove();
        }
    };

    useEffect(() => {
        setTrainDate('');
    }, [visible]);

    return (
        <CModal visible={visible} onHide={onClose}>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Для подтверждения, введите дату тренировки
                </Text>
                <CInput
                    style={styles.input}
                    placeholder=""
                    value={trainDate}
                    onInput={setTrainDate}
                />
                <CButton onPress={removeHandle} variant="error">
                    удалить
                </CButton>
            </View>
        </CModal>
    );
}
