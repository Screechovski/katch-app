import { Colors } from '@/constants/Theme';
import { AntDesign } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary.i50,
                headerShown: false,
                tabBarStyle: { height: 60 },
                tabBarLabelStyle: { fontSize: 16 },
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
                name="profile"
                options={{
                    title: 'Профиль',
                    tabBarIcon: ({ color }) => (
                        <AntDesign name={'profile'} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
