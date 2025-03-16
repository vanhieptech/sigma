'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  enableSystem?: boolean;
  storageKey?: string;
};

// Extended theme provider that adds animated transitions between themes
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
      {...props}
    >
      <ThemeAnimationProvider>{children}</ThemeAnimationProvider>
    </NextThemesProvider>
  );
}

// Context for theme change animations
type ThemeAnimationContextType = {
  isThemeChanging: boolean;
};

const ThemeAnimationContext = createContext<ThemeAnimationContextType>({
  isThemeChanging: false,
});

export const useThemeAnimation = () => useContext(ThemeAnimationContext);

function ThemeAnimationProvider({ children }: { children: React.ReactNode }) {
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);

  useEffect(() => {
    // Get the current theme when mounted
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);

    // Listen for theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

          if (currentTheme && newTheme !== currentTheme) {
            setIsThemeChanging(true);
            setCurrentTheme(newTheme);

            // Reset the animation state after the animation completes
            setTimeout(() => {
              setIsThemeChanging(false);
            }, 500);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [currentTheme]);

  return (
    <ThemeAnimationContext.Provider value={{ isThemeChanging }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme || 'initial'}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.8 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ThemeAnimationContext.Provider>
  );
}
