import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';

export const styles = StyleSheet.create({
  visual: {
    gap: spacing.lg,
    paddingTop: spacing.xl,
  },
  layers: {
    alignSelf: 'stretch',
  },
  layer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 64,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  layerLabel: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  depthRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  depthValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.text,
  },
  routeCard: {
    gap: spacing.sm,
  },
  routeLine: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  routeLabel: {
    width: 96,
    color: colors.textSubtle,
  },
  routeValue: {
    flex: 1,
  },
  actions: {
    gap: spacing.md,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  actionText: {
    flex: 1,
    gap: spacing.xs + 2,
  },
});
