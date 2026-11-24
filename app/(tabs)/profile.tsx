import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { TAB_CONTENT_PADDING } from '@/constants/App';
import { useTabContentBottomPadding } from '@/hooks/useTabContentBottomPadding';
import { workoutColors as colors, workoutFonts as fonts } from '@/shared/ui/workout/theme';
import { ApiV2 } from '@/helpers/api/v2';
import { Storage } from '@/helpers/Storage';
import { useSettingsStore } from '@/store/settingsStore';
import { useToastStore } from '@/store/toastStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfilePage() {
    const bottomPadding = useTabContentBottomPadding();
    const router = useRouter();
    const toastStore = useToastStore();
    const settingsStore = useSettingsStore();

    const logout = () => {
        Storage.removeData(Storage.token);
        router.replace('/login');
    };

    const saveLocalTrains = async () => {
        try {
            const lsToken = await Storage.getData<string>(Storage.token);
            if (lsToken) {
                const trains = await Storage.getData<any[]>(Storage.trains);

                if (!trains) {
                    toastStore.setSuccess('Все данные сохранены');
                    return;
                }

                for (const train of trains) {
                    await ApiV2.saveTrain(lsToken, train);
                    toastStore.setSuccess(`Тренировка ${train.date} сохранена`);
                }

                await Storage.removeData(Storage.trains);
                await checkLSTrains();
            } else {
                router.replace('/login');
            }
        } catch (error) {
            toastStore.setError(`Ошибка при сохранении тренировок: ` + error);
        }
    };

    const [hasStorageTrains, setHasStorageTrains] = useState(false);
    const checkLSTrains = async () => {
        try {
            const res = await Storage.getData(Storage.trains);
            setHasStorageTrains(!!res);
        } catch (error) {
            toastStore.setError(`Ошибка при проверки тренировок: ` + error);
        }
    };
    useEffect(() => {
        checkLSTrains();
    }, []);

    return (
        <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}>
            <View style={styles.card}>
                <View style={styles.heading}>
                    <View style={styles.icon}>
                        <MaterialCommunityIcons aria-hidden name="tune-variant" size={22} color={colors.mintDark} />
                    </View>
                    <Text accessibilityRole="header" style={styles.title}>Настройки тренировки</Text>
                </View>
                <Checkbox
                    label="Спрашивать вес в конце тренировки"
                    checked={settingsStore.isWeightAfterTrain}
                    onCheckedChange={() => settingsStore.toggle('isWeightAfterTrain')}
                />
                <Checkbox
                    label="Показывать историю в выборе упражнения"
                    checked={settingsStore.isHistoryInExerciseSelector}
                    onCheckedChange={() => settingsStore.toggle('isHistoryInExerciseSelector')}
                />
            </View>
            <View style={styles.card}>
                <View style={styles.heading}>
                    <View style={styles.icon}>
                        <MaterialCommunityIcons aria-hidden name="account-outline" size={22} color={colors.mintDark} />
                    </View>
                    <Text accessibilityRole="header" style={styles.title}>Аккаунт</Text>
                </View>
                {hasStorageTrains && (
                    <Button onPress={saveLocalTrains}>Синхронизировать данные</Button>
                )}
                <Button variant="secondary" onPress={logout}>Выход</Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.canvas },
    content: { ...TAB_CONTENT_PADDING, gap: 16 },
    card: {
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        padding: 18,
        gap: 10,
    },
    heading: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.mint,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { fontFamily: fonts.semibold, fontSize: 18, color: colors.ink, flexShrink: 1 },
});
