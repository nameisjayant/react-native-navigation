import { StyleSheet } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme';

export const styles = StyleSheet.create({
  variants: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  variant: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm + 2,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
    ...shadow,
  },
  variantFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preview: {
    height: 84,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  previewClassic: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  previewDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  previewFloating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: spacing.sm,
    padding: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
  },
  previewPill: {
    width: 40,
    height: 16,
    borderRadius: radius.pill,
  },
  previewDotDark: {
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#3a3d5c',
  },
  swatches: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  swatchRing: {
    padding: 3,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatch: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  accentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  version: {
    textAlign: 'center',
  },
});
