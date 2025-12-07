import { UserTokenForm } from '@/components/elements/UserTokenForm';
import { useRouter } from 'expo-router';
import { CWrapper } from '@/components/ui/CWrapper';

export default function LoginScreen() {
    const router = useRouter();

    return (
        <CWrapper>
            <UserTokenForm onToken={() => router.replace('/(tabs)')} />
        </CWrapper>
    );
}
