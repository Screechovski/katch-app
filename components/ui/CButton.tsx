import { StyleSheet, Text, ViewStyle } from 'react-native';
import { CButtonBase, CButtonBaseType } from './CButtonBase';
import { Colors } from '@/constants/Theme';

interface Props {
    children: string;
    onPress(): void;
    style?: ViewStyle;
    variant?: CButtonBaseType;
    disabled?: boolean;
}

export function CButton(props: Props) {
    const style = StyleSheet.create({
        wrap: {
            height: 50,
        },
        text: {
            fontSize: 20,
            fontFamily: 'sans-serif',
            textTransform: 'lowercase',
            color:
                props.variant !== 'primary-outline'
                    ? Colors.light.i2
                    : Colors.primary.i90,
            paddingHorizontal: 20,
        },
    });

    return (
        <CButtonBase
            variant={props.variant}
            style={[props.style, style.wrap]}
            onPress={props.onPress}
            disabled={props.disabled}
        >
            <Text style={style.text}>{props.children}</Text>
        </CButtonBase>
    );
}
