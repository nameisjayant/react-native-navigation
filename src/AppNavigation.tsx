import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ComponentType,
} from 'react';
import { BackHandler } from 'react-native';
import {
  BackInterceptorContext,
  ChildBackContext,
  IsFocusedContext,
  NavigationContext,
  NestedTargetContext,
  RouteContext,
  useIsFocused,
} from './context';
import { StackView } from './StackView';
import {
  createRoute,
  nestedTarget,
  stackReducer,
  type StackState,
} from './stack';
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

/**
 * A stack navigator. It can be nested inside a screen or a tab of another
 * navigator: names it does not have are navigated to in the parent, and back
 * goes through the innermost focused navigator first.
 */
export function AppNavigation<ParamList extends ParamListBase>({
  screens,
  initialRoute,
  initialParams,
}: AppNavigationProps<ParamList>) {
  // Set when nested inside a screen of another <AppNavigation />.
  const parent = useContext(NavigationContext);
  const target = useContext(NestedTargetContext);

  const [state, dispatch] = useReducer(
    stackReducer,
    undefined,
    (): StackState => {
      // `navigate('Parent', { screen, params })` picks the first screen.
      if (target != null && target.screen in screens) {
        return {
          stack: [createRoute(target.screen, target.params)],
          exiting: [],
        };
      }
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
  const parentRef = useRef(parent);
  parentRef.current = parent;

  const navigation = useMemo<Navigation>(() => {
    const noScreen = (name: string) =>
      new Error(
        `No screen named "${name}" in this navigator or its parents. Available screens: ${Object.keys(screensRef.current).join(', ')}`
      );
    return {
      navigate: (name: string, params?: object) => {
        if (name in screensRef.current) {
          dispatch({ type: 'push', name, params });
        } else if (parentRef.current != null) {
          parentRef.current.navigate(name, params);
        } else {
          throw noScreen(name);
        }
      },
      replace: (name: string, params?: object) => {
        if (name in screensRef.current) {
          dispatch({ type: 'replace', name, params });
        } else if (parentRef.current != null) {
          parentRef.current.replace(name, params);
        } else {
          throw noScreen(name);
        }
      },
      goBack: () => {
        if (stateRef.current.stack.length > 1) {
          dispatch({ type: 'pop' });
        } else {
          parentRef.current?.goBack();
        }
      },
      popToTop: () => dispatch({ type: 'popToTop' }),
      canGoBack: () =>
        stateRef.current.stack.length > 1 ||
        (parentRef.current?.canGoBack() ?? false),
      getParent: <P extends ParamListBase>() =>
        (parentRef.current ?? undefined) as Navigation<P> | undefined,
    };
  }, []);

  // Back handlers registered by focused screens, e.g. <BottomTabs /> switching
  // to its initial tab or a nested navigator. They run before the stack pops;
  // the latest one first.
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

  // Nested navigators in focused screens that currently handle back natively.
  // While there is one, this navigator leaves native back to it.
  const [childrenHandlingBack, setChildrenHandlingBack] = useState<
    ReadonlySet<object>
  >(() => new Set());
  const setChildHandlesBack = useCallback((child: object, handles: boolean) => {
    setChildrenHandlingBack((prev) => {
      if (prev.has(child) === handles) {
        return prev;
      }
      const next = new Set(prev);
      if (handles) {
        next.add(child);
      } else {
        next.delete(child);
      }
      return next;
    });
  }, []);
  const childHandlesBack = childrenHandlingBack.size > 0;

  // Report to the parent navigator whether back is handled in here.
  const setParentChildHandlesBack = useContext(ChildBackContext);
  const [token] = useState(() => ({}));
  const handlesBack =
    parentFocused && (state.stack.length > 1 || childHandlesBack);
  useEffect(() => {
    if (setParentChildHandlesBack == null) {
      return;
    }
    setParentChildHandlesBack(token, handlesBack);
    return () => setParentChildHandlesBack(token, false);
  }, [setParentChildHandlesBack, token, handlesBack]);

  // With more than one screen the native stack reports back through `onBack`.
  // On the root screen it lets back through: a nested navigator then hands
  // back to its parent, the top one listens for it here.
  const addParentBackInterceptor = useContext(BackInterceptorContext);
  const isRoot = state.stack.length === 1;
  useEffect(() => {
    if (!parentFocused) {
      return;
    }
    if (addParentBackInterceptor != null) {
      return addParentBackInterceptor(handleBack);
    }
    if (!isRoot) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack
    );
    return () => subscription.remove();
  }, [isRoot, parentFocused, handleBack, addParentBackInterceptor]);

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
          <NestedTargetContext.Provider value={nestedTarget(route.params)}>
            <Screen navigation={navigation} route={route} />
          </NestedTargetContext.Provider>
        </IsFocusedContext.Provider>
      </RouteContext.Provider>
    );
  };

  return (
    <NavigationContext.Provider value={navigation}>
      <BackInterceptorContext.Provider value={addBackInterceptor}>
        <ChildBackContext.Provider value={setChildHandlesBack}>
          <StackView
            stack={state.stack}
            exiting={state.exiting}
            renderScreen={renderScreen}
            backEnabled={parentFocused && !childHandlesBack}
            onBack={handleBack}
            onAttachedScreensChange={(keys) =>
              dispatch({ type: 'attachedScreensChange', keys })
            }
          />
        </ChildBackContext.Provider>
      </BackInterceptorContext.Provider>
    </NavigationContext.Provider>
  );
}
