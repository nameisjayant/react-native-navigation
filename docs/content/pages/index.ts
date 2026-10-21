import type { ComponentType } from 'react';
import ApiReference from './api-reference';
import AppNavigation from './app-navigation';
import BackHandling from './back-handling';
import BottomTabs from './bottom-tabs';
import CustomTabBar from './custom-tab-bar';
import HowItWorks from './how-it-works';
import Installation from './installation';
import Introduction from './introduction';
import Navigating from './navigating';
import NestedNavigators from './nested-navigators';
import OpeningNestedScreens from './opening-nested-screens';
import QuickStart from './quick-start';
import RouteParams from './route-params';
import TabIcons from './tab-icons';
import TypeSafety from './type-safety';
import UseIsFocused from './use-is-focused';
import UseNavigation from './use-navigation';
import UseRoute from './use-route';
import UseTabs from './use-tabs';

/** Page content by slug. Titles and order live in `content/nav.ts`. */
export const pages: Record<string, ComponentType | undefined> = {
  'introduction': Introduction,
  'installation': Installation,
  'quick-start': QuickStart,
  'app-navigation': AppNavigation,
  'navigating': Navigating,
  'route-params': RouteParams,
  'use-navigation': UseNavigation,
  'use-route': UseRoute,
  'use-is-focused': UseIsFocused,
  'use-tabs': UseTabs,
  'bottom-tabs': BottomTabs,
  'tab-icons': TabIcons,
  'custom-tab-bar': CustomTabBar,
  'nested-navigators': NestedNavigators,
  'opening-nested-screens': OpeningNestedScreens,
  'type-safety': TypeSafety,
  'back-handling': BackHandling,
  'how-it-works': HowItWorks,
  'api-reference': ApiReference,
};
