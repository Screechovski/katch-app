import { CButton } from '@/components/ui/CButton';
import { CInformerError } from '@/components/ui/CInformerError';
import { CInput } from '@/components/ui/CInput';
import { CLoader } from '@/components/ui/CLoader';
import { Api } from '@/helpers/Api';
import { Storage } from '@/helpers/Storage';
import { useState } from 'react';
import { Text, View } from 'react-native';

interface Props {
    onToken(): void;
}

export function UserTokenForm(props: Props) {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // TODO добавить diabled для кнопки

    const checkToken = async () => {
        try {
            if (token.trim() !== '') {
                setLoading(true);
                const res = await Api.checkToken(token);

                if (res.isValid) {
                    Storage.saveData(Storage.token, token);
                    props.onToken();
                } else {
                    // TODO создать кэш-список для некорректных токенов
                    setError('Неверный токен');
                }
            }
        } catch (error: any) {
            setError(Error(error || 'Ошибка при проверке токена').message);
            console.warn(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View
            style={{
                flexDirection: 'column',
                gap: 10,
            }}
        >
            <CInput
                label="Введите токен пользователя"
                placeholder="Введите токен"
                value={token}
                onInput={setToken}
            />

            {!!error && <CInformerError message={error} />}

            {loading && <CLoader />}

            {!loading && (
                <CButton variant="primary" onPress={checkToken}>
                    применить
                </CButton>
            )}
        </View>
    );
}
