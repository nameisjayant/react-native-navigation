import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Route } from './types';

export type StackViewProps = {
  stack: Route[];
  exiting: Route[];
  renderScreen: (route: Route) => ReactNode;
  /**
   * Whether the native stack may handle back. False while the navigator is
   * hidden or a nested navigator handles back instead.
   */
  backEnabled: boolean;
  onBack: () => void;
  /** iOS: the user popped the screen with `key` natively. */
  onPop: (key: string) => void;
  onAttachedScreensChange: (keys: ReadonlyArray<string>) => void;
};

/**
 * Fallback for platforms without a native implementation (web): keeps every screen mounted and shows only the top one.
 */
export function StackView({ stack, renderScreen }: StackViewProps) {
  return (
    <View style={styles.container}>
      {stack.map((route, index) => (
        <View
          key={route.key}
          style={[
            StyleSheet.absoluteFill,
            index !== stack.length - 1 && styles.hidden,
          ]}
        >
          {renderScreen(route)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
});
