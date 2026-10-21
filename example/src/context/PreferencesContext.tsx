import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { accents, type Accent } from '../theme';

export type TabBarVariant = 'classic' | 'floating';

type Preferences = {
  /** Default `<TabBar />` or the custom floating one. */
  tabBarVariant: TabBarVariant;
  setTabBarVariant: (variant: TabBarVariant) => void;
  /** Tint of the active tab. */
  accent: Accent;
  setAccent: (accent: Accent) => void;
  /** Whether back on another tab returns to Home (`backBehavior`). */
  backToHomeTab: boolean;
  setBackToHomeTab: (enabled: boolean) => void;
};

const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [tabBarVariant, setTabBarVariant] = useState<TabBarVariant>('classic');
  const [accent, setAccent] = useState<Accent>(accents[0]);
  const [backToHomeTab, setBackToHomeTab] = useState(true);

  const value = useMemo(
    () => ({
      tabBarVariant,
      setTabBarVariant,
      accent,
      setAccent,
      backToHomeTab,
      setBackToHomeTab,
    }),
    [tabBarVariant, accent, backToHomeTab]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): Preferences {
  const preferences = useContext(PreferencesContext);
  if (preferences == null) {
    throw new Error(
      'usePreferences() must be used inside <PreferencesProvider />.'
    );
  }
  return preferences;
}
