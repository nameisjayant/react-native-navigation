import { useMemo, useReducer, useRef, type ComponentType } from 'react';
import { NavigationContext, RouteContext } from './context';
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

  const renderScreen = (route: Route) => {
    const Screen = screens[route.name] as ComponentType<ScreenProps>;
    if (Screen == null) {
      return null;
    }
    return (
      <RouteContext.Provider value={route}>
        <Screen navigation={navigation} route={route} />
      </RouteContext.Provider>
    );
  };

  return (
    <NavigationContext.Provider value={navigation}>
      <StackView
        stack={state.stack}
        exiting={state.exiting}
        renderScreen={renderScreen}
        onBack={navigation.goBack}
        onAttachedScreensChange={(keys) =>
          dispatch({ type: 'attachedScreensChange', keys })
        }
      />
    </NavigationContext.Provider>
  );
}
