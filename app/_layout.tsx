import * as SplashScreen from 'expo-splash-screen';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import {useFonts} from 'expo-font';
import {useCallback, useEffect, useState} from 'react';
import {useColorScheme} from '@/hooks/useColorScheme';
import HomeScreen from '@/app/index';
import TabTwoScreen from '@/app/history';
import {useWindowDimensions, View} from 'react-native';
import {Colors} from '@/constants/Theme';
import {CTab} from '@/components/ui/CTab';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const {height} = useWindowDimensions();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const [page, setPage] = useState('home');

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    const getAccentColor = useCallback(
        (targetPage: string) => {
            return targetPage === page ? Colors.primary.i90 : Colors.light.i6;
        },
        [page],
    );

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <View>
                <View style={{height: height - 40, paddingTop: 10}}>
                    {page === 'home' && <HomeScreen />}
                    {page === 'history' && <TabTwoScreen />}
                </View>
                <View style={{height: 40, flexDirection: 'row'}}>
                    <CTab
                        isActive={page === 'home'}
                        icon="plussquare"
                        onClick={() => setPage('home')}>
                        добавить
                    </CTab>
                    <CTab
                        isActive={page === 'history'}
                        icon="leftsquare"
                        onClick={() => setPage('history')}>
                        история
                    </CTab>
                </View>
            </View>

            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
