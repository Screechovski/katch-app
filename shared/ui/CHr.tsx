import { workoutColors } from './workout/theme';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

export function CHr({ style }: { style?: StyleProp<ViewStyle> }) {
    return <View style={[styles.hr, style]} />;
}

const styles = StyleSheet.create({
    hr: {
        height: 1,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: workoutColors.border,
    },
});
