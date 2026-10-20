import type { ComponentType } from 'react';

export type ParamListBase = Record<string, object | undefined>;

export type Route<
  ParamList extends ParamListBase = ParamListBase,
  Name extends keyof ParamList = keyof ParamList,
> = {
  /** Unique key of this entry in the back stack. */
  key: string;
  name: Name;
  params: ParamList[Name];
};

export type Navigation<ParamList extends ParamListBase = ParamListBase> = {
  /** Push a new screen on top of the back stack. */
  navigate<Name extends keyof ParamList>(
    name: Name,
    ...params: undefined extends ParamList[Name]
      ? [params?: ParamList[Name]]
      : [params: ParamList[Name]]
  ): void;
  /** Replace the current screen with a new one. */
  replace<Name extends keyof ParamList>(
    name: Name,
    ...params: undefined extends ParamList[Name]
      ? [params?: ParamList[Name]]
      : [params: ParamList[Name]]
  ): void;
  /** Pop the current screen. No-op on the root screen. */
  goBack(): void;
  /** Pop everything above the root screen. */
  popToTop(): void;
  /** Whether there is a screen to go back to. */
  canGoBack(): boolean;
};

export type ScreenProps<
  ParamList extends ParamListBase = ParamListBase,
  Name extends keyof ParamList = keyof ParamList,
> = {
  navigation: Navigation<ParamList>;
  route: Route<ParamList, Name>;
};

export type Screens<ParamList extends ParamListBase = ParamListBase> = {
  [Name in keyof ParamList]: ComponentType<ScreenProps<ParamList, Name>>;
};
