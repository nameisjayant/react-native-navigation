import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../icons';
import { colors, spacing, typography } from '../theme';

type ListRowProps = {
  title: string;
  subtitle?: string;
  /** Rendered at the left, e.g. an `<IconBadge />` or `<Avatar />`. */
  leading?: ReactNode;
  /** Rendered at the right. Defaults to a chevron when the row is pressable. */
  trailing?: ReactNode;
  onPress?: () => void;
  /** Hides the divider under the row. */
  last?: boolean;
};

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  last = false,
}: ListRowProps) {
  return (
    <Pressable
      disabled={onPress == null}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {leading}
      <View style={[styles.body, !last && styles.divider]}>
        <View style={styles.text}>
          <Text style={typography.heading} numberOfLines={1}>
            {title}
          </Text>
          {subtitle != null && (
            <Text style={typography.caption} numberOfLines={2}>
              {subtitle}
            </Text>
          )}
        </View>
        {trailing ??
          (onPress != null && (
            <Icon name="chevronRight" color={colors.textSubtle} size={20} />
          ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md + 2,
    paddingLeft: spacing.lg,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md + 2,
    paddingRight: spacing.lg,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
