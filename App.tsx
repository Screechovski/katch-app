import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Routes } from "./router/router";
import { TrainingPage } from "./components/pages/TrainingPage";
import { ITraining } from "./entity/Training";
import { HistoryPage } from "./components/pages/HistoryPage";
import { CWrapper } from "./components/ui/CWrapper";
import { Menu } from "./components/elements/Menu";
import { resetDatabase, initDatabase, saveTraining } from "./database";
import { Text } from "react-native";

export default function App() {
  const [page, setPage] = useState(Routes.CREATE_TRAINING);
  const [isLoading, setIsLoading] = useState(false);

  async function saveHandler(training: ITraining) {
    setIsLoading(true);
    await saveTraining(training);
    setPage(Routes.VIEW_TRAINS);
    setIsLoading(false);
  }

  async function onMounted() {
    setIsLoading(true);
    await initDatabase();
    setIsLoading(false);
  }

  useEffect(() => {
    onMounted();

    return () => {};
  }, []);

  return (
    <>
      <StatusBar style="dark" />

      <CWrapper>
        {isLoading && <Text>Database initing ...</Text>}
        {!isLoading && (
          <>
            {page === Routes.CREATE_TRAINING && (
              <TrainingPage saveTraining={saveHandler} />
            )}
            {page === Routes.VIEW_TRAINS && (
              <HistoryPage cleanHistory={resetDatabase} />
            )}
          </>
        )}
      </CWrapper>

      <Menu setPage={setPage} page={page} />
    </>
  );
}
