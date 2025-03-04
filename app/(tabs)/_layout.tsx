import {Tabs} from 'expo-router';
import React from 'react';
import {Platform} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import {HapticTab} from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Theme';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary.i70,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Добавить',
                    tabBarIcon: ({color}) => <FontAwesome5 name="home" size={24} color={color}/>,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'История',
                    tabBarIcon: ({color}) => <FontAwesome5 name="history" size={24} color={color}/>,
                }}
            />
        </Tabs>
    );
}
