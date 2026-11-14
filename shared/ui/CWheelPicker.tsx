import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Platform,
    ViewStyle,
} from 'react-native';

const ITEM_HEIGHT = 26; // Высота одной строки
const VISIBLE_ITEMS = 5; // Сколько цифр видно одновременно (5 = 2 сверху, 1 по центру, 2 снизу)

interface CWheelPickerProps {
    list: number[];
    value: number;
    onChange: (value: number) => void;
}

const indexOfValue = (list: number[], value: number) => {
    const index = list.indexOf(value);
    return index < 0 ? 0 : index;
};

export function CWheelPicker({ list, value, onChange }: CWheelPickerProps) {
    const valueIndex = indexOfValue(list, value);
    const [selectedIndex, setSelectedIndex] = useState(valueIndex);
    const listRef = useRef<FlatList<number>>(null);
    const endTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // offset, который мы сами выставили из props — его onScroll не должен улетать в onChange
    const ignoreOffset = useRef<number | null>(null);
    // последнее значение, ушедшее наружу — защита от двойного onChange
    const lastSent = useRef(value);

    const scrollTo = (index: number) => {
        const offset = index * ITEM_HEIGHT;
        ignoreOffset.current = offset;
        listRef.current?.scrollToOffset({ offset, animated: false });
        if (clearTimer.current) clearTimeout(clearTimer.current);
        clearTimer.current = setTimeout(() => {
            if (ignoreOffset.current === offset) ignoreOffset.current = null;
        }, 100);
    };

    useEffect(() => {
        lastSent.current = value;
        setSelectedIndex(valueIndex);
        scrollTo(valueIndex);
    }, [valueIndex]);

    useEffect(
        () => () => {
            if (endTimer.current) clearTimeout(endTimer.current);
            if (clearTimer.current) clearTimeout(clearTimer.current);
        },
        [],
    );

    const settle = (offsetY: number) => {
        const index = Math.max(0, Math.min(Math.round(offsetY / ITEM_HEIGHT), list.length - 1));
        const next = list[index];
        if (next !== undefined && next !== lastSent.current) {
            lastSent.current = next;
            onChange(next);
        }
    };

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        if (ignoreOffset.current !== null) {
            if (Math.abs(offsetY - ignoreOffset.current) <= 1) ignoreOffset.current = null;
            return;
        }

        const index = Math.max(0, Math.min(Math.round(offsetY / ITEM_HEIGHT), list.length - 1));
        setSelectedIndex((prev) => (prev === index ? prev : index));

        if (endTimer.current) clearTimeout(endTimer.current);
        endTimer.current = setTimeout(() => settle(offsetY), 80);
    };

    const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (endTimer.current) clearTimeout(endTimer.current);
        settle(e.nativeEvent.contentOffset.y);
    };

    const renderItem = ({ item, index }: { item: number; index: number }) => {
        const distance = Math.abs(index - selectedIndex);

        let fontSize = 16;
        let opacity = 1;
        let color = '#111';

        if (distance === 1) {
            fontSize = 14;
            opacity = 0.6;
            color = '#666';
        } else if (distance >= 2) {
            fontSize = 12;
            opacity = 0.3;
            color = '#999';
        }

        return (
            <View style={styles.itemContainer}>
                <Text style={[styles.itemText, { fontSize, opacity, color }]}>{item}</Text>
            </View>
        );
    };

    return (
        <View style={styles.wheelWrapper}>
            <View style={styles.selectionIndicator} pointerEvents="none" />

            <FlatList
                ref={listRef}
                data={list}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={renderItem}
                getItemLayout={(_, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                })}
                initialScrollIndex={valueIndex}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumEnd}
                scrollEventThrottle={16}
                contentContainerStyle={styles.content}
                style={styles.list}
                windowSize={5}
                maxToRenderPerBatch={10}
                initialNumToRender={10}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wheelWrapper: {
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        width: '100%',
        ...(Platform.OS === 'web' ? ({ scrollSnapType: 'y mandatory' } as ViewStyle) : null),
    },
    content: {
        paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
    },
    selectionIndicator: {
        position: 'absolute',
        width: '100%',
        height: ITEM_HEIGHT,
        backgroundColor: '#F2F2F7',
        borderRadius: 10,
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        ...(Platform.OS === 'web' ? ({ scrollSnapAlign: 'center' } as ViewStyle) : null),
    },
    itemText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
