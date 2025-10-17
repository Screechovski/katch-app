import { CButton } from '@/components/ui/CButton';
import { CWrapper } from '@/components/ui/CWrapper';
import { Colors } from '@/constants/Theme';
import { Storage } from '@/helpers/Storage';
import { StyleSheet, View } from 'react-native';

export default function ProfilePage() {
    const logout = () => {
        Storage.removeData(Storage.token);
    };

    return (
        <CWrapper>
            <View style={style.userCard}>
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
    },
});
