import { ThemeProvider, useTheme } from '@/shared/lib/theme';
import { Toast } from '@/components/Toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import React, { StrictMode } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SettingsHideExercisesModal } from '@/components/modal/SettingsHideExercisesModal';
import { WeightInputModal } from '@/components/modal/WeightInputModal';
import { ExerciseParametersSelectorModal } from '@/components/modal/ExerciseParametersSelectorModal';
import { APP_MAX_WIDTH } from '@/constants/App';

const queryClient = new QueryClient();

// на планшетах и десктопе контент не растягивается шире телефона
const styles = StyleSheet.create({
    outer: {
        flex: 1,
        alignItems: 'center',
    },
    app: {
        flex: 1,
        width: '100%',
        maxWidth: APP_MAX_WIDTH,
    },
});

function AppShell() {
    const theme = useTheme();

    return (
        <View style={[styles.outer, { backgroundColor: theme?.colors.background.i3 }]}>
            <View style={[styles.app, { backgroundColor: theme?.colors.background.i2 }]}>
                <View style={{ paddingTop: StatusBar.currentHeight }} />
                <Stack screenOptions={{ headerShown: false }} />
                <SettingsHideExercisesModal />
                <WeightInputModal />
                <ExerciseParametersSelectorModal />
                <Toast />
            </View>
        </View>
    );
}

export default function RootLayout() {
    useFonts({
        Montserrat: require('../assets/font/Montserrat-Medium.ttf'),
    });

    return (
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AppShell />
                </ThemeProvider>
            </QueryClientProvider>
        </StrictMode>
    );
}
