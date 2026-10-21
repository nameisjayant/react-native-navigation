import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: colors.text,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.text,
  },
  heading: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: colors.text,
  },
  body: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.textMuted,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  overline: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textSubtle,
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: colors.text,
  },
});
