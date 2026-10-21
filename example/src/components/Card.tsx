import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

type CardProps = {
  children: ReactNode;
  /** Removes the inner padding, e.g. for a list of rows. */
  flush?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, flush = false, style }: CardProps) {
  return (
    <View style={[styles.card, !flush && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow,
  },
  padded: {
    padding: spacing.lg + 2,
    gap: spacing.md,
  },
});
