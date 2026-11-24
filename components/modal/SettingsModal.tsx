import { View } from 'react-native';
import { CModal } from '@/shared/ui/CModal';
import { Button } from '@/shared/ui/Button';
import { CText } from '@/shared/ui/CText';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export function SettingsModal(props: Props) {
    return (
        <CModal visible={props.visible} onHide={props.onClose}>
            <View>
                <CText variant="h3">Настройки</CText>
                <Button onPress={() => {}}>Скрыть упражнения</Button>
            </View>
        </CModal>
    );
}
