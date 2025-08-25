import {StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import {HorizontalButtons} from '@/components/ui/СHorizontalButtons';

interface ExerciseParametersSelectorProps {
    exerciseName: string;
    onComplete: (params: {approach: number; repeat: number; weight: number}) => void;
}

export function ExerciseParametersSelector({
    exerciseName,
    onComplete,
}: ExerciseParametersSelectorProps) {
    const podh = [1, 2, 3, 4, 5, 6];
    const weight = [
        4, 5, 6, 7, 8, 9, 10, 13, 15, 17, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75,
        80, 85, 90, 95, 100,
    ];
    const repeats = [4, 6, 8, 10, 12, 15];

    const [selectedApproach, setSelectedApproach] = useState<number>(0);
    const [selectedWeight, setSelectedWeight] = useState<number>(0);
    const [selectedRepeats, setSelectedRepeats] = useState<number>(0);

    function onSelectApproach(num: number) {
        setSelectedApproach(num);
    }

    function onSelectWeight(num: number) {
        setSelectedWeight(num);
    }

    function onSelectRepeats(num: number) {
        setSelectedRepeats(num);
    }

    useEffect(() => {
        if (selectedApproach && selectedWeight && selectedRepeats) {
            onComplete({
                approach: selectedApproach,
                repeat: selectedRepeats,
                weight: selectedWeight,
            });
        }
    }, [selectedApproach, selectedWeight, selectedRepeats, onComplete]);

    return (
        <View>
            <Text style={styles.exercisesName}>{exerciseName}</Text>
            <View style={styles.line}>
                <Text style={styles.lineTitle}>Подходы</Text>
                <HorizontalButtons
                    selected={selectedApproach}
                    options={podh}
                    onSelect={onSelectApproach}
                />
            </View>
            <View style={styles.line}>
                <Text style={styles.lineTitle}>Повторения</Text>
                <HorizontalButtons
                    selected={selectedRepeats}
                    options={repeats}
                    onSelect={onSelectRepeats}
                />
            </View>
            <View style={styles.line}>
                <Text style={styles.lineTitle}>Вес</Text>
                <HorizontalButtons
                    selected={selectedWeight}
                    options={weight}
                    onSelect={onSelectWeight}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    exercisesName: {
        fontSize: 20,
        marginBottom: 5,
    },
    line: {
        marginBottom: 5,
    },
    lineTitle: {
        fontSize: 16,
        marginBottom: 2,
    },
});
