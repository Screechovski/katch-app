import { CLoader } from "@/components/ui/CLoader";
import { ExercisesServer } from "@/hooks/useExercises";
import { Train } from "@/hooks/useTrains";
import { useMemo } from "react";
import { FlatList, Text, useWindowDimensions } from "react-native";
import { ExerciseCardVertical } from "./ExerciseCardVertical";

interface Props {
  count: number;
  exercises: ExercisesServer[];
  onPress(item: ExercisesServer): void;
  trainsList: Train[];
  loading: boolean;
}

export function ExerciseList(props: Props) {
  const { width } = useWindowDimensions();

  const count = useMemo(() => {
    if (props.count) {
      return props.count;
    }

    return 3;
  }, [props.count]);

  function pressHandler(item: ExercisesServer) {
    if ("onPress" in props && typeof props.onPress === "function") {
      props.onPress(item);
    }
  }

  function sortObjectsByOccurrences<T extends Record<"id", number>>(
    objects: T[],
    ids: number[]
  ): T[] {
    const idCounts = ids.reduce((counts: any, id) => {
      counts[id] = (counts[id] || 0) + 1;
      return counts;
    }, {});

    return objects.sort((a, b) => {
      const countA = idCounts[a.id] || 0;
      const countB = idCounts[b.id] || 0;
      return countB - countA;
    });
  }

  const sortedExercises = useMemo(
    () =>
      sortObjectsByOccurrences(
        props.exercises,
        props.trainsList
          .map((item) => item.exercises.map((ex) => ex.exercise))
          .flat()
      ),
    [props.exercises, props.trainsList]
  );

  const itemWidth = width / count; // Вычисляем ширину элемента

  if (props.loading) {
    return <CLoader />;
  }

  if (props.exercises.length === 0) {
    return (
      <Text
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        Пусто
      </Text>
    );
  }

  return (
    <FlatList
      data={sortedExercises}
      renderItem={({ item }) => (
        <ExerciseCardVertical
          onPress={() => pressHandler(item)}
          style={{ width: itemWidth }}
          photo={{
            uri: `http://localhost:8080/image/exercise/${item.imageName}`,
          }}
          name={item.name}
          id={item.id}
        />
      )}
      numColumns={count}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={{
        justifyContent: "space-between",
      }}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
    />
  );
}
