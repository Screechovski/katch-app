import { useTheme } from '@/components/ThemeProvider';
import { CButton } from '@/components/ui/CButton';
import { CCheckbox } from '@/components/ui/CCheckbox';
import { CWrapper } from '@/components/ui/CWrapper';
import { Api } from '@/helpers/Api';
import { Storage } from '@/helpers/Storage';
import { useSystemStore } from '@/store/systemStore';
import { useToastStore } from '@/store/toastStore';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProfilePage() {
    const router = useRouter();
    const toastStore = useToastStore();
    const systemStore = useSystemStore();

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
            } else {
                router.replace('/login');
            }
        } catch (error) {
            toastStore.setError(`Ошибка при сохранении тренировок: ` + error);
        }
    };

    return (
        <CWrapper>
            <View style={style.userCard}>
                <CCheckbox
                    checked={theme?.theme === 'dark'}
                    onPress={() => theme?.toggleTheme()}
                >
                    Темная тема
                </CCheckbox>
                {systemStore.isOffline && (
                    <CButton onPress={saveLocalTrains}>
                        Синхронизировать данные
                    </CButton>
                )}
                <CButton onPress={logout}>Выход</CButton>
            </View>
        </CWrapper>
    );
}
