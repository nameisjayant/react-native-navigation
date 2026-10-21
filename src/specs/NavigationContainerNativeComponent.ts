import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

export type AttachedScreensChangeEvent = Readonly<{
  keys: string[];
}>;

export interface NativeProps extends ViewProps {
  /** Ordered list of screen keys; the last one is the visible screen. */
  stack: ReadonlyArray<string>;
  /**
   * Whether this container handles system back. Off while it is hidden or a
   * nested container handles back instead.
   */
  backEnabled?: CodegenTypes.WithDefault<boolean, true>;
  /** Fired when the user navigates back (system back / predictive back). */
  onBack?: CodegenTypes.DirectEventHandler<Readonly<{}>>;
  /**
   * Fired whenever the set of screens currently composed by Navigation 3
   * changes (e.g. after an exit animation finishes).
   */
  onAttachedScreensChange?: CodegenTypes.DirectEventHandler<AttachedScreensChangeEvent>;
}

export default codegenNativeComponent<NativeProps>('RNNavigationContainer');
