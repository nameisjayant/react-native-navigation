import { StyleSheet, View } from 'react-native';
import { BottomTabs } from '@nameisjayant/react-native-navigation';
import { usePreferences } from '../context/PreferencesContext';
import { tabIcon } from '../icons';
import { HomeScreen } from '../screens/Home';
import { SettingsScreen } from '../screens/Settings';
import { colors } from '../theme';
import { FloatingTabBar } from './FloatingTabBar';
import { SearchNavigator } from './SearchNavigator';
import { TabRoutes } from './routes';
import type { TabName } from './types';

export function MainTabs() {
  const { tabBarVariant, accent, backToHomeTab } = usePreferences();
  return (
    <View style={styles.container}>
      <BottomTabs<TabName>
        initialTab={TabRoutes.Home}
        tabs={{
          // Outlined icon normally, filled while the tab is active.
          [TabRoutes.Home]: {
            screen: HomeScreen,
            icon: tabIcon('homeOutlined'),
            focusedIcon: tabIcon('home'),
          },
          [TabRoutes.Search]: {
            screen: SearchNavigator,
            label: 'Explore',
            icon: tabIcon('search'),
            focusedIcon: tabIcon('explore'),
          },
          [TabRoutes.Settings]: {
            screen: SettingsScreen,
            icon: tabIcon('settings'),
          },
        }}
        backBehavior={backToHomeTab ? 'initialTab' : 'none'}
        // Default tab bar, styled through props…
        tabBarStyle={styles.tabBar}
        activeTintColor={accent.color}
        inactiveTintColor={colors.textSubtle}
        // …or replaced entirely by a custom component.
        tabBar={tabBarVariant === 'floating' ? FloatingTabBar : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
  },
});
