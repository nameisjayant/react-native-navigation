import type { ComponentType, ReactNode } from 'react';
import type { ImageSourcePropType } from 'react-native';

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
  /**
   * Push a new screen on top of the back stack. A name this navigator does not
   * have is passed on to the parent navigator.
   */
  navigate<Name extends keyof ParamList>(
    name: Name,
    ...params: undefined extends ParamList[Name]
      ? [params?: ParamList[Name]]
      : [params: ParamList[Name]]
  ): void;
  /**
   * Replace the current screen with a new one. A name this navigator does not
   * have is passed on to the parent navigator.
   */
  replace<Name extends keyof ParamList>(
    name: Name,
    ...params: undefined extends ParamList[Name]
      ? [params?: ParamList[Name]]
      : [params: ParamList[Name]]
  ): void;
  /**
   * Pop the current screen. On the root screen of a nested navigator, goes
   * back in the parent instead; no-op on the root screen of the top one.
   */
  goBack(): void;
  /** Pop everything above the root screen. */
  popToTop(): void;
  /** Whether there is a screen to go back to, in this navigator or a parent. */
  canGoBack(): boolean;
  /**
   * The navigator this one is nested in, or undefined for the top one. A
   * `<BottomTabs />` in between is skipped; reach it with `useTabs()`.
   */
  getParent<ParentParamList extends ParamListBase = ParamListBase>():
    Navigation<ParentParamList> | undefined;
};

/**
 * Params of a screen that renders a nested navigator, to open a given screen
 * (or tab) of it, e.g. `navigate('Main', { screen: 'Search', params })`.
 * Applies when the nested navigator is first rendered.
 */
export type NavigatorScreenParams<ParamList extends ParamListBase> = {
  [Name in keyof ParamList]: undefined extends ParamList[Name]
    ? { screen: Name; params?: ParamList[Name] }
    : { screen: Name; params: ParamList[Name] };
}[keyof ParamList];

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

export type TabNavigation<TabName extends string = string> = {
  /** Name of the visible tab. */
  activeTab: TabName;
  /** Switch to another tab. */
  jumpTo(name: TabName): void;
};

export type TabScreenProps<TabName extends string = string> = {
  tabs: TabNavigation<TabName>;
};

export type TabIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

/**
 * A tab icon, either:
 * - a render function, for SVG components, icon fonts or anything else:
 *   `({ color, size }) => <HomeSvg width={size} height={size} color={color} />`
 *   `({ color, size }) => <MaterialIcons name="home" color={color} size={size} />`
 *   It is called during render, so it must not use hooks.
 * - an image source, e.g. `require('./home.png')` or `{ uri: '...' }`. It is
 *   tinted with the tab color; for a full-color image use a render function
 *   returning an `<Image />`.
 */
export type TabIcon =
  ((props: TabIconProps) => ReactNode) | ImageSourcePropType;

export type TabConfig<TabName extends string = string> = {
  screen: ComponentType<TabScreenProps<TabName>>;
  /** Text shown in the tab bar. Defaults to the tab name. */
  label?: string;
  /** Icon of the tab. Also used when focused unless `focusedIcon` is set. */
  icon?: TabIcon;
  /** Icon shown while the tab is active, e.g. a filled variant. */
  focusedIcon?: TabIcon;
};

export type Tabs<TabName extends string = string> = {
  [Name in TabName]: TabConfig<TabName>;
};

export type TabBarItem<TabName extends string = string> = {
  name: TabName;
  label: string;
  focused: boolean;
  /**
   * Renders the tab's icon (or `focusedIcon` when `focused` is true), whatever
   * form it was given in. Undefined when the tab has no icon.
   */
  icon?: (props: TabIconProps) => ReactNode;
};

/** Props passed to a custom `tabBar`. */
export type TabBarProps<TabName extends string = string> = {
  items: TabBarItem<TabName>[];
  activeTab: TabName;
  jumpTo(name: TabName): void;
};
