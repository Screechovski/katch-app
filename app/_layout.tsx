import { ThemeProvider } from '@/components/ThemeProvider';
import { Toast } from '@/components/Toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { StrictMode } from 'react';
import { StatusBar, View } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <View style={{ paddingTop: StatusBar.currentHeight }} />
                    <Stack screenOptions={{ headerShown: false }} />
                    <Toast />
                </ThemeProvider>
            </QueryClientProvider>
        </StrictMode>
    );
}
