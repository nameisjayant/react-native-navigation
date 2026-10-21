import type { RootParamList, SearchParamList, TabParamList } from './types';

/**
 * Route names as constants, so screens never spell them by hand. `satisfies`
 * makes the compiler check each list against its param list: a missing,
 * extra or misspelled name is a type error, and every value keeps its literal
 * type, so `navigate(Routes.Profile, …)` still type-checks its params.
 */
type NamesOf<ParamList> = { readonly [Name in keyof ParamList]: Name };

/** Screens of the root stack. */
export const Routes = {
  Welcome: 'Welcome',
  Main: 'Main',
  Profile: 'Profile',
  StackLab: 'StackLab',
} as const satisfies NamesOf<RootParamList>;

/** Tabs of `Routes.Main`. */
export const TabRoutes = {
  Home: 'Home',
  Search: 'Search',
  Settings: 'Settings',
} as const satisfies NamesOf<TabParamList>;

/** Screens of the stack nested in `TabRoutes.Search`. */
export const SearchRoutes = {
  SearchList: 'SearchList',
  SearchResult: 'SearchResult',
} as const satisfies NamesOf<SearchParamList>;
