import { useTheme } from '@/components/ThemeProvider';
import Slider, { MarkerProps } from '@react-native-community/slider';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    value: number;
    min: number;
    max: number;
    renderStep?: number;
    step?: number;
    onChange: (value: number) => void;
};

export const CSlider = ({
    value,
    min,
    max,
    step,
    onChange,
    renderStep,
}: Props) => {
    const theme = useTheme();
    const styles = useMemo(
        () =>
            StyleSheet.create({
                currentWrapper: {
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: -20,
                    backgroundColor: theme?.colors.background.i2,
                },
                current: {
                    color: theme?.colors.background.i9,
                    fontSize: 14,
                    lineHeight: 14,
                    fontWeight: 'bold',
                },
                stepWrapper: {
                    height: 10,
                    width: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: -20,
                    textAlign: 'center',
                },
                step: {
                    color: theme?.colors.background.i9,
                    fontSize: 10,
                    lineHeight: 10,
                    fontWeight: 'bold',
                },
            }),
        [theme?.theme],
    );
    const renderStepMarker = useCallback(
        ({ currentValue, index }: MarkerProps) => {
            return (
                <View>
                    {/* {currentValue === index && (
                        <View style={styles.currentWrapper}>
                            <Text style={styles.current}>{currentValue}</Text>
                        </View>
                    )} */}
                    {renderStep !== undefined &&
                        (index % renderStep === 0 || index === min) && (
                            <View style={styles.stepWrapper}>
                                <Text style={styles.step}>{index}</Text>
                            </View>
                        )}
                </View>
            );
        },
        [],
    );

    return (
        <Slider
            style={{ width: '100%', height: 20 }}
            value={value}
            onSlidingComplete={onChange}
            minimumValue={min}
            maximumValue={max}
            step={step ?? 1}
            minimumTrackTintColor={theme?.colors.primary.i50}
            maximumTrackTintColor={theme?.colors.primary.i50}
            thumbTintColor={theme?.colors.primary.i80}
            StepMarker={renderStepMarker}
        />
    );
};
