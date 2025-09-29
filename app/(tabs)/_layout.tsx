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
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Добавить',
                    tabBarIcon: ({ color }) => (
                        <AntDesign
                            style={{ marginRight: 10 }}
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
                        <AntDesign
                            style={{ marginRight: 10 }}
                            name={'history'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Профиль',
                    tabBarIcon: ({ color }) => (
                        <AntDesign
                            style={{ marginRight: 10 }}
                            name={'profile'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
