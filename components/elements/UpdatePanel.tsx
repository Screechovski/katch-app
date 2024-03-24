import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { COLORS } from "../../theme";
import { StyleSheet, Text, View } from "react-native";
import { CButton } from "../ui/CButton";

const style = StyleSheet.create({
  wrap: {
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    backgroundColor: COLORS.primary.i50,
  },
  text: { marginBottom: 5 },
});

export function UpdatePanel() {
  const [hasUpdates, setHasUpdates] = useState(false);

  useEffect(() => {
    checkUpdates();
  }, []);

  async function checkUpdates() {
    const update = await Updates.checkForUpdateAsync();

    setHasUpdates(update.isAvailable);
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
