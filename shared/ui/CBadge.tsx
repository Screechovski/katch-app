import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
    children: string; // Слот для текста или числа
    color?: string; // Проп для цвета фона
    style?: ViewStyle; // Для дополнительных внешних отступов
}

export const CBadge = ({
    children,
    color = '#007AFF', // Синий цвет по умолчанию
    style,
}: Props) => {
    return (
        <View style={[styles.badge, { backgroundColor: color }, style]}>
            <Text style={styles.text}>{children}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 24,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
});
