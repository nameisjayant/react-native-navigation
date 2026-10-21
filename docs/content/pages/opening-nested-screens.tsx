import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, DocLink, H2, H3 } from '@/components/Doc';

export default function OpeningNestedScreens() {
  return (
    <>
      <p>
        Sometimes you want to open the tabs on a <strong>specific tab</strong>,
        or even on a specific screen <strong>inside</strong> that tab — for a
        notification, a deep link or a “See all” button. Pass a{' '}
        <C>screen</C> (and optionally <C>params</C>) to the route that renders
        the nested navigator.
      </p>

      <H2>Open a specific tab</H2>
      <CodeBlock>{`
        // From the Welcome screen of the root stack
        navigation.navigate('Main', { screen: 'Settings' });
      `}</CodeBlock>
      <p>
        <C>Main</C> renders <C>{'<BottomTabs />'}</C>. When it mounts, it reads{' '}
        <C>screen</C> and starts on the <em>Settings</em> tab instead of its
        initial tab.
      </p>

      <H2>Open a screen two levels deep</H2>
      <p>
        Nest the same shape again: <C>params</C> of the tab are forwarded to the
        navigator inside that tab.
      </p>
      <CodeBlock>{`
        navigation.navigate('Main', {
          screen: 'Search', // the tab
          params: {
            screen: 'SearchResult', // the screen of the stack in that tab
            params: { query: 'compose' }, // that screen's own params
          },
        });
      `}</CodeBlock>

      <H2>Typing it with NavigatorScreenParams</H2>
      <p>
        Declare the params of a route that renders a navigator with{' '}
        <C>NavigatorScreenParams</C>. TypeScript then checks the nested{' '}
        <C>screen</C> names and their params at every level:
      </p>
      <CodeBlock lang="ts" title="navigation/types.ts">{`
        import type { NavigatorScreenParams } from '@nameisjayant/react-native-navigation';

        export type SearchParamList = {
          SearchList: undefined;
          SearchResult: { query: string };
        };

        export type TabParamList = {
          Home: undefined;
          Search: NavigatorScreenParams<SearchParamList> | undefined;
          Settings: undefined;
        };

        export type RootParamList = {
          Welcome: undefined;
          // "| undefined" keeps navigate('Main') valid without params
          Main: NavigatorScreenParams<TabParamList> | undefined;
          Profile: { userId: string };
        };
      `}</CodeBlock>
      <CodeBlock>{`
        navigation.navigate('Main', { screen: 'Searh' });
        // ❌ type error: "Searh" is not a tab of Main

        navigation.navigate('Main', {
          screen: 'Search',
          params: { screen: 'SearchResult' },
        });
        // ❌ type error: SearchResult requires params: { query: string }
      `}</CodeBlock>

      <H2>Rules to remember</H2>
      <H3>It applies on first render</H3>
      <p>
        The <C>screen</C> param is read when the nested navigator{' '}
        <strong>mounts</strong>. Since <C>navigate()</C> always pushes a new
        entry, <C>navigate(&apos;Main&apos;, …)</C> from outside the tabs
        creates a fresh <C>Main</C> that honors it. <C>replace()</C> works the
        same way.
      </p>
      <Callout type="tip" title="Already inside the tabs?">
        <p>
          To switch tab from within the tabs, call{' '}
          <C>useTabs().jumpTo(&apos;Settings&apos;)</C> instead — navigating to{' '}
          <C>Main</C> again would push a second tab bar on the stack.
        </p>
      </Callout>

      <H3>The target becomes the first screen</H3>
      <p>
        For a nested <strong>stack</strong>, the target screen replaces its
        initial screen — it is not pushed on top of it. In the example above
        the search stack contains only <C>SearchResult</C>, so back leaves the
        tabs instead of showing <C>SearchList</C>.
      </p>
      <p>
        For <strong>tabs</strong>, the target tab is shown first but{' '}
        <C>initialTab</C> stays the “home” tab: back on Android still returns
        to it (see{' '}
        <DocLink href="/docs/back-handling">Android Back Button</DocLink>).
      </p>

      <H3>Unknown names are ignored</H3>
      <p>
        If <C>screen</C> does not match any screen or tab of the nested
        navigator, it falls back to its normal initial screen.
      </p>
    </>
  );
}
