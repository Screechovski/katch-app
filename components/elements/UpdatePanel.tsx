import * as Updates from "expo-updates";
import React, { useEffect, useState } from "react";
import { Colors } from "../../theme";
import { StyleSheet, Text, View } from "react-native";
import { CButton } from "../ui/CButton";

const style = StyleSheet.create({
  wrap: {
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    backgroundColor: Colors.primary.i50,
  },
  text: { marginBottom: 5 },
});

export function UpdatePanel() {
  const [hasUpdates, setHasUpdates] = useState(false);
  let intervalId: NodeJS.Timeout;

  useEffect(() => {
    intervalId = setInterval(() => {
      checkUpdates();
    }, 10_000);

    return () => clearInterval(intervalId);
  }, []);

  async function checkUpdates() {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      setHasUpdates(true);
      clearInterval(intervalId);
    }
  }

  async function update() {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  }

  if (hasUpdates) {
    return (
      <View style={style.wrap}>
        <Text style={style.text}>Доступно обновление</Text>
        <CButton variant="success" onPress={update}>
          Обновить
        </CButton>
      </View>
    );
  }

  return <></>;
}
