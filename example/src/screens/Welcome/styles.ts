import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';

export const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
  },
  hero: {
    overflow: 'hidden',
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    gap: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.ink,
  },
  glow: {
    position: 'absolute',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  glowLarge: {
    width: 260,
    height: 260,
    top: -120,
    right: -90,
    opacity: 0.35,
  },
  glowSmall: {
    width: 120,
    height: 120,
    top: 60,
    right: 40,
    opacity: 0.2,
    backgroundColor: '#e11d74',
  },
  logo: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md + 2,
    backgroundColor: colors.primary,
  },
  heroTitle: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.onPrimary,
  },
  heroBody: {
    fontSize: 16,
    lineHeight: 23,
    color: colors.inkMuted,
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  highlight: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  highlightLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  footer: {
    gap: spacing.md,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
