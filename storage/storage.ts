// import StorageCreator from "react-native-storage";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { ITraining } from "../entity/ITraining";

const key = "key";
// const id = "keyId";
// const expires = 1000 * 60 * 60 * 24;

// const instance = new StorageCreator({
//   size: 1000,
//   storageBackend: AsyncStorage,
//   defaultExpires: expires,
//   enableCache: true,
//   sync: {},
// });

const store = new Map<string, ITraining>();

export class Storage {
  static save(data: ITraining) {
    store.set(key, data);
    // instance.save({
    //   key,
    //   id,
    //   data: data,
    //   expires,
    // });
  }

  static read() {
    // return instance.load<ITraining>({
    //   key,
    //   id,
    //   autoSync: true,
    //   syncInBackground: true,
    // });
    const data = store.get(key);

    if (data) {
      return data;
    }

    return undefined;
  }

  static clear() {
    store.delete(key);
  }
}
