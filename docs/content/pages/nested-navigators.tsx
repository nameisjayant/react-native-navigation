import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, Diagram, DocLink, H2, H3, Table } from '@/components/Doc';

export default function NestedNavigators() {
  return (
    <>
      <p>
        Real apps combine navigators: a root stack that holds a tab bar, and a
        tab that has its own stack of screens. Nesting is simply{' '}
        <strong>rendering a navigator as a screen</strong> — no extra
        registration needed.
      </p>

      <H2>The classic layout</H2>
      <Diagram>
        {'AppNavigation  '}<b>root stack</b>{'\n'}
        {'├── Welcome\n'}
        {'├── Main  →  BottomTabs\n'}
        {'│            ├── Home\n'}
        {'│            ├── Search  →  AppNavigation  '}<b>search stack</b>{'\n'}
        {'│            │              ├── SearchList\n'}
        {'│            │              └── SearchResult\n'}
        {'│            └── Settings\n'}
        {'└── Profile           '}<b>covers the tab bar</b>
      </Diagram>

      <H3>1. The stack inside a tab</H3>
      <CodeBlock title="SearchNavigator.tsx">{`
        import { AppNavigation } from '@nameisjayant/react-native-navigation';
        import type { SearchParamList } from './types';

        // Screens of this stack open *under* the tab bar.
        export function SearchNavigator() {
          return (
            <AppNavigation<SearchParamList>
              screens={{
                SearchList: SearchListScreen,
                SearchResult: SearchResultScreen,
              }}
            />
          );
        }
      `}</CodeBlock>

      <H3>2. The tabs, using it as a screen</H3>
      <CodeBlock title="MainTabs.tsx">{`
        export function MainTabs() {
          return (
            <BottomTabs<TabName>
              tabs={{
                Home: { screen: HomeScreen },
                Search: { screen: SearchNavigator, label: 'Explore' },
                Settings: { screen: SettingsScreen },
              }}
            />
          );
        }
      `}</CodeBlock>

      <H3>3. The root stack</H3>
      <CodeBlock title="RootNavigator.tsx">{`
        export function RootNavigator() {
          return (
            <AppNavigation<RootParamList>
              screens={{
                Welcome: WelcomeScreen,
                Main: MainTabs,
                Profile: ProfileScreen,
              }}
            />
          );
        }
      `}</CodeBlock>

      <H2>How nested navigators cooperate</H2>
      <Table
        head={['Action', 'What happens']}
        rows={[
          [<C key="a">navigate(&apos;SearchResult&apos;)</C>, 'The search stack has it, so it is pushed there — under the tab bar.'],
          [<C key="a">navigate(&apos;Profile&apos;)</C>, 'The search stack does not have it, so the call bubbles up to the root stack. Profile opens over the tabs.'],
          [<C key="a">goBack()</C>, 'Pops the search stack. On its first screen, goes back in the root stack instead.'],
          [<C key="a">popToTop()</C>, 'Only affects the stack it is called on — here, back to SearchList.'],
          [<C key="a">canGoBack()</C>, 'True if this stack or any parent stack can go back.'],
          [<C key="a">useNavigation()</C>, 'Returns the closest stack: the search stack inside the Search tab.'],
          [<C key="a">useTabs()</C>, 'Works from any screen of the search stack.'],
        ]}
      />

      <H2>Bubbling, step by step</H2>
      <p>
        When <C>navigate(name)</C> is called, each navigator asks itself:{' '}
        <em>“do I have a screen with this name?”</em>
      </p>
      <ol>
        <li>Yes → push it here.</li>
        <li>No → hand the call to the parent stack and repeat.</li>
        <li>
          No parent left → throw an error listing the available screens.
        </li>
      </ol>
      <p>
        This means a screen deep in a tab can open any screen in the app by
        name, and you choose <em>where</em> a screen opens simply by deciding
        which navigator declares it.
      </p>
      <Callout type="tip" title="Designing your tree">
        <p>
          Declare a screen in the tab&apos;s stack if the tab bar should stay
          visible; declare it in the root stack if it should cover the tabs
          (full-screen details, checkout, settings, auth).
        </p>
      </Callout>

      <H2>Typing parent calls</H2>
      <p>
        Bubbling works at runtime, but the inner stack&apos;s param list
        doesn&apos;t know about root routes. Use <C>getParent()</C> with the
        parent&apos;s param list to keep the call type-checked:
      </p>
      <CodeBlock title="SearchResultScreen.tsx">{`
        export function SearchResultScreen({
          navigation,
        }: ScreenProps<SearchParamList, 'SearchResult'>) {
          const openAuthor = (userId: string) =>
            navigation.getParent<RootParamList>()?.navigate('Profile', { userId });
          // …
        }
      `}</CodeBlock>
      <p>
        Or simply call <C>useNavigation&lt;RootParamList&gt;()</C> in a component
        that only needs root routes.
      </p>

      <H2>State is kept per tab</H2>
      <p>
        Since tabs stay mounted, each tab&apos;s nested stack keeps its own
        history. Open a search result, switch to Home, come back to Search:
        the result is still on screen, and back still returns to the list.
      </p>

      <Callout type="note">
        <p>
          You can also nest a stack directly inside a stack screen (for
          example an onboarding flow), or tabs inside a nested stack. The same
          rules apply at every level. To open a nested screen directly from
          outside, see{' '}
          <DocLink href="/docs/opening-nested-screens">
            Opening Nested Screens
          </DocLink>
          .
        </p>
      </Callout>
    </>
  );
}
