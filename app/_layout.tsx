import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { StrictMode } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
                >
                    <View style={{ paddingTop: StatusBar.currentHeight }} />
                    <Stack screenOptions={{ headerShown: false }} />
                </ThemeProvider>
            </QueryClientProvider>
        </StrictMode>
    );
}
