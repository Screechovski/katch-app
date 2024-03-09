import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Routes } from "./router/router";
import { MainPage } from "./components/pages/MainPage";
import { TrainingPage } from "./components/pages/TrainingPage";
import { ITraining } from "./entity/Training";
import { HistoryPage } from "./components/pages/HistoryPage";
import { CWrapper } from "./components/ui/CWrapper";
import { Menu } from "./components/elements/Menu";

export default function App() {
  const [page, setPage] = useState(Routes.CREATE_TRAINING);
  const [trains, setTrains] = useState<ITraining[]>([]);

  function saveTraining(training: ITraining) {
    setTrains((prev) => [...prev, training]);
    setPage(Routes.VIEW_TRAINS)
  }

  return (
    <>
      <StatusBar style="dark" />

      <CWrapper>
        {page === Routes.CREATE_TRAINING && (
          <TrainingPage saveTraining={saveTraining} />
        )}
        {page === Routes.VIEW_TRAINS && <HistoryPage trains={trains} />}
      </CWrapper>

      <Menu setPage={setPage} page={page} />
    </>
  );
}
