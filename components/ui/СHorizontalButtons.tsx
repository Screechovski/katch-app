import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Theme';
import { CButtonBase } from '@/components/ui/CButtonBase';

interface Props {
    options: {
        value: number;
        isTop?: boolean;
        isLast?: boolean;
        isSelected: boolean;
    }[];
    onSelect(value: number): void;
}

export const HorizontalButtons = (props: Props) => {
    const handleSelect = (value: number) => {
        props.onSelect(value);
    };

    return (
        <View style={styles.items}>
            {props.options.map((option, key) => (
                <View style={styles.item} key={key}>
                    <CButtonBase
                        variant={option.isSelected ? 'primary' : 'success'}
                        style={styles.wrap}
                        onPress={() => handleSelect(option.value)}
                        disabled={false}
                    >
                        <Text style={styles.text}>
                            {option.value.toString()}
                        </Text>
                    </CButtonBase>

                    {option.isTop && <Text style={styles.maxMark}>TOP</Text>}
                    {option.isLast && <Text style={styles.lastMark}>PREV</Text>}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    items: {
        gap: 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    text: {
        fontSize: 16,
        color: Colors.light.i2,
        textTransform: 'uppercase',
    },
    wrap: {
        height: 36,
        width: 36,
    },
    item: {
        flexDirection: 'column',
        gap: 1,
        alignItems: 'center',
    },
    maxMark: {
        borderRadius: 3,
        backgroundColor: Colors.danger.i4,
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.light.i2,
        padding: 2,
    },
    lastMark: {
        borderRadius: 3,
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.light.i2,
        padding: 2,
        backgroundColor: Colors.info.i5,
    },
});
