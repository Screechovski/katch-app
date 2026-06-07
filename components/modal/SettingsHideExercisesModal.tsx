import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { CModal } from '@/components/ui/CModal';
import { CText } from '@/components/ui/CText';
import { ApiV2 } from '@/helpers/api/v2';
import { Storage } from '@/helpers/Storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Api } from '@/helpers/api/v1';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { CButton } from '@/components/ui/CButton';
import { useToastStore } from '@/store/toastStore';
import { useModal } from '@/hooks/useModal';

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject, // Растягивает блок на всю ширину и высоту
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 4,
    },
    iconContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center', // Центрирует иконку по вертикали
        alignItems: 'center', // Центрирует иконку по горизонтали
    },
});

export function SettingsHideExercisesModal() {
    const { height } = useWindowDimensions();
    const exercisesQuery = useQuery({
        queryKey: ['exercises'],
        queryFn: async () => {
            const token = await Storage.getData<string>(Storage.token);
            return ApiV2.exercises(token ?? undefined);
        },
    });
    const cardWidth = useMemo(() => {
        return 300 / 4 - 2;
    }, []);
    const theme = useTheme();
    const [tmpHiddens, setTmpHiddens] = useState<number[]>([]);
    useEffect(() => {
        Storage.getData<number[]>(Storage.settingsHiddenExercises).then((storageHidden) => {
            if (storageHidden) {
                setTmpHiddens(storageHidden);
            }
        });
    }, []);
    const addTmpHiddens = (id: number) => {
        setTmpHiddens((value) => [...value, id]);
    };
    const removeTmpHiddens = (id: number) => {
        setTmpHiddens((value) => value.filter((i) => i !== id));
    };
    const toggleTmpHiddens = (id: number) => {
        if (tmpHiddens.includes(id)) {
            removeTmpHiddens(id);
        } else {
            addTmpHiddens(id);
        }
    };
    const queryClient = useQueryClient();
    const toast = useToastStore();
    const modal = useModal('settingsHideExercises');
    const saveHidden = async () => {
        try {
            await Storage.saveData(Storage.settingsHiddenExercises, tmpHiddens);
            modal.close();
            queryClient.invalidateQueries({ queryKey: ['excluded_exercises'] });
        } catch (error) {
            // @ts-ignore
            toast.setError(error?.message || 'не удалось сохранить');
        }
    };

    const exercisesWithHidden = useMemo(() => {
        return (exercisesQuery.data ?? []).map((ex) => ({
            ...ex,
            isHidden: tmpHiddens.includes(ex.id),
        }));
    }, [exercisesQuery.data, tmpHiddens]);

    return (
        <CModal visible={modal.visible} onHide={modal.close}>
            <View style={{ width: 300, maxHeight: height - 115 }}>
                <CText variant="h3">Выберете упражнения которые хотите скрыть</CText>
                {exercisesQuery.data && (
                    <FlatList
                        style={{ flex: 1, marginBottom: 6, marginTop: 6 }}
                        data={exercisesWithHidden}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    width: cardWidth,
                                    padding: 2,
                                    borderRadius: 6,
                                    backgroundColor: theme?.colors.light.i4,
                                    overflow: 'hidden',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => toggleTmpHiddens(item.id)}
                                    activeOpacity={1}
                                    style={{
                                        width: cardWidth - 4,
                                        height: cardWidth - 4,
                                        borderRadius: 4,
                                    }}
                                >
                                    <Image
                                        style={{
                                            ...StyleSheet.absoluteFillObject,
                                            borderRadius: 4,
                                        }}
                                        source={{
                                            uri: Api.getPhotoUrl(item.imageName),
                                        }}
                                    />

                                    {item.isHidden && <View style={styles.overlay} />}

                                    <View style={styles.iconContainer}>
                                        <Ionicons
                                            name={item.isHidden ? 'eye-off-outline' : 'eye-outline'}
                                            size={30}
                                            color={item.isHidden ? '#ffffff' : '#000'}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <CText lines={2} variant="text-small">
                                    {item.name}
                                </CText>
                            </View>
                        )}
                        maxToRenderPerBatch={20}
                        numColumns={4}
                        keyExtractor={(item) => item.id.toString()}
                        columnWrapperStyle={{
                            justifyContent: 'space-between',
                            paddingVertical: 2,
                        }}
                        showsVerticalScrollIndicator={false}
                        onRefresh={() => {}}
                        refreshing={false}
                    />
                )}
                <CButton onPress={saveHidden}>Сохранить</CButton>
            </View>
        </CModal>
    );
}
