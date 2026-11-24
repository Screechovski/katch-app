import { Button } from '@/shared/ui/Button';
import { CInformer } from '@/shared/ui/CInformer';
import { Input } from '@/shared/ui/Input';
import { CLoader } from '@/shared/ui/CLoader';
import { ApiV2 } from '@/helpers/api/v2';
import { Storage } from '@/helpers/Storage';
import { useSystemStore } from '@/store/systemStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
    onToken(): void;
}

const styles = StyleSheet.create({
    buttons: {
        display: 'flex',
        gap: 10,
    },
});

export function UserTokenForm(props: Props) {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const systemStore = useSystemStore();
    // TODO добавить diabled для кнопки

    const checkToken = async () => {
        try {
            if (token.trim() !== '') {
                setLoading(true);
                const res = await ApiV2.checkToken(token);

                if (res.isValid) {
                    Storage.saveData(Storage.token, token);
                    props.onToken();
                } else {
                    // TODO создать кэш-список для некорректных токенов
                    setError('Неверный токен');
                }
            }
        } catch (error) {
            setError('Ошибка при проверке токена: ' + error);
            console.warn(error);
        } finally {
            setLoading(false);
        }
    };

    const goOffline = () => {
        systemStore.setOffline();
        router.replace('/(tabs)');
    };

    return (
        <View
            style={{
                flexDirection: 'column',
                gap: 10,
            }}
        >
            <Input
                label="Введите токен пользователя"
                placeholder="Введите токен"
                value={token}
                onChangeText={setToken}
                clearable
            />

            {!!error && <CInformer message={error} type="error" />}

            {loading && <CLoader />}

            {!loading && (
                <View style={styles.buttons}>
                    <Button disabled={token.trim() === ''} onPress={checkToken}>
                        Войти
                    </Button>
                    <Button variant="secondary" onPress={goOffline}>
                        Оффлайн режим
                    </Button>
                </View>
            )}
        </View>
    );
}
