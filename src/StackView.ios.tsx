import { StyleSheet } from 'react-native';
import NavigationContainerNativeComponent from './specs/NavigationContainerNativeComponent';
import NavScreenNativeComponent from './specs/NavScreenNativeComponent';
import type { StackViewProps } from './StackView';

/**
 * iOS: the back stack is rendered by a SwiftUI `NavigationStack`. Every route
 * is mounted as a native screen view, and the native side places the views
 * inside the matching navigation entry. Swipe back pops natively and is
 * reported through `onPop`.
 */
export function StackView({
  stack,
  exiting,
  renderScreen,
  backEnabled,
  onPop,
  onAttachedScreensChange,
}: StackViewProps) {
  return (
    <NavigationContainerNativeComponent
      style={styles.container}
      stack={stack.map((route) => route.key)}
      backEnabled={backEnabled}
      onPop={(event) => onPop(event.nativeEvent.key)}
      onAttachedScreensChange={(event) =>
        onAttachedScreensChange(event.nativeEvent.keys)
      }
    >
      {[...stack, ...exiting].map((route) => (
        <NavScreenNativeComponent
          key={route.key}
          screenKey={route.key}
          style={StyleSheet.absoluteFill}
        >
          {renderScreen(route)}
        </NavScreenNativeComponent>
      ))}
    </NavigationContainerNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
