// app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';
import { CLoader } from '@/components/ui/CLoader';
import { Api } from '@/helpers/Api';
import { Storage } from '@/helpers/Storage';

export default function Index() {
    const router = useRouter();

    const checkToken = async () => {
        try {
            const lsToken = await Storage.getData<string>(Storage.token);

            if (lsToken) {
                const checkRes = await Api.checkToken(lsToken);

                if (checkRes.isValid) {
                    router.replace('/(tabs)');
                }
            }
        } catch (error) {
            Alert.alert('Ошибка при инициализации: ' + error);
        }
    };

    useEffect(() => {
        checkToken();
    }, []);

    return (
        <View>
            <CLoader />
        </View>
    );
}
