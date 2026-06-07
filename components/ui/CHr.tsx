import { useTheme } from '@/components/ThemeProvider';
import { StyleSheet, View } from 'react-native';

export const CHr = () => {
    const theme = useTheme();
    const styles = StyleSheet.create({
        hr: {
            height: 3,
            marginBottom: 5,
            marginTop: 5,
            borderRadius: 2,
            backgroundColor: theme?.colors.primary.i80,
        },
    });
    return <View style={styles.hr} />;
};
