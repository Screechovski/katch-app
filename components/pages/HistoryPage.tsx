import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ITraining } from "../../entity/ITraining";
import { Colors } from "../../theme";
import { CButton } from "../ui/CButton";
import { TrainingCard } from "../elements/TrainingCard";
import { Database } from "../../database/database";

const style = StyleSheet.create({
  first: { marginBottom: 10, marginTop: 20 },
  list: {
    flexDirection: "column",
    gap: 10,
  },
  train: {
    padding: 5,
    backgroundColor: Colors.light.i5,
    borderRadius: 10,
  },
});

export function HistoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [trainings, setTrainings] = useState<ITraining[]>([]);
  const [clickCleanCount, setClickCleanCount] = useState(0);

  async function load() {
    setIsLoading(true);
    setTrainings(await Database.readTrainings());
    setIsLoading(false);
  }

  async function cleanDBClickHandler() {
    if (clickCleanCount < 2) {
      setClickCleanCount((v) => v + 1);
    } else {
      await Database.reset();
      load();
      setClickCleanCount(0);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const hasTrainings = useMemo(() => trainings.length > 0, [trainings]);

  const cleanText = useMemo(
    () => {
      if (clickCleanCount === 2){
        return 'Очистить базу'
      }

      return `Очистить базу (${(2 - clickCleanCount).toString()})`;
    },
    [clickCleanCount],
  );

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
        {cleanText}
      </CButton>

      <View style={style.list}>
        {hasTrainings &&
          trainings.map((tr) => (
            <TrainingCard
              key={tr.id}
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
