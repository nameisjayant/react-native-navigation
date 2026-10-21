import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, Diagram, DocLink, H2 } from '@/components/Doc';

export default function UseNavigation() {
  return (
    <>
      <p>
        Screens get <C>navigation</C> as a prop, but buttons, list rows and
        headers are usually a few components deeper.{' '}
        <C>useNavigation()</C> gives any component inside a screen the same
        object, without prop drilling.
      </p>

      <H2>Usage</H2>
      <CodeBlock title="UserRow.tsx">{`
        import { Pressable, Text } from 'react-native';
        import { useNavigation } from '@nameisjayant/react-native-navigation';
        import type { RootParamList } from '../navigation/types';

        export function UserRow({ user }: { user: User }) {
          const navigation = useNavigation<RootParamList>();

          return (
            <Pressable
              onPress={() => navigation.navigate('Profile', { userId: user.id })}
            >
              <Text>{user.name}</Text>
            </Pressable>
          );
        }
      `}</CodeBlock>

      <H2>Signature</H2>
      <CodeBlock lang="ts">{`
        function useNavigation<ParamList extends ParamListBase = ParamListBase>(): Navigation<ParamList>;
      `}</CodeBlock>
      <p>
        Pass your param list as the type argument to get type-checked route
        names and params. Without it, any string is accepted.
      </p>

      <H2>Which navigator do I get?</H2>
      <p>
        The <strong>closest</strong> <C>{'<AppNavigation />'}</C> above the
        component. Tabs are not stacks, so inside a <C>{'<BottomTabs />'}</C>{' '}
        you get the stack that renders the tabs:
      </p>
      <Diagram>
        {'AppNavigation  '}<b>(root stack)</b>{'\n'}
        {'├── Main → BottomTabs\n'}
        {'│           └── HomeTab\n'}
        {'│                 └── useNavigation()  →  '}<b>root stack</b>{'\n'}
        {'└── Profile'}
      </Diagram>
      <p>
        That is why calling <C>navigate(&apos;Profile&apos;)</C> from a tab
        opens the profile <strong>over</strong> the tab bar. If a tab renders
        its own stack, components inside it get that inner stack instead — see{' '}
        <DocLink href="/docs/nested-navigators">Nested Navigators</DocLink>.
      </p>

      <Callout type="warning" title="Must be used inside a screen">
        <p>
          Calling it outside of any <C>{'<AppNavigation />'}</C> throws:{' '}
          <C>
            useNavigation() must be used inside a screen rendered by
            &lt;AppNavigation /&gt;.
          </C>
        </p>
      </Callout>
    </>
  );
}
