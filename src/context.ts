import { createContext, useContext } from 'react';
import type { NestedTarget } from './stack';
import type { Navigation, ParamListBase, Route, TabNavigation } from './types';

export const NavigationContext = createContext<Navigation | null>(null);
export const RouteContext = createContext<Route | null>(null);
export const IsFocusedContext = createContext(true);
export const TabsContext = createContext<TabNavigation | null>(null);

/**
 * The screen a nested navigator should open first, taken from the params of
 * the screen it is rendered in, e.g. `navigate('Main', { screen: 'Search' })`.
 */
export const NestedTargetContext = createContext<NestedTarget | undefined>(
  undefined
);

/**
 * Lets a nested navigator tell its parent whether it handles back itself
 * right now, so the parent stops handling back natively meanwhile.
 */
export type SetChildHandlesBack = (child: object, handles: boolean) => void;
export const ChildBackContext = createContext<SetChildHandlesBack | null>(null);

/**
 * Registers a handler that runs on back before the navigator pops. Returning
 * true consumes the back press. Returns a function that unregisters it.
 */
export type AddBackInterceptor = (handler: () => boolean) => () => void;
export const BackInterceptorContext = createContext<AddBackInterceptor | null>(
  null
);

/** Access the navigation functions from any component inside a screen. */
export function useNavigation<
  ParamList extends ParamListBase = ParamListBase,
>(): Navigation<ParamList> {
  const navigation = useContext(NavigationContext);
  if (navigation == null) {
    throw new Error(
      'useNavigation() must be used inside a screen rendered by <AppNavigation />.'
    );
  }
  return navigation as unknown as Navigation<ParamList>;
}

/** Access the route (name, key, params) of the screen this component is in. */
export function useRoute<
  ParamList extends ParamListBase = ParamListBase,
  Name extends keyof ParamList = keyof ParamList,
>(): Route<ParamList, Name> {
  const route = useContext(RouteContext);
  if (route == null) {
    throw new Error(
      'useRoute() must be used inside a screen rendered by <AppNavigation />.'
    );
  }
  return route as unknown as Route<ParamList, Name>;
}

/**
 * Whether the screen this component is in is the visible one: the top of the
 * stack and, inside `<BottomTabs />`, the active tab.
 */
export function useIsFocused(): boolean {
  return useContext(IsFocusedContext);
}

/** Access the tab state and `jumpTo` from any component inside a tab. */
export function useTabs<
  TabName extends string = string,
>(): TabNavigation<TabName> {
  const tabs = useContext(TabsContext);
  if (tabs == null) {
    throw new Error('useTabs() must be used inside <BottomTabs />.');
  }
  return tabs as unknown as TabNavigation<TabName>;
}
