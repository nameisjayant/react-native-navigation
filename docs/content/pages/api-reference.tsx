import { CodeBlock } from '@/components/CodeBlock';
import { C, DocLink, H2, H3, Table } from '@/components/Doc';

export default function ApiReference() {
  return (
    <>
      <p>
        Everything exported from <C>@nameisjayant/react-native-navigation</C>,
        with signatures. Follow the links for explanations and examples.
      </p>
      <CodeBlock lang="ts" title="exports">{`
        import {
          // Components
          AppNavigation,
          BottomTabs,
          TabBar,
          // Hooks
          useNavigation,
          useRoute,
          useIsFocused,
          useTabs,
          // Types
          type AppNavigationProps,
          type BottomTabsProps,
          type TabBarViewProps,
          type Navigation,
          type NavigatorScreenParams,
          type ParamListBase,
          type Route,
          type ScreenProps,
          type Screens,
          type TabBarItem,
          type TabBarProps,
          type TabConfig,
          type TabIcon,
          type TabIconProps,
          type TabNavigation,
          type Tabs,
          type TabScreenProps,
        } from '@nameisjayant/react-native-navigation';
      `}</CodeBlock>

      <H2>Components</H2>
      <H3>AppNavigation</H3>
      <p>
        Stack navigator. <DocLink href="/docs/app-navigation">Guide →</DocLink>
      </p>
      <CodeBlock lang="ts">{`
        function AppNavigation<ParamList extends ParamListBase>(
          props: AppNavigationProps<ParamList>
        ): JSX.Element;

        type AppNavigationProps<ParamList extends ParamListBase> = {
          screens: Screens<ParamList>;
          initialRoute?: keyof ParamList & string;
          initialParams?: object;
        };
      `}</CodeBlock>

      <H3>BottomTabs</H3>
      <p>
        Bottom tab navigator. <DocLink href="/docs/bottom-tabs">Guide →</DocLink>
      </p>
      <CodeBlock lang="ts">{`
        function BottomTabs<TabName extends string>(
          props: BottomTabsProps<TabName>
        ): JSX.Element;

        type BottomTabsProps<TabName extends string> = {
          tabs: Tabs<TabName>;
          initialTab?: TabName;
          tabBar?: ComponentType<TabBarProps<TabName>>;
          tabBarStyle?: StyleProp<ViewStyle>;
          activeTintColor?: string; // default '#1a73e8'
          inactiveTintColor?: string; // default '#5f6368'
          backBehavior?: 'initialTab' | 'none'; // default 'initialTab'
        };
      `}</CodeBlock>

      <H3>TabBar</H3>
      <p>
        The default tab bar, usable inside a custom one.{' '}
        <DocLink href="/docs/custom-tab-bar">Guide →</DocLink>
      </p>
      <CodeBlock lang="ts">{`
        function TabBar<TabName extends string>(
          props: TabBarViewProps<TabName>
        ): JSX.Element;

        type TabBarViewProps<TabName extends string> = TabBarProps<TabName> & {
          style?: StyleProp<ViewStyle>;
          activeTintColor?: string;
          inactiveTintColor?: string;
        };
      `}</CodeBlock>

      <H2>Hooks</H2>
      <Table
        head={['Hook', 'Returns', 'Throws outside']}
        rows={[
          [<DocLink key="h" href="/docs/use-navigation">useNavigation&lt;ParamList&gt;()</DocLink>, <C key="r">Navigation&lt;ParamList&gt;</C>, <C key="t">{'<AppNavigation />'}</C>],
          [<DocLink key="h" href="/docs/use-route">useRoute&lt;ParamList, Name&gt;()</DocLink>, <C key="r">Route&lt;ParamList, Name&gt;</C>, <C key="t">{'<AppNavigation />'}</C>],
          [<DocLink key="h" href="/docs/use-is-focused">useIsFocused()</DocLink>, <C key="r">boolean</C>, 'never (true outside navigators)'],
          [<DocLink key="h" href="/docs/use-tabs">useTabs&lt;TabName&gt;()</DocLink>, <C key="r">TabNavigation&lt;TabName&gt;</C>, <C key="t">{'<BottomTabs />'}</C>],
        ]}
      />

      <H2>Navigation types</H2>
      <H3>Navigation</H3>
      <CodeBlock lang="ts">{`
        type Navigation<ParamList extends ParamListBase = ParamListBase> = {
          navigate<Name extends keyof ParamList>(name: Name, params?): void;
          replace<Name extends keyof ParamList>(name: Name, params?): void;
          goBack(): void;
          popToTop(): void;
          canGoBack(): boolean;
          getParent<ParentParamList extends ParamListBase = ParamListBase>():
            Navigation<ParentParamList> | undefined;
        };
        // params is required when ParamList[Name] does not include undefined
      `}</CodeBlock>

      <H3>Route</H3>
      <CodeBlock lang="ts">{`
        type Route<ParamList, Name extends keyof ParamList> = {
          key: string; // unique per stack entry, e.g. "Profile-3"
          name: Name;
          params: ParamList[Name];
        };
      `}</CodeBlock>

      <H3>ParamListBase, ScreenProps, Screens</H3>
      <CodeBlock lang="ts">{`
        type ParamListBase = Record<string, object | undefined>;

        type ScreenProps<ParamList, Name extends keyof ParamList> = {
          navigation: Navigation<ParamList>;
          route: Route<ParamList, Name>;
        };

        type Screens<ParamList> = {
          [Name in keyof ParamList]: ComponentType<ScreenProps<ParamList, Name>>;
        };
      `}</CodeBlock>

      <H3>NavigatorScreenParams</H3>
      <p>
        Params of a route that renders a nested navigator.{' '}
        <DocLink href="/docs/opening-nested-screens">Guide →</DocLink>
      </p>
      <CodeBlock lang="ts">{`
        type NavigatorScreenParams<ParamList> =
          | { screen: 'A'; params?: ParamList['A'] } // when A's params are optional
          | { screen: 'B'; params: ParamList['B'] } // when B's params are required
          | …;
      `}</CodeBlock>

      <H2>Tab types</H2>
      <CodeBlock lang="ts">{`
        type Tabs<TabName extends string> = {
          [Name in TabName]: TabConfig<TabName>;
        };

        type TabConfig<TabName extends string> = {
          screen: ComponentType<TabScreenProps<TabName>>;
          label?: string; // defaults to the tab name
          icon?: TabIcon;
          focusedIcon?: TabIcon;
        };

        type TabScreenProps<TabName extends string> = {
          tabs: TabNavigation<TabName>;
        };

        type TabNavigation<TabName extends string> = {
          activeTab: TabName;
          jumpTo(name: TabName): void;
        };

        type TabIcon = ((props: TabIconProps) => ReactNode) | ImageSourcePropType;

        type TabIconProps = {
          focused: boolean;
          color: string;
          size: number;
        };

        // Passed to a custom tabBar
        type TabBarProps<TabName extends string> = {
          items: TabBarItem<TabName>[];
          activeTab: TabName;
          jumpTo(name: TabName): void;
        };

        type TabBarItem<TabName extends string> = {
          name: TabName;
          label: string;
          focused: boolean;
          icon?: (props: TabIconProps) => ReactNode;
        };
      `}</CodeBlock>

      <H2>Errors</H2>
      <Table
        head={['Message', 'Cause']}
        rows={[
          [<C key="m">{'<AppNavigation /> needs at least one screen.'}</C>, <><C>screens</C> is empty.</>],
          [<C key="m">{'<BottomTabs /> needs at least one tab.'}</C>, <><C>tabs</C> is empty.</>],
          [<C key="m">{'No screen named "X" in this navigator or its parents. Available screens: …'}</C>, <><C>navigate</C> / <C>replace</C> with an unknown name.</>],
          [<C key="m">{'No tab named "X". Available tabs: …'}</C>, <><C>jumpTo</C> with an unknown tab.</>],
          [<C key="m">{'useNavigation() must be used inside a screen rendered by <AppNavigation />.'}</C>, 'Hook called outside a stack screen.'],
          [<C key="m">{'useRoute() must be used inside a screen rendered by <AppNavigation />.'}</C>, 'Hook called outside a stack screen.'],
          [<C key="m">{'useTabs() must be used inside <BottomTabs />.'}</C>, 'Hook called outside tabs.'],
        ]}
      />
    </>
  );
}
