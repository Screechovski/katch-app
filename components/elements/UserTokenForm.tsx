import { CButton } from '@/components/ui/CButton';
import { CInput } from '@/components/ui/CInput';
import { Api } from '@/helpers/Api';
import { Storage } from '@/helpers/Storage';
import { useState } from 'react';
import { Text, View } from 'react-native';

interface Props {
    onToken(): void;
}
export function UserTokenForm(props: Props) {
    const [token, setToken] = useState('');

    const checkToken = async () => {
        try {
            if (token.trim() !== '') {
                const res = await Api.checkToken(token);

                if (res.isValid) {
                    Storage.saveData(Storage.token, token);
                    props.onToken();
                }
            }
        } catch (error) {
            console.warn(error);
        }
    };

    return (
        <View
            style={{
                flexDirection: 'column',
                gap: 10,
                alignItems: 'flex-start',
            }}
        >
            <Text>Введите токен пользователя</Text>

            <CInput
                placeholder="3e5tuwes54ruyhjwe547"
                value={token}
                onInput={setToken}
            />

            <CButton variant="primary" onPress={checkToken}>
                Применить1
            </CButton>
        </View>
    );
}
