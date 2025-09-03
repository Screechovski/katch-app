import {Colors} from '@/constants/Theme';
import {ActivityIndicator} from 'react-native';

export function CLoader() {
    return <ActivityIndicator size={'large'} color={Colors.primary.i50} />;
}
