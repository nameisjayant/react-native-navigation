import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, DocLink, H2, Step, Steps, Table } from '@/components/Doc';

export default function TypeSafety() {
  return (
    <>
      <p>
        Everything works without types, but a few small declarations turn
        navigation mistakes — typos in route names, missing or wrong params —
        into <strong>compile-time errors</strong> with autocomplete in your
        editor.
      </p>

      <Steps>
        <Step title="Declare a param list per navigator">
          <p>
            One type per navigator, mapping each route name to its params.
          </p>
          <CodeBlock lang="ts" title="navigation/types.ts">{`
            import type {
              NavigatorScreenParams,
              ScreenProps,
            } from '@nameisjayant/react-native-navigation';

            export type RootParamList = {
              Welcome: undefined;
              Main: NavigatorScreenParams<TabParamList> | undefined;
              Profile: { userId: string };
            };

            export type TabParamList = {
              Home: undefined;
              Search: NavigatorScreenParams<SearchParamList> | undefined;
              Settings: undefined;
            };

            export type TabName = keyof TabParamList;

            export type SearchParamList = {
              SearchList: undefined;
              SearchResult: { query: string };
            };
          `}</CodeBlock>
        </Step>

        <Step title="Add screen prop helpers">
          <CodeBlock lang="ts" title="navigation/types.ts">{`
            export type RootScreenProps<Name extends keyof RootParamList> =
              ScreenProps<RootParamList, Name>;

            export type SearchScreenProps<Name extends keyof SearchParamList> =
              ScreenProps<SearchParamList, Name>;
          `}</CodeBlock>
        </Step>

        <Step title="Type the navigators">
          <p>
            Pass the param list as a generic. Now <C>screens</C> must contain
            exactly those routes, each with a compatible component.
          </p>
          <CodeBlock>{`
            <AppNavigation<RootParamList>
              screens={{ Welcome: WelcomeScreen, Main: MainTabs, Profile: ProfileScreen }}
            />

            <BottomTabs<TabName> tabs={{ /* Home, Search, Settings */ }} />
          `}</CodeBlock>
        </Step>

        <Step title="Type the screens and hooks">
          <CodeBlock>{`
            export function ProfileScreen({ route, navigation }: RootScreenProps<'Profile'>) {
              route.params.userId; // string
              navigation.navigate('Main', { screen: 'Search' }); // checked
            }

            function Row() {
              const navigation = useNavigation<RootParamList>();
              const route = useRoute<RootParamList, 'Profile'>();
              const tabs = useTabs<TabName>();
            }
          `}</CodeBlock>
        </Step>
      </Steps>

      <H2>What gets checked</H2>
      <Table
        head={['Mistake', 'Caught?']}
        rows={[
          [<C key="m">navigate(&apos;Profle&apos;)</C>, '✅ unknown route name'],
          [<C key="m">navigate(&apos;Profile&apos;)</C>, '✅ missing required params'],
          [<C key="m">{"navigate('Profile', { id: '1' })"}</C>, '✅ wrong param shape'],
          [<C key="m">{"navigate('Main', { screen: 'Serch' })"}</C>, '✅ unknown nested screen'],
          [<C key="m">{"screens={{ Home }}"}</C>, '✅ a route of the param list is missing'],
          [<C key="m">jumpTo(&apos;Profile&apos;)</C>, '✅ not a tab name'],
          [<C key="m">initialTab=&quot;Feed&quot;</C>, '✅ not a tab name'],
        ]}
      />

      <H2>Route name constants</H2>
      <p>
        To avoid spelling route names by hand, keep them in constant objects.{' '}
        <C>satisfies</C> makes the compiler check each object against its param
        list — a missing, extra or misspelled name is an error — while every
        value keeps its literal type:
      </p>
      <CodeBlock lang="ts" title="navigation/routes.ts">{`
        import type { RootParamList, SearchParamList, TabParamList } from './types';

        type NamesOf<ParamList> = { readonly [Name in keyof ParamList]: Name };

        export const Routes = {
          Welcome: 'Welcome',
          Main: 'Main',
          Profile: 'Profile',
        } as const satisfies NamesOf<RootParamList>;

        export const TabRoutes = {
          Home: 'Home',
          Search: 'Search',
          Settings: 'Settings',
        } as const satisfies NamesOf<TabParamList>;

        export const SearchRoutes = {
          SearchList: 'SearchList',
          SearchResult: 'SearchResult',
        } as const satisfies NamesOf<SearchParamList>;
      `}</CodeBlock>
      <CodeBlock>{`
        navigation.navigate(Routes.Profile, { userId: '42' }); // params still checked

        <AppNavigation<RootParamList>
          initialRoute={Routes.Welcome}
          screens={{
            [Routes.Welcome]: WelcomeScreen,
            [Routes.Main]: MainTabs,
            [Routes.Profile]: ProfileScreen,
          }}
        />
      `}</CodeBlock>
      <Callout type="tip">
        <p>
          Renaming a route is now a single change in <C>types.ts</C>: the
          compiler points at the constant to update, and “find references” on
          the constant shows every place that navigates there.
        </p>
      </Callout>

      <H2>Optional vs required params</H2>
      <Table
        head={['Param list entry', 'Valid calls']}
        rows={[
          [<C key="e">Home: undefined</C>, <C key="c">navigate(&apos;Home&apos;)</C>],
          [<C key="e">{'Profile: { userId: string }'}</C>, <C key="c">{"navigate('Profile', { userId })"}</C>],
          [<C key="e">{'Search: { q: string } | undefined'}</C>, <><C>navigate(&apos;Search&apos;)</C> or <C>{"navigate('Search', { q })"}</C></>],
        ]}
      />
      <p>
        More on nested params in{' '}
        <DocLink href="/docs/opening-nested-screens">Opening Nested Screens</DocLink>.
      </p>
    </>
  );
}
