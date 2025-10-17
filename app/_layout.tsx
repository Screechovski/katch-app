import { UserTokenForm } from '@/components/elements/UserTokenForm';
import { CLoader } from '@/components/ui/CLoader';
import { CWrapper } from '@/components/ui/CWrapper';
import { Api } from '@/helpers/Api';
import { Storage } from '@/helpers/Storage';
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { StrictMode, useEffect, useState } from 'react';
import { Alert, StatusBar, useColorScheme, View } from 'react-native';

const queryClient = new QueryClient();

// test deploy

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [isLoading, setIsLoading] = useState(true);

    const [hasToken, setHasToken] = useState(false);

    const checkToken = async () => {
        try {
            setIsLoading(true);
            setHasToken(false);
            const lsToken = await Storage.getData<string>(Storage.token);

            if (lsToken) {
                const checkRes = await Api.checkToken(lsToken);

                if (checkRes.isValid) {
                    setHasToken(true);
                }
            }
        } catch (error) {
            Alert.alert('Ошибка при инициализации: ' + error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkToken();
    }, []);

    if (isLoading) {
        return (
            <View style={{ width: '100%', paddingTop: 200 }}>
                <CLoader />
            </View>
        );
    }

    if (!hasToken) {
        return (
            <CWrapper style={{ paddingTop: StatusBar.currentHeight }}>
                <UserTokenForm onToken={() => setHasToken(true)} />
            </CWrapper>
        );
    }

    return (
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
                >
                    <View style={{ paddingTop: StatusBar.currentHeight }} />
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                    </Stack>
                </ThemeProvider>
            </QueryClientProvider>
        </StrictMode>
    );
}
