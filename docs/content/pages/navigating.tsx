import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, Diagram, DocLink, H2, Table } from '@/components/Doc';

export default function Navigating() {
  return (
    <>
      <p>
        Every stack screen gets a <C>navigation</C> object (also available via{' '}
        <DocLink href="/docs/use-navigation">useNavigation()</DocLink>). It has
        six functions. Here is what each does to a stack that currently holds{' '}
        <C>Home → Feed → Post</C>:
      </p>
      <Table
        head={['Call', 'Stack after', 'In plain words']}
        rows={[
          [<C key="c">navigate(&apos;Profile&apos;)</C>, <C key="s">Home → Feed → Post → Profile</C>, 'Open a new screen on top.'],
          [<C key="c">replace(&apos;Profile&apos;)</C>, <C key="s">Home → Feed → Profile</C>, 'Swap the current screen for another.'],
          [<C key="c">goBack()</C>, <C key="s">Home → Feed</C>, 'Close the current screen.'],
          [<C key="c">popToTop()</C>, <C key="s">Home</C>, 'Close everything above the first screen.'],
          [<C key="c">canGoBack()</C>, <C key="s">unchanged</C>, <>Returns <C>true</C>: there is a screen to go back to.</>],
          [<C key="c">getParent()</C>, <C key="s">unchanged</C>, 'Returns the parent navigator, if nested.'],
        ]}
      />

      <H2>navigate(name, params?)</H2>
      <p>
        Pushes a new screen on top of the stack. Pass params as the second
        argument when the screen needs data.
      </p>
      <CodeBlock>{`
        navigation.navigate('Settings');
        navigation.navigate('Profile', { userId: '42' });
      `}</CodeBlock>
      <Callout type="note" title="navigate always pushes">
        <p>
          Calling <C>navigate(&apos;Profile&apos;)</C> while a <C>Profile</C> is
          already in the stack pushes a <em>second</em> one. This is handy for
          drill-down flows like “profile → follower’s profile → …”. If you want
          to swap the screen instead, use <C>replace()</C>.
        </p>
      </Callout>
      <p>
        If the name is not one of this navigator&apos;s screens, the call is
        forwarded to the parent navigator. If no navigator has it, an error is
        thrown that lists the available screens:
      </p>
      <CodeBlock lang="bash" title="error">{`
        No screen named "Profle" in this navigator or its parents. Available screens: Home, Profile
      `}</CodeBlock>

      <H2>replace(name, params?)</H2>
      <p>
        Replaces the <strong>current</strong> screen with a new one. The stack
        length stays the same, and the replaced screen is gone from history.
      </p>
      <p>Classic uses:</p>
      <ul>
        <li>Moving from a login or onboarding screen to the app.</li>
        <li>Signing out, so back cannot return to private screens.</li>
        <li>Moving between steps of a wizard without stacking them up.</li>
      </ul>
      <CodeBlock title="LoginScreen.tsx">{`
        async function onLogin() {
          await signIn(email, password);
          // The user can't go "back" to the login form
          navigation.replace('Main');
        }
      `}</CodeBlock>

      <H2>goBack()</H2>
      <p>
        Pops the current screen — exactly what the Android back button does.
      </p>
      <CodeBlock>{`
        <Button title="Close" onPress={() => navigation.goBack()} />
      `}</CodeBlock>
      <ul>
        <li>
          On the <strong>first screen of a nested</strong> navigator, it goes
          back in the parent instead.
        </li>
        <li>
          On the first screen of the <strong>top</strong> navigator it does
          nothing (it never closes the app).
        </li>
      </ul>

      <H2>popToTop()</H2>
      <p>
        Removes every screen above the first one of <strong>this</strong>{' '}
        navigator. Great for a “Done” button at the end of a multi-screen flow.
      </p>
      <Diagram>
        {'Cart → Address → Payment → '}<b>Confirmation</b>{'\n'}
        {'                    popToTop()\n'}
        <b>Cart</b>
      </Diagram>
      <CodeBlock>{`
        <Button title="Done" onPress={() => navigation.popToTop()} />
      `}</CodeBlock>

      <H2>canGoBack()</H2>
      <p>
        Returns <C>true</C> when <C>goBack()</C> would do something — in this
        navigator or any parent. Use it to show or hide a back button in a
        custom header:
      </p>
      <CodeBlock title="Header.tsx">{`
        import { useNavigation } from '@nameisjayant/react-native-navigation';

        export function Header({ title }: { title: string }) {
          const navigation = useNavigation();
          return (
            <View style={styles.header}>
              {navigation.canGoBack() && (
                <Pressable onPress={() => navigation.goBack()}>
                  <Text>‹ Back</Text>
                </Pressable>
              )}
              <Text style={styles.title}>{title}</Text>
            </View>
          );
        }
      `}</CodeBlock>

      <H2>getParent()</H2>
      <p>
        Returns the navigation object of the stack this one is nested in, or{' '}
        <C>undefined</C> for the top-level stack. A{' '}
        <C>{'<BottomTabs />'}</C> in between is skipped — use{' '}
        <DocLink href="/docs/use-tabs">useTabs()</DocLink> to reach tabs.
      </p>
      <CodeBlock>{`
        // Inside a stack that is nested in the Search tab:
        navigation
          .getParent<RootParamList>()
          ?.navigate('Profile', { userId: person.id });
      `}</CodeBlock>
      <Callout type="tip">
        <p>
          You usually don&apos;t need <C>getParent()</C>: calling{' '}
          <C>navigate(&apos;Profile&apos;)</C> directly already bubbles up to
          the parent when the current stack has no <C>Profile</C>.{' '}
          <C>getParent()</C> is useful to make that explicit, or to type the
          call with the parent&apos;s param list.
        </p>
      </Callout>

      <H2>The navigation object is stable</H2>
      <p>
        The <C>navigation</C> object never changes identity for the lifetime of
        a navigator, and its functions always see the latest state. It is safe
        to put it in dependency arrays or call it from timers and callbacks:
      </p>
      <CodeBlock>{`
        useEffect(() => {
          const timer = setTimeout(() => navigation.replace('Home'), 2000);
          return () => clearTimeout(timer);
        }, [navigation]); // never re-runs because of navigation
      `}</CodeBlock>
    </>
  );
}
