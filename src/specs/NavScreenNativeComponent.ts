import { codegenNativeComponent, type ViewProps } from 'react-native';

export interface NativeProps extends ViewProps {
  /** Matches an entry of the container's `stack`. */
  screenKey: string;
}

export default codegenNativeComponent<NativeProps>('RNNavScreen');
