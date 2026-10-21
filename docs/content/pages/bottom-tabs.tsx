import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, DocLink, H2, H3, PropsTable } from '@/components/Doc';

export default function BottomTabsPage() {
  return (
    <>
      <p>
        <C>{'<BottomTabs />'}</C> shows a tab bar at the bottom of the screen
        and one screen per tab above it. Switching tabs is instant, and every
        tab remembers where you left it — scroll position, inputs and even a
        nested stack.
      </p>

      <H2>Basic usage</H2>
      <CodeBlock title="MainTabs.tsx">{`
        import { BottomTabs } from '@nameisjayant/react-native-navigation';

        export function MainTabs() {
          return (
            <BottomTabs
              tabs={{
                Home: { screen: HomeScreen },
                Search: { screen: SearchScreen, label: 'Explore' },
                Settings: { screen: SettingsScreen },
              }}
            />
          );
        }
      `}</CodeBlock>
      <p>
        The order of the keys is the order of the tabs in the bar. The label
        defaults to the key, so <C>Home</C> shows “Home” and <C>Search</C> shows
        “Explore”.
      </p>
      <Callout type="tip" title="Tabs inside a stack">
        <p>
          Most apps render <C>{'<BottomTabs />'}</C> as a screen of a root{' '}
          <C>{'<AppNavigation />'}</C>. Screens pushed on that root stack then
          cover the tab bar — perfect for details, settings or modals.
        </p>
      </Callout>

      <H2>Props</H2>
      <PropsTable
        rows={[
          {
            name: 'tabs',
            type: 'Tabs<TabName>',
            required: true,
            description: 'Map of tab name to its config (screen, label, icons). Order is bar order.',
          },
          {
            name: 'initialTab',
            type: 'TabName',
            defaultValue: 'first key',
            description: 'Tab shown first. Also the tab back returns to.',
          },
          {
            name: 'backBehavior',
            type: "'initialTab' | 'none'",
            defaultValue: "'initialTab'",
            description: (
              <>
                What Android back does on a tab other than <C>initialTab</C>.{' '}
                <C>&apos;initialTab&apos;</C> switches to it,{' '}
                <C>&apos;none&apos;</C> leaves back alone.
              </>
            ),
          },
          {
            name: 'tabBar',
            type: 'ComponentType<TabBarProps>',
            description: (
              <>
                Render your own tab bar instead of the default one. See{' '}
                <DocLink href="/docs/custom-tab-bar">Custom Tab Bar</DocLink>.
              </>
            ),
          },
          {
            name: 'tabBarStyle',
            type: 'StyleProp<ViewStyle>',
            description: 'Style of the default tab bar container.',
          },
          {
            name: 'activeTintColor',
            type: 'string',
            defaultValue: "'#1a73e8'",
            description: 'Icon and label color of the active tab (default tab bar).',
          },
          {
            name: 'inactiveTintColor',
            type: 'string',
            defaultValue: "'#5f6368'",
            description: 'Icon and label color of inactive tabs (default tab bar).',
          },
        ]}
      />

      <H3>Tab config</H3>
      <p>Each entry in <C>tabs</C> accepts:</p>
      <PropsTable
        rows={[
          { name: 'screen', type: 'ComponentType<TabScreenProps>', required: true, description: 'The component rendered for this tab.' },
          { name: 'label', type: 'string', defaultValue: 'tab name', description: 'Text shown in the tab bar.' },
          {
            name: 'icon',
            type: 'TabIcon',
            description: (
              <>
                Icon of the tab: a render function or an image source. See{' '}
                <DocLink href="/docs/tab-icons">Tab Icons</DocLink>.
              </>
            ),
          },
          { name: 'focusedIcon', type: 'TabIcon', description: 'Icon used while the tab is active, e.g. a filled variant.' },
        ]}
      />

      <H2>What a tab screen receives</H2>
      <p>
        Tab screens get a single <C>tabs</C> prop with the active tab and a{' '}
        <C>jumpTo()</C> function:
      </p>
      <CodeBlock title="HomeScreen.tsx">{`
        import type { TabScreenProps } from '@nameisjayant/react-native-navigation';

        type TabName = 'Home' | 'Search' | 'Settings';

        export function HomeScreen({ tabs }: TabScreenProps<TabName>) {
          return (
            <Button title="Go to search" onPress={() => tabs.jumpTo('Search')} />
          );
        }
      `}</CodeBlock>
      <p>
        Deeper components can use{' '}
        <DocLink href="/docs/use-tabs">useTabs()</DocLink> for the same object,
        and <DocLink href="/docs/use-navigation">useNavigation()</DocLink> to
        reach the stack around the tabs.
      </p>

      <H2>How tabs are mounted</H2>
      <ul>
        <li>
          <strong>Lazy:</strong> a tab&apos;s screen is mounted the first time
          the tab is visited, not before. Tabs the user never opens cost
          nothing.
        </li>
        <li>
          <strong>Kept alive:</strong> once mounted, a tab stays mounted and
          hidden while inactive. Switching back is instant and keeps state.
        </li>
        <li>
          <strong>Focus-aware:</strong> <C>useIsFocused()</C> is{' '}
          <C>true</C> only in the active tab.
        </li>
      </ul>

      <H2>Typing the tab names</H2>
      <p>
        Pass your tab names as the type argument so <C>initialTab</C>,{' '}
        <C>jumpTo</C> and the custom tab bar are all checked:
      </p>
      <CodeBlock>{`
        type TabName = 'Home' | 'Search' | 'Settings';

        <BottomTabs<TabName>
          initialTab="Home"
          tabs={{
            Home: { screen: HomeScreen },
            Search: { screen: SearchScreen },
            Settings: { screen: SettingsScreen },
          }}
        />
      `}</CodeBlock>
      <Callout type="note">
        <p>
          <C>initialTab</C> is read once on mount. It also defines the
          “home” tab that Android back returns to — see{' '}
          <DocLink href="/docs/back-handling">Android Back Button</DocLink>.
        </p>
      </Callout>
    </>
  );
}
