import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { CLoader } from '@/components/ui/CLoader';
import { Api } from '@/helpers/Api';
import { Storage } from '@/helpers/Storage';
import { CButton } from '@/components/ui/CButton';
import { useToastStore } from '@/store/toastStore';
import { useSystemStore } from '@/store/systemStore';

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 70,
        display: 'flex',
        alignItems: 'center',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        padding: 10,
        justifyContent: 'center',
    },
});

export default function Index() {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);
    const toastStore = useToastStore();
    const systemStore = useSystemStore();

    const checkToken = async () => {
        try {
            setLoading(true);
            const lsToken = await Storage.getData<string>(Storage.token);
            if (lsToken) {
                console.log('checkRes', 'bef');

                const checkRes = await Api.checkToken(lsToken);
                console.log('checkRes', checkRes);

                if (checkRes.isValid) {
                    router.replace('/(tabs)');
                }
            } else {
                router.replace('/login');
            }
        } catch (error) {
            toastStore.setError('Ошибка при инициализации: ' + error);
        } finally {
            setLoading(false);
        }
    };

    const goOffline = () => {
        systemStore.setOffline();
        router.replace('/(tabs)');
    };

    useEffect(() => {
        checkToken();
    }, []);

    return (
        <View style={styles.wrapper}>
            {!isLoading && (
                <View style={styles.buttons}>
                    <CButton onPress={checkToken}>Попробовать снова</CButton>
                    <CButton variant="success" onPress={goOffline}>
                        Оффлайн режим
                    </CButton>
                </View>
            )}
            {isLoading && <CLoader />}
        </View>
    );
}
