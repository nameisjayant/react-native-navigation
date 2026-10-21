import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@nameisjayant/react-native-navigation';
import { colors, radius, spacing } from '../theme';

/**
 * Shows whether the screen it is in is the visible one, and how many times it
 * has gained focus. Push a screen on top and come back to see it count.
 */
export function FocusBadge() {
  const isFocused = useIsFocused();
  const [focusCount, setFocusCount] = useState(0);

  useEffect(() => {
    if (isFocused) {
      setFocusCount((count) => count + 1);
    }
  }, [isFocused]);

  return (
    <View style={styles.badge}>
      <View
        style={[
          styles.dot,
          { backgroundColor: isFocused ? colors.success : colors.textSubtle },
        ]}
      />
      <Text style={styles.label}>
        {isFocused ? 'Focused' : 'Blurred'} · {focusCount}×
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});
