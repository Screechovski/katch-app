import { Colors } from '@/constants/Theme';
import { ActivityIndicator } from 'react-native';

export function CLoader(props: { color?: string }) {
    return <ActivityIndicator color={props.color ?? Colors.primary.i50} />;
}
