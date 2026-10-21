import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';

export const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  note: {
    marginTop: -spacing.md,
    paddingHorizontal: spacing.xs,
  },
  actions: {
    gap: spacing.md,
  },
  apiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
