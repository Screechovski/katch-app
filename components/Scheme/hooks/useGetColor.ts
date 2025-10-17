import { GROUPS_MAP } from '@/components/Scheme/constants';
import { interpolateColor } from '@/components/Scheme/helper';
import { useCallback, useMemo } from 'react';

export function useGetColor(intence: { id: number; value: number }[]) {
    const maxIntence = useMemo(() => {
        if (intence.length === 0) {
            return 0;
        }

        return Math.max(...intence.map(({ value }) => value));
    }, [intence]);

    type Name = (typeof GROUPS_MAP)[keyof typeof GROUPS_MAP];

    const getColor = useCallback(
        (name: Name | Name[]) => {
            if (Array.isArray(name)) {
                const muscles = Object.entries(GROUPS_MAP).filter(
                    ([_, _name]) => name.includes(_name),
                );

                if (!muscles.length) {
                    return interpolateColor(0, 0);
                }

                const _intences = intence.filter(({ id }) =>
                    muscles.map((muscle) => +muscle[0]).includes(id),
                );

                if (!_intences.length) {
                    return interpolateColor(0, 0);
                }

                return interpolateColor(
                    maxIntence,
                    Math.max(..._intences.map((i) => i.value)),
                );
            } else {
                const muscle = Object.entries(GROUPS_MAP).find(
                    ([_, _name]) => _name === name,
                );

                if (!muscle) {
                    return interpolateColor(0, 0);
                }

                const _intence = intence.find(({ id }) => id === +muscle[0]);

                if (!_intence) {
                    return interpolateColor(0, 0);
                }

                return interpolateColor(maxIntence, _intence.value);
            }
        },
        [intence, maxIntence],
    );

    return {
        getColor,
    };
}
