import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, DocLink, H2, Step, Steps } from '@/components/Doc';

export default function RouteParams() {
  return (
    <>
      <p>
        <strong>Params</strong> are the data a screen needs to show the right
        thing — like the id of the user whose profile you are opening. You pass
        them when navigating and read them from <C>route.params</C>.
      </p>

      <Steps>
        <Step title="Pass params when you navigate">
          <CodeBlock>{`
            navigation.navigate('Profile', { userId: '42' });
          `}</CodeBlock>
        </Step>
        <Step title="Read them in the screen">
          <CodeBlock title="ProfileScreen.tsx">{`
            export function ProfileScreen({
              route,
            }: ScreenProps<RootParamList, 'Profile'>) {
              const { userId } = route.params; // typed as string
              const user = useUser(userId);
              return <Text>{user.name}</Text>;
            }
          `}</CodeBlock>
        </Step>
        <Step title="…or from any child component">
          <p>
            Deep in the component tree? Use{' '}
            <DocLink href="/docs/use-route">useRoute()</DocLink> instead of
            passing props down.
          </p>
          <CodeBlock>{`
            function ProfileHeader() {
              const { params } = useRoute<RootParamList, 'Profile'>();
              return <Text>User {params.userId}</Text>;
            }
          `}</CodeBlock>
        </Step>
      </Steps>

      <H2>Declaring params with types</H2>
      <p>
        Describe the params of every route in a param list. How you write each
        entry decides whether params are required:
      </p>
      <CodeBlock lang="ts" title="navigation/types.ts">{`
        export type RootParamList = {
          // No params: navigate('Home')
          Home: undefined;

          // Required params: navigate('Profile', { userId: '42' })
          Profile: { userId: string };

          // Optional params: navigate('Search') or navigate('Search', { query })
          Search: { query: string } | undefined;
        };
      `}</CodeBlock>
      <p>
        With this in place TypeScript checks every call. Forgetting a required
        param, passing a wrong type or adding an unknown key are all compile
        errors:
      </p>
      <CodeBlock>{`
        navigation.navigate('Profile'); // ❌ Expected 2 arguments
        navigation.navigate('Profile', { userId: 42 }); // ❌ number is not string
        navigation.navigate('Home', { foo: 1 }); // ❌ Home takes no params
        navigation.navigate('Search'); // ✅ params are optional
      `}</CodeBlock>

      <H2>Params of the first screen</H2>
      <p>
        The initial screen is not opened with <C>navigate()</C>, so give it
        params with <C>initialParams</C>:
      </p>
      <CodeBlock>{`
        <AppNavigation
          initialRoute="Profile"
          initialParams={{ userId: 'me' }}
          screens={{ Home: HomeScreen, Profile: ProfileScreen }}
        />
      `}</CodeBlock>

      <H2>Updating params</H2>
      <p>
        Params belong to a stack entry and don&apos;t change after it is
        created. To show the same screen with different data, either push a
        new entry with <C>navigate()</C> (back returns to the old one) or swap
        it with <C>replace()</C>:
      </p>
      <CodeBlock>{`
        // Go to the next page of results without growing the stack
        navigation.replace('Results', { page: route.params.page + 1 });
      `}</CodeBlock>

      <H2>What to put in params</H2>
      <Callout type="tip" title="Pass ids, not objects">
        <p>
          Keep params small and serializable: ids, slugs, search queries. Pass{' '}
          <C>{"{ userId: '42' }"}</C> and load the user in the screen, rather
          than passing the whole user object. The screen then always shows
          fresh data, and nothing breaks if the object changes elsewhere.
        </p>
      </Callout>
      <Callout type="note">
        <p>
          A param object with a <C>screen</C> key has a special meaning: it
          opens a screen inside a nested navigator. See{' '}
          <DocLink href="/docs/opening-nested-screens">
            Opening Nested Screens
          </DocLink>
          .
        </p>
      </Callout>
    </>
  );
}
