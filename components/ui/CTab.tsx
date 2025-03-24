import {Colors} from '@/constants/Theme';
import {AntDesign} from '@expo/vector-icons';
import {useMemo} from 'react';
import {Text, TouchableOpacity} from 'react-native';

interface Props {
    isActive: boolean;
    children: string;
    icon: keyof typeof AntDesign.glyphMap;
    onClick(): void;
}

export function CTab(props: Props) {
    const getAccentColor = useMemo(() => {
        return props.isActive ? Colors.primary.i90 : Colors.light.i6;
    }, [props.isActive]);

    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: Colors.light.i2,
                width: '50%',
                paddingVertical: 5,
                borderBottomWidth: 2,
                borderStyle: 'solid',
                borderColor: getAccentColor,
            }}
            onPress={props.onClick}>
            <AntDesign
                style={{marginRight: 10}}
                name={props.icon}
                size={30}
                color={getAccentColor}
            />
            <Text
                style={{
                    color: getAccentColor,
                    fontSize: 20,
                }}>
                {props.children}
            </Text>
        </TouchableOpacity>
    );
}
