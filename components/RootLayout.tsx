import {CTab} from '@/components/ui/CTab';
import {AntDesign} from '@expo/vector-icons';
import React from 'react';
import {View, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    component: {
        flex: 1,
    },
    bottomBar: {
        flexDirection: 'row',
    },
    tabButton: {
        flex: 1,
        width: '100%',
    },
});

interface Props {
    tabs: {
        id: string;
        iconName: keyof typeof AntDesign.glyphMap;
        title: string;
        component: React.ReactNode;
    }[];
    activeTabId: string;
    onChangeActiveTabId: (tabId: string) => void;
}
export const RootLayout: React.FC<Props> = (props) => {
    const activeTab = props.tabs.find((tab) => tab.id === props.activeTabId);

    return (
        <View style={styles.container}>
            <View style={styles.component}>{activeTab?.component}</View>

            <View style={styles.bottomBar}>
                {props.tabs.map((tab) => (
                    <View key={tab.id} style={styles.tabButton}>
                        <CTab
                            isActive={tab.id === props.activeTabId}
                            icon={tab.iconName}
                            onClick={() => props.onChangeActiveTabId(tab.id)}>
                            {tab.title}
                        </CTab>
                    </View>
                ))}
            </View>
        </View>
    );
};
