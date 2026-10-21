import type {
  NavigatorScreenParams,
  ScreenProps,
} from '@nameisjayant/react-native-navigation';

/** Screens of the root stack. Pushing one of them covers the tab bar. */
export type RootParamList = {
  Welcome: undefined;
  Main: NavigatorScreenParams<TabParamList> | undefined;
  Profile: { userId: string };
  StackLab: { depth: number };
};

/** Tabs of `Main`. `Search` renders its own stack. */
export type TabParamList = {
  Home: undefined;
  Search: NavigatorScreenParams<SearchParamList> | undefined;
  Settings: undefined;
};

export type TabName = keyof TabParamList;

/** The stack nested inside the Search tab, under the tab bar. */
export type SearchParamList = {
  SearchList: undefined;
  SearchResult: { query: string };
};

export type RootScreenProps<Name extends keyof RootParamList> = ScreenProps<
  RootParamList,
  Name
>;

export type SearchScreenProps<Name extends keyof SearchParamList> = ScreenProps<
  SearchParamList,
  Name
>;
