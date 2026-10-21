import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, spacing } from '../theme';

type ScreenProps = {
  children: ReactNode;
  /** Rendered above the content and kept in place while it scrolls. */
  header?: ReactNode;
  /** Renders the content in a plain view instead of a scroll view. */
  fixed?: boolean;
  backgroundColor?: string;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  header,
  fixed = false,
  backgroundColor = colors.background,
  contentStyle,
}: ScreenProps) {
  return (
    <View style={[styles.screen, { backgroundColor }]}>
      {header}
      {fixed ? (
        <View style={[styles.content, styles.fixed, contentStyle]}>
          {children}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl - 4,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.xl,
  },
  fixed: {
    flex: 1,
  },
});
