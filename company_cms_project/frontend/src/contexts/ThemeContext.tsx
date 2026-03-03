import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import type { ThemeConfig } from '../types/theme';
import { PRESET_THEMES, DEFAULT_THEME, getThemeById } from '../types/theme';
import { getSetting, updateSetting } from '../api/pages';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (themeId: string) => Promise<void>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  // 加载主题配置
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await getSetting('site_theme');
        if (res.data?.value) {
          const theme = getThemeById(res.data.value);
          setCurrentTheme(theme);
        }
      } catch (error) {
        // 使用默认主题
        console.log('Using default theme');
      } finally {
        setLoading(false);
      }
    };
    loadTheme();
  }, []);

  // 切换主题
  const setTheme = async (themeId: string) => {
    const theme = getThemeById(themeId);
    setCurrentTheme(theme);
    
    // 保存到后端（如果已登录）
    try {
      await updateSetting('site_theme', themeId);
    } catch (error) {
      // 未登录时只在本地切换
      console.log('Theme saved locally only');
    }
  };

  // 生成 Ant Design 主题配置
  const antdThemeConfig = {
    token: {
      colorPrimary: currentTheme.colors.primary,
      colorSuccess: currentTheme.colors.success,
      colorWarning: currentTheme.colors.warning,
      colorError: currentTheme.colors.error,
      colorBgContainer: currentTheme.colors.cardBg,
      colorBgLayout: currentTheme.colors.background,
      colorText: currentTheme.colors.textPrimary,
      colorTextSecondary: currentTheme.colors.textSecondary,
      colorBorder: currentTheme.colors.border,
      borderRadius: 8,
    },
    algorithm: currentTheme.id === 'dark-mode' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  // 注入 CSS 变量
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, loading }}>
      <ConfigProvider theme={antdThemeConfig}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export { PRESET_THEMES };
