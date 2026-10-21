import { Pressable, StyleSheet, Text } from 'react-native';
import { Icon, type IconName } from '../icons';
import { colors, radius, spacing } from '../theme';

type ChipProps = {
  label: string;
  onPress?: () => void;
  icon?: IconName;
  active?: boolean;
  /** Color of the chip while active. */
  color?: string;
};

export function Chip({
  label,
  onPress,
  icon,
  active = false,
  color = colors.primary,
}: ChipProps) {
  const foreground = active ? colors.onPrimary : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      disabled={onPress == null}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && { backgroundColor: color, borderColor: color },
        pressed && styles.pressed,
      ]}
    >
      {icon != null && <Icon name={icon} color={foreground} size={16} />}
      <Text style={[styles.label, { color: foreground }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
