import { workoutColors, workoutFonts } from '@/shared/ui/workout/theme';
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
        backgroundColor: workoutColors.canvas,
    },
    app: {
        flex: 1,
        width: '100%',
        maxWidth: APP_MAX_WIDTH,
    },
    screen: { backgroundColor: workoutColors.canvas },
});

function AppShell() {
    return (
        <View style={styles.outer}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.app}>
                <View style={{ paddingTop: StatusBar.currentHeight }} />
                <Stack screenOptions={{ headerShown: false, contentStyle: styles.screen }} />
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
        [workoutFonts.medium]: require('../assets/font/Montserrat-Medium.ttf'),
        [workoutFonts.semibold]: require('../assets/font/Montserrat-SemiBold.ttf'),
    });

    return (
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <AppShell />
            </QueryClientProvider>
        </StrictMode>
    );
}
