import { CInformer } from '@/components/ui/CInformer';
import { useToastStore } from '@/store/toastStore';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
    toasts: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        gap: 10,
    },
});

export const Toast = () => {
    const store = useToastStore();

    return (
        <View style={styles.toasts}>
            {store.toasts.map((toast) => (
                <TouchableOpacity onPress={() => store.remove(toast.id)} key={toast.id}>
                    <CInformer message={toast.message} type={toast.type} />
                </TouchableOpacity>
            ))}
        </View>
    );
};
