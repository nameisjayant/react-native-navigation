import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, DocLink, H2, PropsTable } from '@/components/Doc';

export default function UseTabs() {
  return (
    <>
      <p>
        <C>useTabs()</C> gives any component inside a{' '}
        <C>{'<BottomTabs />'}</C> the name of the active tab and a{' '}
        <C>jumpTo()</C> function to switch tabs.
      </p>

      <H2>Usage</H2>
      <CodeBlock title="SettingsShortcuts.tsx">{`
        import { useTabs } from '@nameisjayant/react-native-navigation';
        import type { TabName } from '../navigation/types';

        export function SettingsShortcuts() {
          const tabs = useTabs<TabName>();

          return (
            <Button
              title="Back to Home"
              onPress={() => tabs.jumpTo('Home')}
            />
          );
        }
      `}</CodeBlock>

      <H2>Returned value</H2>
      <PropsTable
        rows={[
          { name: 'activeTab', type: 'TabName', description: 'Name of the tab currently shown.' },
          {
            name: 'jumpTo',
            type: '(name: TabName) => void',
            description: (
              <>
                Switch to another tab. Throws if no tab has that name. The
                tab&apos;s state is kept, so jumping back shows it as you left it.
              </>
            ),
          },
        ]}
      />

      <H2>Prop or hook?</H2>
      <p>
        The tab screen itself also receives the same object as a <C>tabs</C>{' '}
        prop. Use the prop in the tab screen, and the hook in components below
        it:
      </p>
      <CodeBlock>{`
        import type { TabScreenProps } from '@nameisjayant/react-native-navigation';

        function SettingsTab({ tabs }: TabScreenProps<TabName>) {
          return <Text>Active tab: {tabs.activeTab}</Text>;
        }
      `}</CodeBlock>

      <H2>Works from nested stacks</H2>
      <p>
        If a tab renders its own stack, <C>useTabs()</C> still works in every
        screen of that stack — it finds the closest <C>{'<BottomTabs />'}</C>{' '}
        above it.
      </p>

      <Callout type="warning">
        <p>
          Outside a <C>{'<BottomTabs />'}</C> the hook throws{' '}
          <C>useTabs() must be used inside &lt;BottomTabs /&gt;.</C> To open a
          specific tab from a screen <em>outside</em> the tabs, see{' '}
          <DocLink href="/docs/opening-nested-screens">
            Opening Nested Screens
          </DocLink>
          .
        </p>
      </Callout>
    </>
  );
}
