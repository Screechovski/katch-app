import { StyleSheet, Text, View } from "react-native";
import { ITraining } from "../../entity/Training";
import { useEffect, useMemo, useState } from "react";
import { COLORS } from "../../theme";
import { getTraining } from "../../database";
import { getExerciseById } from "../../entity/PhysicalExercise";
import { CButton } from "../ui/CButton";
import { SQLResultSet } from "expo-sqlite";
import { TrainingCard } from "../elements/TrainingCard";

interface DBRow {
  name: string;
  date: Date;
  id: number;
  id_exercise: number;
  approach: number;
  repetitions: number;
  weight: number;
}

interface Props {
  cleanHistory(): Promise<void>;
}

const style = StyleSheet.create({
  first: { marginBottom: 10, marginTop: 20 },
  list: {
    flexDirection: "column",
    gap: 10,
  },
  train: {
    padding: 5,
    backgroundColor: COLORS.light.i5,
    borderRadius: 10,
  },
});

export function HistoryPage(props: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [trainings, setTrainings] = useState<ITraining[]>([]);
  const [clickCleanCount, setClickCleanCount] = useState(0);

  function readDbRows(sqlRes: SQLResultSet) {
    const res: DBRow[] = [];

    for (let i = 0; i < sqlRes.rows.length; i++) {
      const item = sqlRes.rows.item(i);

      res.push({
        name: item.name,
        date: new Date(item.date),
        id: item.id,
        id_exercise: item.id_exercise,
        approach: item.approach,
        repetitions: item.repetitions,
        weight: item.weight,
      });
    }

    return res;
  }

  function flatTrainingObject(object: any) {
    return Object.values(object).map((tr: any) => ({
      ...tr,
      exercises: Object.values(tr.exercises),
    })) as ITraining[];
  }

  // FIXME refactor thi shit
  async function loadAndConvertTrainings() {
    const dbRes = await getTraining();

    const dbRows = readDbRows(dbRes);

    const res: any = {};

    dbRows.forEach((item) => {
      if (res[item.id] === undefined) {
        res[item.id] = {
          id: item.id,
          date: item.date,
          name: item.name,
          exercises: {},
        };
      }

      if (res[item.id].exercises[item.id_exercise] === undefined) {
        res[item.id].exercises[item.id_exercise] = {
          id: item.id_exercise,
          name: getExerciseById(item.id_exercise)!.name,
          photo: getExerciseById(item.id_exercise)!.photo,
          approuch: [],
        };
      }

      res[item.id].exercises[item.id_exercise].approuch.push({
        approaches: item.approach,
        repetitions: item.repetitions,
        weight: item.weight,
      });
    });

    return flatTrainingObject(res).reverse();
  }

  async function load() {
    setIsLoading(true);
    const dbRows = await loadAndConvertTrainings();

    setTrainings(dbRows);
    setIsLoading(false);
  }

  async function cleanDBClickHandler() {
    if (clickCleanCount < 2) {
      setClickCleanCount((v) => v + 1);
    } else {
      await props.cleanHistory();
      load();
      setClickCleanCount(0);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const hasTrainings = useMemo(() => trainings.length > 0, [trainings]);

  if (isLoading) {
    return <Text style={style.first}>Loading...</Text>;
  }

  return (
    <>
      <CButton
        style={style.first}
        onPress={cleanDBClickHandler}
        variant="error"
      >
        Очистить базу
      </CButton>

      <View style={style.list}>
        {hasTrainings &&
          trainings.map((tr) => (
            <TrainingCard
              name={tr.name}
              date={tr.date}
              exercises={tr.exercises}
            />
          ))}
      </View>
      {!hasTrainings && <Text>Нет тренировок</Text>}
    </>
  );
}
