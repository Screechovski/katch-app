export function interpolateColor(max: number, value: number = 0): string {
    const clampedValue = Math.max(0, Math.min(value, max));

    const ratio = max === 0 ? 0 : clampedValue / max;

    const startR = 224;
    const startG = 224;
    const startB = 224;

    const endR = 255;
    const endG = 0;
    const endB = 0;

    const r = Math.round(startR + (endR - startR) * ratio);
    const g = Math.round(startG + (endG - startG) * ratio);
    const b = Math.round(startB + (endB - startB) * ratio);

    const toHex = (n: number): string => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
