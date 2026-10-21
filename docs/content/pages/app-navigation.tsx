import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, DocLink, H2, H3, PropsTable } from '@/components/Doc';

export default function AppNavigationPage() {
  return (
    <>
      <p>
        <C>{'<AppNavigation />'}</C> is a <strong>stack navigator</strong>. Think
        of it as a deck of cards: opening a screen puts a new card on top, going
        back takes the top card off. Only the top card is visible, but the cards
        below keep their state, so returning to them is instant.
      </p>

      <H2>Basic usage</H2>
      <CodeBlock title="App.tsx">{`
        import { AppNavigation } from '@nameisjayant/react-native-navigation';

        export default function App() {
          return (
            <AppNavigation
              screens={{
                Home: HomeScreen,
                Profile: ProfileScreen,
                Settings: SettingsScreen,
              }}
            />
          );
        }
      `}</CodeBlock>
      <p>
        The keys of <C>screens</C> are the <strong>route names</strong> you use
        with <C>navigate()</C>. The values are the components to render.
      </p>

      <H2>Props</H2>
      <PropsTable
        rows={[
          {
            name: 'screens',
            type: 'Screens<ParamList>',
            required: true,
            description: (
              <>
                Map of route name to screen component, e.g.{' '}
                <C>{'{ Home, Profile }'}</C>. Must contain at least one screen.
              </>
            ),
          },
          {
            name: 'initialRoute',
            type: 'keyof ParamList',
            defaultValue: 'first key',
            description: 'Name of the first screen shown.',
          },
          {
            name: 'initialParams',
            type: 'object',
            description: 'Params passed to the initial screen.',
          },
        ]}
      />

      <H3>Choosing the first screen</H3>
      <p>
        By default the first key of <C>screens</C> is shown first. Use{' '}
        <C>initialRoute</C> to pick another one, and <C>initialParams</C> to give
        it params:
      </p>
      <CodeBlock>{`
        <AppNavigation
          initialRoute="Profile"
          initialParams={{ userId: 'me' }}
          screens={{
            Home: HomeScreen,
            Profile: ProfileScreen,
          }}
        />
      `}</CodeBlock>
      <Callout type="note">
        <p>
          <C>initialRoute</C> and <C>initialParams</C> are read once, when the
          navigator mounts. Changing them later has no effect — use{' '}
          <C>navigate()</C> or <C>replace()</C> instead.
        </p>
      </Callout>

      <H2>What a screen receives</H2>
      <p>Every screen is rendered with two props:</p>
      <PropsTable
        rows={[
          {
            name: 'navigation',
            type: 'Navigation<ParamList>',
            description: (
              <>
                Functions to move around: <C>navigate</C>, <C>replace</C>,{' '}
                <C>goBack</C>, <C>popToTop</C>, <C>canGoBack</C> and{' '}
                <C>getParent</C>. See{' '}
                <DocLink href="/docs/navigating">Navigating</DocLink>.
              </>
            ),
          },
          {
            name: 'route',
            type: 'Route<ParamList, Name>',
            description: (
              <>
                The entry being rendered: <C>name</C>, <C>params</C> and a unique{' '}
                <C>key</C> such as <C>&quot;Profile-3&quot;</C>.
              </>
            ),
          },
        ]}
      />
      <CodeBlock title="ProfileScreen.tsx">{`
        import type { ScreenProps } from '@nameisjayant/react-native-navigation';

        export function ProfileScreen({ navigation, route }: ScreenProps) {
          console.log(route.name); // "Profile"
          console.log(route.key); // "Profile-3" — unique per stack entry
          return /* … */;
        }
      `}</CodeBlock>

      <H2>Screen lifecycle</H2>
      <ul>
        <li>
          <strong>Pushing</strong> a screen mounts a new instance of its
          component, even if the same route is already in the stack. Opening{' '}
          <C>Profile</C> twice gives you two independent profile screens.
        </li>
        <li>
          <strong>Screens below the top stay mounted.</strong> Their state,
          scroll position and text inputs survive while another screen covers
          them. Use <DocLink href="/docs/use-is-focused">useIsFocused</DocLink> to
          pause work while hidden.
        </li>
        <li>
          <strong>Popping</strong> a screen unmounts it. On Android the
          component stays mounted until the exit animation finishes, so it
          never disappears mid-transition.
        </li>
      </ul>

      <H2>Good to know</H2>
      <Callout type="tip" title="Define screens outside of render">
        <p>
          Screen components should be declared at module level (or imported).
          Creating a component inside another component&apos;s render gives
          React a new type on every render and remounts the screen.
        </p>
      </Callout>
      <CodeBlock>{`
        // ✅ Stable component
        function HomeScreen() { /* … */ }

        export default function App() {
          // ❌ A new component every render — it would lose its state
          // const Home = () => <HomeScreen />;
          return <AppNavigation screens={{ Home: HomeScreen }} />;
        }
      `}</CodeBlock>
      <p>
        Navigators can be nested: render another <C>{'<AppNavigation />'}</C>{' '}
        or a <C>{'<BottomTabs />'}</C> as a screen. Read{' '}
        <DocLink href="/docs/nested-navigators">Nested Navigators</DocLink> to
        learn how they cooperate.
      </p>
    </>
  );
}
