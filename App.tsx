import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Database } from "./database/database";
import { Routes } from "./router/router";
import { TrainingPage } from "./components/pages/TrainingPage";
import { HistoryPage } from "./components/pages/HistoryPage";
import { CWrapper } from "./components/ui/CWrapper";
import { Menu } from "./components/elements/Menu";
import { removeDublicatest, updateCounts } from "./entity/IExercise";
import { CButton } from "./components/ui/CButton";
import { COLORS } from "./theme";

export default function App() {
  const [page, setPage] = useState(Routes.CREATE_TRAINING);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUpdates, setHasUpdates] = useState(false);

  async function onMounted() {
    setIsLoading(true);
    await Database.init();
    updateCounts(removeDublicatest(await Database.getExercisesCounts()));
    setIsLoading(false);

    const update = await Updates.checkForUpdateAsync();

    setHasUpdates(update.isAvailable);
  }

  async function update(){
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  }

  useEffect(() => {
    onMounted();

    return () => {};
  }, []);

  return (
    <>
      <StatusBar style="dark" />

      {hasUpdates && (
        <View
          style={{
            paddingTop: 20,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 15,
            backgroundColor: COLORS.primary.i50,
          }}
        >
          <Text style={{ marginBottom: 5 }}>Доступно обновление</Text>
          <CButton variant="success" onPress={update}>
            Обновить
          </CButton>
        </View>
      )}

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
