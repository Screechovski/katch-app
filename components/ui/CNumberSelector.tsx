import {Text, TouchableOpacity} from 'react-native';

type Props = {
    onPress?: () => void;
};

export function CNumberSelector(props: Props) {
    return (
        <TouchableOpacity onPress={props.onPress} activeOpacity={1}>
            <Text>67</Text>
        </TouchableOpacity>
    );
}
