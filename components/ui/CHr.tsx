import { useTheme } from '@/components/ThemeProvider';
import { StyleSheet, View } from 'react-native';

export const CHr = () => {
    const theme = useTheme();
    const styles = StyleSheet.create({
        hr: {
            height: 3,
            marginBottom: 10,
            marginTop: 10,
            borderRadius: 2,
            backgroundColor: theme?.colors.primary.i80,
        },
    });
    return <View style={styles.hr} />;
};
