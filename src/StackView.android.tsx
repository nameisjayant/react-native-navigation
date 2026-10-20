import { StyleSheet } from 'react-native';
import NavigationContainerNativeComponent from './specs/NavigationContainerNativeComponent';
import NavScreenNativeComponent from './specs/NavScreenNativeComponent';
import type { StackViewProps } from './StackView';

/**
 * Android: the back stack is rendered by Jetpack Compose Navigation 3
 * (`NavDisplay`). Every route is mounted as a native screen view, and the
 * native side places the views inside the matching `NavEntry`.
 */
export function StackView({
  stack,
  exiting,
  renderScreen,
  onBack,
  onAttachedScreensChange,
}: StackViewProps) {
  return (
    <NavigationContainerNativeComponent
      style={styles.container}
      stack={stack.map((route) => route.key)}
      onBack={onBack}
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
