export const Colors = {
    primary: {
        i5: '#eef2ff',
        i50: '#6366f1',
        i80: '#3730a3',
        i90: '#312e81',
        i95: '#1e1b4b',
    },
    success: {
        i4: '#ABE14C',
        i7: '#52940C',
        i9: '#2D6204',
    },
    info: {
        i5: '#02D0F4',
        i6: '#01A2D1',
        i7: '#017AAF',
    },
    warning: {
        i8: '#937000',
        i9: '#7A5A00',
    },
    danger: {
        i2: '#fff0f0',
        i4: '#ff7070',
        i5: '#FF0000',
        i6: '#cb0000',
        i7: '#900000',
    },
    light: {
        i2: '#fff',
        i3: '#fafafa',
        i4: '#f5f5f5',
        i5: '#e5e5e5',
        i6: '#d4d4d4',
    },
    dark: {
        i3: '#525252',
        i4: '#404040',
        i7: '#0a0a0a',
    },
    background: {
        i2: '#fff',
        i3: '#f5f5f5',
        i4: '#f5f5f5',
        i5: '#e5e5e5',
        i6: '#d4d4d4',
        i7: '#525252',
        i8: '#141414',
        i9: '#000000',
    },
};

export const ColorsDark = {
    ...Colors,
    background: {
        i2: '#000000',
        i3: '#141414',
        i4: '#525252',
        i5: '#d4d4d4',
        i6: '#e5e5e5',
        i7: '#f5f5f5',
        i8: '#f5f5f5',
        i9: '#fff',
    },
    primary: {
        ...Colors.primary,
        i80: 'rgba(96, 85, 248, 1)',
    },
};

export type IColor = typeof Colors;
