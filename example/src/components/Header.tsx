import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@nameisjayant/react-native-navigation';
import { Icon } from '../icons';
import { colors, radius, spacing, typography } from '../theme';

type HeaderProps = {
  title?: string;
  overline?: string;
  subtitle?: string;
  /** Shows a back button calling `navigation.goBack()`. */
  back?: boolean;
  /** Rendered at the right of the top row, e.g. a badge. */
  right?: ReactNode;
};

export function Header({
  title,
  overline,
  subtitle,
  back,
  right,
}: HeaderProps) {
  return (
    <View style={styles.header}>
      {(back || right) && (
        <View style={styles.topRow}>
          {back ? <BackButton /> : <View />}
          {right}
        </View>
      )}
      {overline != null && <Text style={typography.overline}>{overline}</Text>}
      {title != null && (
        <Text style={typography.title} numberOfLines={2}>
          {title}
        </Text>
      )}
      {subtitle != null && <Text style={typography.body}>{subtitle}</Text>}
    </View>
  );
}

function BackButton() {
  // Any component inside a screen can reach its navigator with the hook.
  const navigation = useNavigation();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      onPress={() => navigation.goBack()}
      style={({ pressed }) => [styles.back, pressed && styles.pressed]}
    >
      <Icon name="arrowBack" color={colors.text} size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl - 4,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.6,
  },
});
