import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {useFonts} from "expo-font";
import {useEffect, useState} from "react";
import TabTwoScreen from '@/app/(tabs)/history';
import HomeScreen from '@/app/(tabs)';
import { View } from 'react-native';
import { CButton } from '@/components/ui/CButton';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const [page, setPage] = useState('home');

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {page === 'home' && <HomeScreen />}
            {page === 'history' && <TabTwoScreen />}

            <View style={{flexDirection: 'row'}}>
                <CButton
                    variant={page === 'home' ? 'primary' : 'primary-outline'}
                    style={{width: '50%', borderRadius: 0}} onPress={() => setPage('home')}>
                    home
                </CButton>
                <CButton
                    variant={page === 'history' ? 'primary' : 'primary-outline'}
                    style={{width: '50%', borderRadius: 0}} onPress={() => setPage('history')}>
                    history
                </CButton>
            </View>

            <StatusBar style="auto"/>
        </ThemeProvider>
    );
}
