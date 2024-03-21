import StorageCreator from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ITraining } from "../entity/ITraining";

const key = "key";
const id = "keyId";
const expires = 1000 * 60 * 60 * 24;

const instance = new StorageCreator({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: expires,
  enableCache: true,
  sync: {},
});

export const Storage = {
  save(data: ITraining) {
    instance.save({
      key,
      id,
      data: data,
      expires,
    });
  },
  read() {
    return instance.load<ITraining>({
      key,
      id,
      autoSync: true,
      syncInBackground: true,
    });
  },
  clear() {
    instance.remove({ key, id });
  },
};
