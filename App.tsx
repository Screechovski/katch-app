import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Database } from "./database/database";
import { Routes } from "./router/router";
import { TrainingPage } from "./components/pages/TrainingPage";
import { HistoryPage } from "./components/pages/HistoryPage";
import { CWrapper } from "./components/ui/CWrapper";
import { Menu } from "./components/elements/Menu";
import { removeDublicatest, updateCounts } from "./entity/IExercise";
import { UpdatePanel } from "./components/elements/UpdatePanel";

export default function App() {
  const [page, setPage] = useState(Routes.CREATE_TRAINING);
  const [isLoading, setIsLoading] = useState(false);

  async function initDatabase() {
    await Database.init();
    const exerciseCounts = await Database.getExercisesCounts();
    updateCounts(removeDublicatest(exerciseCounts));
  }

  async function onMounted() {
    try {
      setIsLoading(true);
      await initDatabase();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    onMounted();

    return () => {};
  }, []);

  return (
    <>
      <StatusBar style="dark" />

      <UpdatePanel />

      <CWrapper>
        {isLoading && <Text>Database initing ...</Text>}
        {!isLoading && (
          <>
            {page === Routes.CREATE_TRAINING && (
              <TrainingPage callback={() => setPage(Routes.VIEW_TRAINS)} />
            )}
            {page === Routes.VIEW_TRAINS && <HistoryPage />}
          </>
        )}
      </CWrapper>

      <Menu setPage={setPage} page={page} />
    </>
  );
}
