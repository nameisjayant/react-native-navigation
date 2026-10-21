import { createContext, useContext, useState } from 'react';
import {
  Button,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {
  AppNavigation,
  BottomTabs,
  useNavigation,
  useTabs,
  type NavigatorScreenParams,
  type ScreenProps,
  type TabBarProps,
  type TabScreenProps,
} from '@nameisjayant/react-native-navigation';
import { svgIcon } from './icons';

type RootParamList = {
  Welcome: undefined;
  Main: NavigatorScreenParams<TabParamList> | undefined;
  Profile: { userId: string; name: string };
};

type TabParamList = {
  Home: undefined;
  Search: NavigatorScreenParams<SearchParamList> | undefined;
  Settings: undefined;
};

type TabName = keyof TabParamList;

// The Search tab has its own stack, nested inside the tab.
type SearchParamList = {
  SearchList: undefined;
  SearchResult: { query: string };
};

// Lets the Settings tab switch between the default and the custom tab bar.
const CustomBarContext = createContext({
  enabled: false,
  setEnabled: (_enabled: boolean) => {},
});

function Welcome({ navigation }: ScreenProps<RootParamList, 'Welcome'>) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Welcome</Text>
      <Text>The first screen, shown before the tabs.</Text>
      <Button title="Get started" onPress={() => navigation.navigate('Main')} />
      {/* Open a given tab, and a screen of the stack nested in it. */}
      <Button
        title="Open settings tab"
        onPress={() => navigation.navigate('Main', { screen: 'Settings' })}
      />
      <Button
        title="Open a search result"
        onPress={() =>
          navigation.navigate('Main', {
            screen: 'Search',
            params: { screen: 'SearchResult', params: { query: 'deep link' } },
          })
        }
      />
    </View>
  );
}

function Home({ tabs }: TabScreenProps<TabName>) {
  // Tab screens push onto the root stack, covering the tab bar.
  const navigation = useNavigation<RootParamList>();
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Home</Text>
      <Button
        title="Open profile"
        onPress={() =>
          navigation.navigate('Profile', { userId: '42', name: 'jayant' })
        }
      />
      <Button title="Go to search" onPress={() => tabs.jumpTo('Search')} />
    </View>
  );
}

function SearchTab() {
  return (
    <AppNavigation<SearchParamList> screens={{ SearchList, SearchResult }} />
  );
}

function SearchList({
  navigation,
}: ScreenProps<SearchParamList, 'SearchList'>) {
  const [count, setCount] = useState(0);
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Search</Text>
      <Text>Tab state is kept when switching tabs.</Text>
      <Button
        title={`Pressed ${count} times`}
        onPress={() => setCount(count + 1)}
      />
      {/* Pushes inside the tab, keeping the tab bar visible. */}
      <Button
        title="Search for react"
        onPress={() => navigation.navigate('SearchResult', { query: 'react' })}
      />
    </View>
  );
}

function SearchResult({
  navigation,
  route,
}: ScreenProps<SearchParamList, 'SearchResult'>) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Results for "{route.params.query}"</Text>
      <Button
        title="Refine search"
        onPress={() =>
          navigation.navigate('SearchResult', {
            query: `${route.params.query}!`,
          })
        }
      />
      {/* Screens of the root stack are reached through the parent. */}
      <Button
        title="Open profile"
        onPress={() =>
          navigation
            .getParent<RootParamList>()
            ?.navigate('Profile', { userId: '7', name: 'jayant' })
        }
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function Settings() {
  const { enabled, setEnabled } = useContext(CustomBarContext);
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.row}>
        <Text>Use custom tab bar</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>
      <SettingsFooter />
    </View>
  );
}

// Any nested component can reach the tabs through the hook.
function SettingsFooter() {
  const tabs = useTabs<TabName>();
  return <Button title="Back to home" onPress={() => tabs.jumpTo('Home')} />;
}

function Profile({ route }: ScreenProps<RootParamList, 'Profile'>) {
  return (
    <View style={[styles.screen, styles.profile]}>
      <Text style={styles.title}>Profile of user {route.params.userId}</Text>
      <ProfileActions />
    </View>
  );
}

function ProfileActions() {
  const navigation = useNavigation<RootParamList>();
  return (
    <View style={styles.actions}>
      <Button
        title="Push another profile"
        onPress={() =>
          navigation.navigate('Profile', {
            userId: String(Math.random()),
            name: 'jayant',
          })
        }
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button title="Pop to top" onPress={() => navigation.popToTop()} />
    </View>
  );
}

function PillTabBar({ items, jumpTo }: TabBarProps<TabName>) {
  return (
    <View style={styles.pillBar}>
      {items.map((item) => (
        <Pressable
          key={item.name}
          accessibilityRole="tab"
          accessibilityState={{ selected: item.focused }}
          onPress={() => jumpTo(item.name)}
          style={[styles.pill, item.focused && styles.pillActive]}
        >
          {item.icon?.({
            focused: item.focused,
            color: item.focused ? '#ffffff' : '#c7c7cc',
            size: 18,
          })}
          {item.focused && <Text style={styles.pillLabel}>{item.label}</Text>}
        </Pressable>
      ))}
    </View>
  );
}

function MainTabs() {
  const { enabled } = useContext(CustomBarContext);
  return (
    <BottomTabs<TabName>
      tabs={{
        // Outlined icon normally, filled while the tab is active.
        Home: {
          screen: Home,
          icon: svgIcon('homeOutlined'),
          focusedIcon: svgIcon('home'),
        },
        Search: { screen: SearchTab, icon: svgIcon('search') },
        Settings: { screen: Settings, icon: svgIcon('settings') },
      }}
      tabBar={enabled ? PillTabBar : undefined}
    />
  );
}

export default function App() {
  const [enabled, setEnabled] = useState(false);
  return (
    <CustomBarContext.Provider value={{ enabled, setEnabled }}>
      <AppNavigation<RootParamList>
        screens={{ Welcome, Main: MainTabs, Profile }}
      />
    </CustomBarContext.Provider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    gap: 16,
  },
  profile: {
    backgroundColor: '#eef3ff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  actions: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pillBar: {
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 16,
    padding: 6,
    gap: 6,
    borderRadius: 32,
    backgroundColor: '#1c1c1e',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 26,
  },
  pillActive: {
    backgroundColor: '#3a3a3c',
  },
  pillLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
