import { View } from 'react-native';
import { CModal } from '@/components/ui/CModal';
import { CButton } from '@/components/ui/CButton';
import { CText } from '@/components/ui/CText';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export function SettingsModal(props: Props) {
    return (
        <CModal visible={props.visible} onHide={props.onClose}>
            <View>
                <CText variant="h3">Настройки</CText>
                <CButton onPress={() => {}}>Скрыть упражнения</CButton>
            </View>
        </CModal>
    );
}
