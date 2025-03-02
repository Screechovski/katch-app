import AsyncStorage from '@react-native-async-storage/async-storage';

export class Storage {
    static async saveData(key: string, value: any) {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    }

    static async getData<T>(key: string) {
        const value = await AsyncStorage.getItem(key);

        if (value !== null) {
            return JSON.parse(value) as T;
        }

        return null;
    }

    static async removeData(key: string) {
        await AsyncStorage.removeItem(key);
    }
}
