import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, Card, Cards, Diagram, H2, Step, Steps } from '@/components/Doc';

export default function QuickStart() {
  return (
    <>
      <p>
        In this tutorial you will build a small app with a <strong>welcome
        screen</strong>, a <strong>tab bar</strong> with two tabs and a{' '}
        <strong>profile screen</strong> that opens on top of the tabs. Along the
        way you will use every core idea of the library.
      </p>
      <Diagram>
        {'AppNavigation  '}<b>(root stack)</b>{'\n'}
        {'├── Welcome\n'}
        {'├── Main  →  BottomTabs\n'}
        {'│            ├── Home\n'}
        {'│            └── Settings\n'}
        {'└── Profile   '}<b>{'{ userId }'}</b>
      </Diagram>

      <Steps>
        <Step title="Describe your routes">
          <p>
            Start with a <strong>param list</strong>: a type that maps every
            route name to the params it needs. <C>undefined</C> means “no
            params”. This step is optional, but it makes every later call
            type-checked.
          </p>
          <CodeBlock title="navigation/types.ts" lang="ts">{`
            export type RootParamList = {
              Welcome: undefined;
              Main: undefined;
              Profile: { userId: string };
            };

            export type TabName = 'Home' | 'Settings';
          `}</CodeBlock>
        </Step>

        <Step title="Write the screens">
          <p>
            Screens are ordinary components. Stack screens receive{' '}
            <C>navigation</C> and <C>route</C> props; <C>ScreenProps</C> types
            them for a given route.
          </p>
          <CodeBlock title="screens/WelcomeScreen.tsx">{`
            import { Button, Text, View } from 'react-native';
            import type { ScreenProps } from '@nameisjayant/react-native-navigation';
            import type { RootParamList } from '../navigation/types';

            export function WelcomeScreen({
              navigation,
            }: ScreenProps<RootParamList, 'Welcome'>) {
              return (
                <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
                  <Text style={{ fontSize: 28, fontWeight: '700' }}>Welcome!</Text>
                  {/* replace() so back does not return to the welcome screen */}
                  <Button
                    title="Continue"
                    onPress={() => navigation.replace('Main')}
                  />
                </View>
              );
            }
          `}</CodeBlock>
          <CodeBlock title="screens/ProfileScreen.tsx">{`
            import { Button, Text, View } from 'react-native';
            import type { ScreenProps } from '@nameisjayant/react-native-navigation';
            import type { RootParamList } from '../navigation/types';

            export function ProfileScreen({
              navigation,
              route,
            }: ScreenProps<RootParamList, 'Profile'>) {
              return (
                <View style={{ flex: 1, padding: 24 }}>
                  <Text>Profile of user {route.params.userId}</Text>
                  <Button title="Back" onPress={() => navigation.goBack()} />
                </View>
              );
            }
          `}</CodeBlock>
        </Step>

        <Step title="Create the tabs">
          <p>
            Tab screens receive a <C>tabs</C> prop instead. To open a root
            screen from inside a tab, use the <C>useNavigation()</C> hook — it
            returns the stack the tabs live in.
          </p>
          <CodeBlock title="navigation/MainTabs.tsx">{`
            import { Button, Text, View } from 'react-native';
            import {
              BottomTabs,
              useNavigation,
            } from '@nameisjayant/react-native-navigation';
            import type { RootParamList, TabName } from './types';

            function HomeTab() {
              const navigation = useNavigation<RootParamList>();
              return (
                <View style={{ flex: 1, padding: 24 }}>
                  <Text>Home</Text>
                  <Button
                    title="Open my profile"
                    onPress={() => navigation.navigate('Profile', { userId: '42' })}
                  />
                </View>
              );
            }

            function SettingsTab() {
              return <Text style={{ padding: 24 }}>Settings</Text>;
            }

            export function MainTabs() {
              return (
                <BottomTabs<TabName>
                  tabs={{
                    Home: { screen: HomeTab },
                    Settings: { screen: SettingsTab },
                  }}
                />
              );
            }
          `}</CodeBlock>
        </Step>

        <Step title="Put it together">
          <p>
            The root stack lists the three routes. Because <C>Main</C> renders{' '}
            <C>MainTabs</C>, the tab bar is just another screen of the stack.
          </p>
          <CodeBlock title="App.tsx">{`
            import { AppNavigation } from '@nameisjayant/react-native-navigation';
            import { MainTabs } from './navigation/MainTabs';
            import type { RootParamList } from './navigation/types';
            import { ProfileScreen } from './screens/ProfileScreen';
            import { WelcomeScreen } from './screens/WelcomeScreen';

            export default function App() {
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
        </Step>
      </Steps>

      <H2>What just happened?</H2>
      <ul>
        <li>
          The app starts on <C>Welcome</C> because it is the first key of{' '}
          <C>screens</C>.
        </li>
        <li>
          <C>replace(&apos;Main&apos;)</C> swaps the welcome screen for the tabs, so
          the back button will not return to it.
        </li>
        <li>
          Tapping <em>Open my profile</em> pushes <C>Profile</C> on the root
          stack, so it slides in <strong>over</strong> the tab bar.
        </li>
        <li>
          Back on Android pops the profile. On the <em>Settings</em> tab, back
          first returns to <em>Home</em>, then exits the app.
        </li>
      </ul>

      <Callout type="tip" title="Type safety for free">
        <p>
          Try <C>navigation.navigate(&apos;Profile&apos;)</C> without params, or{' '}
          <C>navigate(&apos;Profle&apos;)</C> with a typo. TypeScript flags both
          before you ever run the app.
        </p>
      </Callout>

      <H2>Keep going</H2>
      <Cards>
        <Card href="/docs/navigating" title="Navigating">
          Every navigation function, explained.
        </Card>
        <Card href="/docs/tab-icons" title="Tab Icons">
          Add icons and a focused variant to your tabs.
        </Card>
        <Card href="/docs/nested-navigators" title="Nested Navigators">
          Give a tab its own stack of screens.
        </Card>
        <Card href="/docs/type-safety" title="Type Safety">
          Route constants and typed hooks.
        </Card>
      </Cards>
    </>
  );
}
