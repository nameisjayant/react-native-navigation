import { createContext, useContext } from 'react';
import type { Navigation, ParamListBase, Route } from './types';

export const NavigationContext = createContext<Navigation | null>(null);
export const RouteContext = createContext<Route | null>(null);

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
