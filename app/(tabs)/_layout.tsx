import { useTheme } from '@/components/ThemeProvider';
import { AntDesign } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme?.colors.primary.i50,
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    backgroundColor: theme?.colors.background.i2,
                    borderTopWidth: 0,
                },
                tabBarLabelStyle: { fontSize: 16, fontFamily: 'Montserrat' },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Добавить',
                    tabBarIcon: ({ color }) => (
                        <AntDesign
                            name={'plus-circle'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'История',
                    tabBarIcon: ({ color }) => (
                        <AntDesign name={'history'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="statistic"
                options={{
                    title: 'Статистика',
                    tabBarIcon: ({ color }) => (
                        <AntDesign name={'bar-chart'} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Профиль',
                    tabBarIcon: ({ color }) => (
                        <AntDesign name={'idcard'} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
