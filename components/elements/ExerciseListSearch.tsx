import {StyleSheet, Text, View} from "react-native";
import {ExerciseList} from "./ExerciseList";
import {useMemo, useState} from "react";
import {getExercises, IExercise} from "@/assets/entity/IExercise";
import {CInput} from "@/components/ui/CInput";

interface Props {
    count: number;

    onSelect(item: IExercise): void;
}

const ExerciseListSearchStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    input: {marginBottom: 15},
    emptyText: {
        width: "100%",
        textAlign: "center",
    },
});

export function ExerciseListSearch(props: Props) {
    const [searchValue, setSearchValue] = useState<string>("");
    const exercises = getExercises();

    const filteredExercises = useMemo<IExercise[]>(() => {
        const searchValueLower = searchValue.toLowerCase();

        return exercises.filter((ex) => {
            const nameLower = ex.name.toLowerCase();

            // TODO улучшить поиск
            //   const nameLowerSplited = nameLower.split(' ');
            //   const searchLowerSplited = searchValueLower.trim().split(' ');
            //   nameLowerSplited.findIndex((word) => {
            //     searchLowerSplited.findIndex(_word => _word === word)
            //   })

            return nameLower.includes(searchValueLower);
        });
    }, [searchValue]);

    return (
        <View style={ExerciseListSearchStyle.wrap}>
            <CInput
                style={ExerciseListSearchStyle.input}
                value={searchValue}
                onInput={setSearchValue}
                placeholder="Поиск"
            />

            {filteredExercises.length > 0 && (
                <ExerciseList
                    exercises={filteredExercises}
                    count={3}
                    onPress={props.onSelect}
                />
            )}

            {filteredExercises.length === 0 && (
                <Text style={ExerciseListSearchStyle.emptyText}>Пусто</Text>
            )}
        </View>
    );
}
