import React, { useState } from "react";
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    TextStyle,
    ViewStyle,
} from "react-native";

interface InputProps {
    label?: string; // Лейбл (опционально)
    placeholder?: string; // Подсказка (опционально)
    value?: string; // Значение поля (опционально)
    error?: string; // Сообщение об ошибке (опционально)
    disabled?: boolean; // Флаг отключения поля (опционально)
    onChangeText?: (text: string) => void; // Обработчик изменения текста
    style?: ViewStyle; // Дополнительные стили контейнера
    inputStyle?: TextStyle; // Дополнительные стили поля ввода
}

export const BInput = ({
    label,
    placeholder,
    error,
    disabled,
    value,
    onChangeText,
    style,
    inputStyle,
    ...otherProps
}: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    // Определяем стили в зависимости от состояния
    const borderColor = error ? "#dc3545" : isFocused ? "#007bff" : "#ced4da";
    const textColor = error ? "#dc3545" : "#212529";

    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text style={[styles.label, { color: textColor }]}>{label}</Text>
            )}

            <TextInput
                style={[
                    styles.input,
                    { borderColor },
                    disabled && styles.disabledInput,
                    inputStyle,
                ]}
                placeholder={placeholder}
                placeholderTextColor="#6c757d"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                editable={!disabled}
                value={value}
                onChangeText={onChangeText}
                {...otherProps}
            />

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
      focusedInput: {
        // Тень для iOS
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    
        // Эффект возвышения для Android
        elevation: 4,
    
        // Увеличиваем цвет рамки для акцента
        borderColor: '#007bff',
    },
      disabledInput: {
        backgroundColor: '#e9ecef',
        color: '#6c757d',
    },
      errorText: {
        marginTop: 4,
        fontSize: 12,
        color: '#dc3545',
    },
});
