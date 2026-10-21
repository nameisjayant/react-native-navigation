import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

/** A small code label naming the library API a control uses. */
export function ApiTag({ children }: { children: string }) {
  return (
    <View style={styles.tag}>
      <Text style={[typography.mono, styles.text]} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm - 4,
    backgroundColor: colors.surfaceMuted,
  },
  text: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
