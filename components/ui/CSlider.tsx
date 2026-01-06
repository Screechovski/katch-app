import { useTheme } from '@/components/ThemeProvider';
import { Slider } from '@miblanchard/react-native-slider';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    value: number;
    min: number;
    max: number;
    step?: number;
    top?: number;
    last?: number;
    onChange: (value: number) => void;
};

export const CSlider = ({
    value,
    min,
    max,
    step,
    onChange,
    top,
    last,
}: Props) => {
    const validStep = useMemo(() => step ?? 1, [step]);
    const theme = useTheme();
    const styles = useMemo(
        () =>
            StyleSheet.create({
                wrapper: {
                    height: 34,
                },
                sliderWrapper: {
                    height: 40,
                    marginTop: -10,
                },
                stepWrapper: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: -18,
                    width: 20,
                },
                step: {
                    fontFamily: 'Montserrat',
                    color: theme?.colors.primary.i50,
                    fontSize: 14,
                    fontWeight: 'bold',
                    textAlign: 'center',
                },
                top: {
                    color: theme?.colors.danger.i5,
                },
                last: {
                    color: theme?.colors.success.i7,
                },
            }),
        [theme?.theme],
    );

    const onSlidingComplete = (value: number[]) => onChange(value[0]);

    const trackMarks = useMemo(() => {
        const step = (max - min) / 5;
        const _s = (max - min) / 20;
        const res: { isStep: boolean; value: number }[] = [];
        let current = min;
        const _top = top ?? 999;
        const _last = last ?? 999;

        while (current < max) {
            const prev = current;
            current = Math.floor(current + step);

            const isNeedAddTop = prev < _top && _top < current;
            const isNeedAddLast = prev < _last && _last < current;

            res.push({ isStep: true, value: prev });

            if (isNeedAddTop) {
                res.push({ isStep: false, value: _top });
            } else if (isNeedAddLast) {
                res.push({ isStep: false, value: _last });
            }
        }

        res.push({ isStep: true, value: max });

        for (let i = 0; i < res.length; i++) {
            const item = res[i];

            if (!item) continue;

            if (!item.isStep) {
                const next = res[i + 1];
                const prev = res[i - 1];

                if (prev && item.value - _s < prev.value) {
                    delete res[i - 1];
                }

                if (next && item.value + _s > next.value) {
                    delete res[i + 1];
                }
            }
        }

        return res.filter((i) => i).map((i) => i.value);
    }, [max, min, top, last]);

    const renderStepMarker = useCallback(
        (index: number) => (
            <View style={styles.stepWrapper}>
                <Text
                    style={[
                        styles.step,
                        trackMarks[index] === top ? styles.top : null,
                        trackMarks[index] === last ? styles.last : null,
                    ]}
                >
                    {trackMarks[index]}
                </Text>
            </View>
        ),
        [trackMarks, top],
    );

    return (
        <View style={styles.wrapper}>
            <View style={styles.sliderWrapper}>
                <Slider
                    value={value}
                    minimumValue={min}
                    maximumValue={max}
                    step={validStep}
                    onSlidingComplete={onSlidingComplete}
                    thumbTintColor={theme?.colors.primary.i80}
                    maximumTrackTintColor={theme?.colors.primary.i50}
                    minimumTrackTintColor={theme?.colors.primary.i50}
                    trackMarks={trackMarks}
                    renderTrackMarkComponent={renderStepMarker}
                />
            </View>
        </View>
    );
};
