import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, Card, Cards, DocLink, H2, Table } from '@/components/Doc';

export default function Introduction() {
  return (
    <>
      <p>
        <strong>@nameisjayant/react-native-navigation</strong> is a navigation
        library for React Native that gives you a <strong>stack navigator</strong>,{' '}
        <strong>bottom tabs</strong> and <strong>nested navigation</strong> through a
        deliberately small API. On Android the screens are rendered by{' '}
        <strong>Jetpack Compose Navigation 3</strong>, so transitions and the
        predictive back gesture are the real, native ones.
      </p>

      <H2>The whole API at a glance</H2>
      <p>
        The library exports two navigator components, one helper component and
        four hooks. Everything else is TypeScript types.
      </p>
      <Table
        head={['Export', 'What it does']}
        rows={[
          [<C key="a">{'<AppNavigation />'}</C>, 'A stack navigator. Screens are pushed on top of each other and popped off with back.'],
          [<C key="a">{'<BottomTabs />'}</C>, 'A bottom tab navigator. Each tab keeps its state while you switch between them.'],
          [<C key="a">{'<TabBar />'}</C>, 'The default tab bar, exported so you can reuse it inside your own.'],
          [<C key="a">useNavigation()</C>, 'Access navigate, goBack and friends from any component in a screen.'],
          [<C key="a">useRoute()</C>, 'Read the current screen’s name, key and params.'],
          [<C key="a">useIsFocused()</C>, 'Is the screen this component lives in currently visible?'],
          [<C key="a">useTabs()</C>, 'Read the active tab and switch tabs from inside a tab.'],
        ]}
      />

      <H2>A first taste</H2>
      <p>
        A navigator is just a component that receives an object of{' '}
        <em>route name → screen component</em>. Each screen gets{' '}
        <C>navigation</C> and <C>route</C> as props.
      </p>
      <CodeBlock title="App.tsx">{`
        import { Button, Text, View } from 'react-native';
        import {
          AppNavigation,
          type ScreenProps,
        } from '@nameisjayant/react-native-navigation';

        function HomeScreen({ navigation }: ScreenProps) {
          return (
            <View>
              <Text>Home</Text>
              <Button
                title="Open details"
                onPress={() => navigation.navigate('Details')}
              />
            </View>
          );
        }

        function DetailsScreen({ navigation }: ScreenProps) {
          return <Button title="Go back" onPress={() => navigation.goBack()} />;
        }

        export default function App() {
          return (
            <AppNavigation
              screens={{
                Home: HomeScreen,
                Details: DetailsScreen,
              }}
            />
          );
        }
      `}</CodeBlock>
      <p>
        That is a complete, working app. <C>Home</C> is shown first because it
        is the first key, tapping the button pushes <C>Details</C> with a native
        transition, and the Android back button (or gesture) pops it again.
      </p>

      <H2>Design principles</H2>
      <ul>
        <li>
          <strong>Plain objects over configuration.</strong> Screens and tabs are
          declared as object literals. There are no factories like{' '}
          <C>createStackNavigator()</C> and no separate <C>Screen</C> elements.
        </li>
        <li>
          <strong>JavaScript owns the state.</strong> The back stack lives in a
          React reducer, so it is predictable and easy to reason about. The
          native side only draws it.
        </li>
        <li>
          <strong>Nesting without wiring.</strong> When a navigator does not know
          a route name, it hands the call to its parent. You rarely have to
          think about which navigator you are in.
        </li>
        <li>
          <strong>Types first.</strong> Describe your routes once in a param list
          and every <C>navigate()</C> call is checked by TypeScript.
        </li>
      </ul>

      <Callout type="note" title="Platform support">
        <p>
          Android uses the native Navigation 3 renderer. iOS and other platforms
          use a lightweight JavaScript fallback with the exact same API. See{' '}
          <DocLink href="/docs/how-it-works">How It Works</DocLink> for details.
        </p>
      </Callout>

      <H2>Where to go next</H2>
      <Cards>
        <Card href="/docs/installation" title="Installation">
          Add the package and check the Android requirements.
        </Card>
        <Card href="/docs/quick-start" title="Quick Start">
          Build a stack with tabs, step by step.
        </Card>
        <Card href="/docs/navigating" title="Navigating">
          Learn every navigation function with examples.
        </Card>
        <Card href="/docs/type-safety" title="Type Safety">
          Make route names and params compile-time checked.
        </Card>
      </Cards>
    </>
  );
}
