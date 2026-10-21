import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ComponentType,
} from 'react';
import { BackHandler } from 'react-native';
import {
  BackInterceptorContext,
  IsFocusedContext,
  NavigationContext,
  RouteContext,
  useIsFocused,
} from './context';
import { StackView } from './StackView';
import { createRoute, stackReducer, type StackState } from './stack';
import type {
  Navigation,
  ParamListBase,
  Route,
  ScreenProps,
  Screens,
} from './types';

export type AppNavigationProps<ParamList extends ParamListBase> = {
  /** Map of route name to screen component, e.g. `{ Home, Profile }`. */
  screens: Screens<ParamList>;
  /** Name of the first screen. Defaults to the first key of `screens`. */
  initialRoute?: keyof ParamList & string;
  /** Params for the initial screen. */
  initialParams?: object;
};

export function AppNavigation<ParamList extends ParamListBase>({
  screens,
  initialRoute,
  initialParams,
}: AppNavigationProps<ParamList>) {
  const [state, dispatch] = useReducer(
    stackReducer,
    undefined,
    (): StackState => {
      const name = initialRoute ?? Object.keys(screens)[0];
      if (name == null) {
        throw new Error('<AppNavigation /> needs at least one screen.');
      }
      return { stack: [createRoute(name, initialParams)], exiting: [] };
    }
  );

  // False when this navigator itself sits in a hidden screen or tab.
  const parentFocused = useIsFocused();

  // Let the stable navigation object read the latest props and state.
  const stateRef = useRef(state);
  stateRef.current = state;
  const screensRef = useRef(screens);
  screensRef.current = screens;

  const navigation = useMemo<Navigation>(() => {
    const assertScreen = (name: string) => {
      if (!(name in screensRef.current)) {
        throw new Error(
          `No screen named "${name}". Available screens: ${Object.keys(screensRef.current).join(', ')}`
        );
      }
    };
    return {
      navigate: (name: string, params?: object) => {
        assertScreen(name);
        dispatch({ type: 'push', name, params });
      },
      replace: (name: string, params?: object) => {
        assertScreen(name);
        dispatch({ type: 'replace', name, params });
      },
      goBack: () => dispatch({ type: 'pop' }),
      popToTop: () => dispatch({ type: 'popToTop' }),
      canGoBack: () => stateRef.current.stack.length > 1,
    };
  }, []);

  // Back handlers registered by focused screens, e.g. <BottomTabs /> switching
  // to its initial tab. They run before the stack pops; the latest one first.
  const backInterceptors = useRef<Array<() => boolean>>([]);
  const addBackInterceptor = useMemo(
    () => (handler: () => boolean) => {
      backInterceptors.current.push(handler);
      return () => {
        backInterceptors.current = backInterceptors.current.filter(
          (h) => h !== handler
        );
      };
    },
    []
  );

  const handleBack = useMemo(
    () => () => {
      for (const handler of [...backInterceptors.current].reverse()) {
        if (handler()) {
          return true;
        }
      }
      if (stateRef.current.stack.length > 1) {
        dispatch({ type: 'pop' });
        return true;
      }
      return false;
    },
    []
  );

  // With more than one screen the native stack reports back through `onBack`.
  // On the root screen it lets back through, so listen for it here.
  const isRoot = state.stack.length === 1;
  useEffect(() => {
    if (!isRoot || !parentFocused) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack
    );
    return () => subscription.remove();
  }, [isRoot, parentFocused, handleBack]);

  const renderScreen = (route: Route) => {
    const Screen = screens[route.name] as ComponentType<ScreenProps>;
    if (Screen == null) {
      return null;
    }
    const isFocused =
      parentFocused && route === state.stack[state.stack.length - 1];
    return (
      <RouteContext.Provider value={route}>
        <IsFocusedContext.Provider value={isFocused}>
          <Screen navigation={navigation} route={route} />
        </IsFocusedContext.Provider>
      </RouteContext.Provider>
    );
  };

  return (
    <NavigationContext.Provider value={navigation}>
      <BackInterceptorContext.Provider value={addBackInterceptor}>
        <StackView
          stack={state.stack}
          exiting={state.exiting}
          renderScreen={renderScreen}
          onBack={handleBack}
          onAttachedScreensChange={(keys) =>
            dispatch({ type: 'attachedScreensChange', keys })
          }
        />
      </BackInterceptorContext.Provider>
    </NavigationContext.Provider>
  );
}
