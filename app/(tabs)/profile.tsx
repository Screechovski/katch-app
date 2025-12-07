import { CButton } from '@/components/ui/CButton';
import { CWrapper } from '@/components/ui/CWrapper';
import { Colors } from '@/constants/Theme';
import { Api } from '@/helpers/Api';
import { Storage } from '@/helpers/Storage';
import { useToastStore } from '@/store/toastStore';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function ProfilePage() {
    const router = useRouter();
    const toastStore = useToastStore();

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
                <CButton onPress={saveLocalTrains}>
                    Синхронизировать данные
                </CButton>
                <CButton onPress={logout}>Выход</CButton>
            </View>
        </CWrapper>
    );
}

const style = StyleSheet.create({
    userCard: {
        borderRadius: 8,
        padding: 8,
        backgroundColor: Colors.light.i2,
        minHeight: 100,
        display: 'flex',
        gap: 10,
    },
});
