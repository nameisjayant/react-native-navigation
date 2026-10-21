import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import {
  BackHandler,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  BackInterceptorContext,
  IsFocusedContext,
  NestedTargetContext,
  TabsContext,
  useIsFocused,
} from './context';
import { nestedTarget } from './stack';
import type {
  TabBarProps,
  TabConfig,
  TabIconProps,
  TabNavigation,
  Tabs,
} from './types';

export type BottomTabsProps<TabName extends string> = {
  /** Map of tab name to its screen, label and icon. Order is bar order. */
  tabs: Tabs<TabName>;
  /** Name of the first tab. Defaults to the first key of `tabs`. */
  initialTab?: NoInfer<TabName>;
  /**
   * Component to render instead of the default tab bar. Define it outside of
   * render (or memoize it) so it is not remounted on every render.
   */
  tabBar?: ComponentType<TabBarProps<TabName>>;
  /** Style of the default tab bar. */
  tabBarStyle?: StyleProp<ViewStyle>;
  /** Icon and label color of the active tab in the default tab bar. */
  activeTintColor?: string;
  /** Icon and label color of inactive tabs in the default tab bar. */
  inactiveTintColor?: string;
  /**
   * What the Android back button does on a tab other than `initialTab`:
   * `'initialTab'` (default) switches to it, `'none'` leaves back alone.
   */
  backBehavior?: 'initialTab' | 'none';
};

export function BottomTabs<TabName extends string>({
  tabs,
  initialTab,
  tabBar: CustomTabBar,
  tabBarStyle,
  activeTintColor,
  inactiveTintColor,
  backBehavior = 'initialTab',
}: BottomTabsProps<TabName>) {
  const [homeTab] = useState<TabName>(() => {
    const name = initialTab ?? (Object.keys(tabs)[0] as TabName | undefined);
    if (name == null) {
      throw new Error('<BottomTabs /> needs at least one tab.');
    }
    return name;
  });
  // `navigate('Parent', { screen: 'SomeTab', params })` opens that tab first.
  const target = useContext(NestedTargetContext);
  const [initialTarget] = useState(() =>
    target != null && target.screen in tabs ? target : undefined
  );
  const [activeTab, setActiveTab] = useState(
    () => (initialTarget?.screen as TabName | undefined) ?? homeTab
  );
  // Tabs mount on first visit and stay mounted to keep their state.
  const [visited, setVisited] = useState<ReadonlySet<TabName>>(
    () => new Set([activeTab])
  );

  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  const jumpTo = useCallback((name: TabName) => {
    if (!(name in tabsRef.current)) {
      throw new Error(
        `No tab named "${name}". Available tabs: ${Object.keys(tabsRef.current).join(', ')}`
      );
    }
    setActiveTab(name);
    setVisited((prev) => (prev.has(name) ? prev : new Set(prev).add(name)));
  }, []);

  const isFocused = useIsFocused();

  const addBackInterceptor = useContext(BackInterceptorContext);

  useEffect(() => {
    if (backBehavior === 'none' || !isFocused || activeTab === homeTab) {
      return;
    }
    const handler = () => {
      jumpTo(homeTab);
      return true;
    };
    if (addBackInterceptor != null) {
      return addBackInterceptor(handler);
    }
    // Not inside <AppNavigation />: listen to the system back directly.
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handler
    );
    return () => subscription.remove();
  }, [backBehavior, isFocused, activeTab, homeTab, jumpTo, addBackInterceptor]);

  const navigation = useMemo<TabNavigation<TabName>>(
    () => ({ activeTab, jumpTo }),
    [activeTab, jumpTo]
  );

  const names = Object.keys(tabs) as TabName[];
  const tabBarProps: TabBarProps<TabName> = {
    items: names.map((name) => ({
      name,
      label: tabs[name].label ?? name,
      focused: name === activeTab,
      icon: iconRenderer(tabs[name]),
    })),
    activeTab,
    jumpTo,
  };

  return (
    <TabsContext.Provider value={navigation}>
      <View style={styles.container}>
        <View style={styles.content}>
          {names
            .filter((name) => visited.has(name))
            .map((name) => {
              const Screen = tabs[name].screen;
              return (
                <View
                  key={name}
                  style={[
                    StyleSheet.absoluteFill,
                    name !== activeTab && styles.hidden,
                  ]}
                >
                  <IsFocusedContext.Provider
                    value={isFocused && name === activeTab}
                  >
                    {/* The target's params pick the screen of a navigator nested in the tab. */}
                    <NestedTargetContext.Provider
                      value={
                        name === initialTarget?.screen
                          ? nestedTarget(initialTarget.params)
                          : undefined
                      }
                    >
                      <Screen tabs={navigation} />
                    </NestedTargetContext.Provider>
                  </IsFocusedContext.Provider>
                </View>
              );
            })}
        </View>
        {CustomTabBar ? (
          <CustomTabBar {...tabBarProps} />
        ) : (
          <TabBar
            {...tabBarProps}
            style={tabBarStyle}
            activeTintColor={activeTintColor}
            inactiveTintColor={inactiveTintColor}
          />
        )}
      </View>
    </TabsContext.Provider>
  );
}

/** Turns a tab's `icon` / `focusedIcon`, in any supported form, into a render function. */
function iconRenderer(
  config: Pick<TabConfig, 'icon' | 'focusedIcon'>
): ((props: TabIconProps) => ReactNode) | undefined {
  const { icon, focusedIcon } = config;
  if (icon == null && focusedIcon == null) {
    return undefined;
  }
  return (props) => {
    const current = props.focused
      ? (focusedIcon ?? icon)
      : (icon ?? focusedIcon);
    if (typeof current === 'function') {
      return current(props);
    }
    return (
      <Image
        source={current}
        resizeMode="contain"
        style={{
          width: props.size,
          height: props.size,
          tintColor: props.color,
        }}
      />
    );
  };
}

export type TabBarViewProps<TabName extends string> = TabBarProps<TabName> & {
  style?: StyleProp<ViewStyle>;
  activeTintColor?: string;
  inactiveTintColor?: string;
};

/** The default tab bar. Also usable as a building block for a custom one. */
export function TabBar<TabName extends string>({
  items,
  jumpTo,
  style,
  activeTintColor = '#1a73e8',
  inactiveTintColor = '#5f6368',
}: TabBarViewProps<TabName>) {
  return (
    <View accessibilityRole="tablist" style={[styles.tabBar, style]}>
      {items.map((item) => {
        const color = item.focused ? activeTintColor : inactiveTintColor;
        return (
          <Pressable
            key={item.name}
            accessibilityRole="tab"
            accessibilityState={{ selected: item.focused }}
            accessibilityLabel={item.label}
            onPress={() => jumpTo(item.name)}
            style={styles.tab}
          >
            {item.icon?.({ focused: item.focused, color, size: 24 })}
            <Text style={[styles.label, { color }]} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#dadce0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
