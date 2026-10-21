import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TabBarProps } from '@nameisjayant/react-native-navigation';
import { usePreferences } from '../context/PreferencesContext';
import { colors, radius, spacing } from '../theme';
import type { TabName } from './types';

/**
 * A custom tab bar passed as `tabBar` to `<BottomTabs />`: a dark floating
 * capsule where the active tab expands to show its label.
 */
export function FloatingTabBar({ items, jumpTo }: TabBarProps<TabName>) {
  const { accent } = usePreferences();
  return (
    <View style={styles.wrapper}>
      <View accessibilityRole="tablist" style={styles.bar}>
        {items.map((item) => (
          <Pressable
            key={item.name}
            accessibilityRole="tab"
            accessibilityState={{ selected: item.focused }}
            accessibilityLabel={item.label}
            onPress={() => jumpTo(item.name)}
            style={[
              styles.item,
              item.focused && [
                styles.active,
                { backgroundColor: accent.color },
              ],
            ]}
          >
            {item.icon?.({
              focused: item.focused,
              color: item.focused ? colors.onPrimary : colors.inkMuted,
              size: 22,
            })}
            {item.focused && <Text style={styles.label}>{item.label}</Text>}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.sm - 2,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    shadowColor: colors.ink,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    minWidth: 56,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
  },
  active: {
    paddingHorizontal: spacing.lg + 4,
  },
  label: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
