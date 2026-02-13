import { useTheme } from '@/components/ThemeProvider';
import { CButton } from '@/components/ui/CButton';
import { CCheckbox } from '@/components/ui/CCheckbox';
import { CWrapper } from '@/components/ui/CWrapper';
import { Api } from '@/helpers/Api';
import { Storage } from '@/helpers/Storage';
import { useSettingsStore } from '@/store/settingsStore';
import { useToastStore } from '@/store/toastStore';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProfilePage() {
    const router = useRouter();
    const toastStore = useToastStore();
    const settingsStore = useSettingsStore();
    const theme = useTheme();

    const style = useMemo(
        () =>
            StyleSheet.create({
                userCard: {
                    borderRadius: 8,
                    padding: 8,
                    backgroundColor: theme?.colors.background.i3,
                    minHeight: 100,
                    display: 'flex',
                    gap: 10,
                },
            }),
        [theme?.theme],
    );

    const logout = () => {
        Storage.removeData(Storage.token);
        router.replace('/login');
    };

    const saveLocalTrains = async () => {
        try {
            const lsToken = await Storage.getData<string>(Storage.token);
            if (lsToken) {
                const trains = await Storage.getData<any[]>(Storage.trains);

                if (!trains) {
                    toastStore.setSuccess('Все данные сохранены');
                    return;
                }

                for (const train of trains) {
                    await Api.saveTrain(lsToken, train);
                    toastStore.setSuccess(`Тренировка ${train.date} сохранена`);
                }

                await Storage.removeData(Storage.trains);
                await checkLSTrains();
            } else {
                router.replace('/login');
            }
        } catch (error) {
            toastStore.setError(`Ошибка при сохранении тренировок: ` + error);
        }
    };

    const [hasStorageTrains, setHasStorageTrains] = useState(false);
    const checkLSTrains = async () => {
        try {
            const res = await Storage.getData(Storage.trains);
            setHasStorageTrains(!!res);
        } catch (error) {
            toastStore.setError(`Ошибка при проверки тренировок: ` + error);
        }
    };
    useEffect(() => {
        checkLSTrains();
    }, []);

    return (
        <CWrapper>
            <View style={style.userCard}>
                <CCheckbox
                    checked={theme?.theme === 'dark'}
                    onPress={() => theme?.toggleTheme()}
                >
                    Темная тема
                </CCheckbox>
                <CCheckbox
                    checked={settingsStore.isWeightAfterTrain}
                    onPress={() => settingsStore.toggle('isWeightAfterTrain')}
                >
                    Спрашивать вес в конце тренировки
                </CCheckbox>
                <CCheckbox
                    checked={settingsStore.isHistoryInExerciseSelector}
                    onPress={() =>
                        settingsStore.toggle('isHistoryInExerciseSelector')
                    }
                >
                    Показывать историю в выборе упражнения
                </CCheckbox>
                {hasStorageTrains && (
                    <CButton onPress={saveLocalTrains}>
                        Синхронизировать данные
                    </CButton>
                )}
                <CButton onPress={logout}>Выход</CButton>
            </View>
        </CWrapper>
    );
}
