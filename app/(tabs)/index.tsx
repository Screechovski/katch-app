import { StyleSheet } from 'react-native';

import {CButton} from "@/components/ui/CButton";

export default function HomeScreen() {
    function onPress(){

    }

  return (
      <CButton onPress={onPress}>
          Добавить упр
      </CButton>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
