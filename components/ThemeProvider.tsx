import { Colors, ColorsDark, IColor } from '@/constants/Theme';
import { Storage } from '@/helpers/Storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

interface IThemeContext {
    theme: 'light' | 'dark';
    colors: IColor;
    toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<IThemeContext['theme']>('dark');

    useEffect(() => {
        (async () => {
            const saved = await Storage.getData(Storage.theme);
            if (saved === 'light' || saved === 'dark') {
                setTheme(saved);
                Storage.saveData(Storage.theme, saved);
            } else {
                const system = Appearance.getColorScheme();
                setTheme(system === 'dark' ? 'dark' : 'light');
                Storage.saveData(Storage.theme, system);
            }
        })();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        Storage.saveData(Storage.theme, newTheme);
    };

    const colors = theme === 'light' ? Colors : ColorsDark;

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
