import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, H2, H3, PropsTable } from '@/components/Doc';

export default function CustomTabBar() {
  return (
    <>
      <p>
        You have three levels of control over the tab bar: <strong>style the
        default one</strong> with props, <strong>reuse it</strong> inside your
        own layout, or <strong>replace it entirely</strong> with your own
        component.
      </p>

      <H2>1. Style the default tab bar</H2>
      <p>
        <C>tabBarStyle</C> styles the bar container, and the tint colors apply
        to icons and labels:
      </p>
      <CodeBlock>{`
        <BottomTabs
          tabs={tabs}
          activeTintColor="#5C7057"
          inactiveTintColor="#84917F"
          tabBarStyle={{
            backgroundColor: '#FBFDFA',
            borderTopColor: '#D1EDD3',
            paddingTop: 6,
            paddingBottom: 10,
          }}
        />
      `}</CodeBlock>

      <H2>2. Replace it with your own</H2>
      <p>
        Pass a component as <C>tabBar</C>. It receives everything needed to draw
        the tabs:
      </p>
      <PropsTable
        rows={[
          { name: 'items', type: 'TabBarItem[]', description: 'One item per tab, in order.' },
          { name: 'activeTab', type: 'TabName', description: 'Name of the active tab.' },
          { name: 'jumpTo', type: '(name: TabName) => void', description: 'Call it when a tab is pressed.' },
        ]}
      />
      <H3>TabBarItem</H3>
      <PropsTable
        rows={[
          { name: 'name', type: 'TabName', description: 'Tab name, pass it to jumpTo().' },
          { name: 'label', type: 'string', description: 'The label (or the name if none was set).' },
          { name: 'focused', type: 'boolean', description: 'Whether this tab is active.' },
          {
            name: 'icon',
            type: '(props: TabIconProps) => ReactNode',
            description: (
              <>
                Renders the tab&apos;s icon — or <C>focusedIcon</C> when you pass{' '}
                <C>focused: true</C> — whatever form it was given in.{' '}
                <C>undefined</C> if the tab has no icon.
              </>
            ),
          },
        ]}
      />

      <H3>Example: a floating pill tab bar</H3>
      <CodeBlock title="FloatingTabBar.tsx">{`
        import { Pressable, StyleSheet, Text, View } from 'react-native';
        import type { TabBarProps } from '@nameisjayant/react-native-navigation';
        import type { TabName } from './types';

        export function FloatingTabBar({ items, jumpTo }: TabBarProps<TabName>) {
          return (
            <View style={styles.wrapper}>
              <View accessibilityRole="tablist" style={styles.bar}>
                {items.map((item) => (
                  <Pressable
                    key={item.name}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: item.focused }}
                    accessibilityLabel={item.label}
                    onPress={() => jumpTo(item.name)}
                    style={[styles.item, item.focused && styles.active]}
                  >
                    {item.icon?.({
                      focused: item.focused,
                      color: item.focused ? '#ffffff' : '#ACC5A6',
                      size: 22,
                    })}
                    {item.focused && <Text style={styles.label}>{item.label}</Text>}
                  </Pressable>
                ))}
              </View>
            </View>
          );
        }

        const styles = StyleSheet.create({
          wrapper: { paddingHorizontal: 24, paddingBottom: 16 },
          bar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 6,
            borderRadius: 999,
            backgroundColor: '#23301F',
          },
          item: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            height: 48,
            paddingHorizontal: 16,
            borderRadius: 999,
          },
          active: { backgroundColor: '#5C7057' },
          label: { color: '#ffffff', fontWeight: '600' },
        });
      `}</CodeBlock>
      <CodeBlock title="MainTabs.tsx">{`
        <BottomTabs<TabName> tabs={tabs} tabBar={FloatingTabBar} />
      `}</CodeBlock>

      <Callout type="warning" title="Define the tab bar outside of render">
        <p>
          Pass a component declared at module level (or memoized). An inline
          arrow like <C>{'tabBar={(props) => <Bar {...props} />}'}</C> is a new
          component on every render, so the bar would remount each time.
        </p>
      </Callout>
      <Callout type="tip" title="Keep it accessible">
        <p>
          Use <C>accessibilityRole=&quot;tablist&quot;</C> on the container and{' '}
          <C>accessibilityRole=&quot;tab&quot;</C> with{' '}
          <C>{'accessibilityState={{ selected }}'}</C> on each item, like the
          default bar does, so screen readers announce your tabs correctly.
        </p>
      </Callout>

      <H2>3. Reuse the default TabBar</H2>
      <p>
        The default bar is exported as <C>{'<TabBar />'}</C>. Wrap it to add
        something around it — a mini player, a banner or a blur background —
        while keeping the stock tabs:
      </p>
      <CodeBlock title="TabBarWithPlayer.tsx">{`
        import { TabBar, type TabBarProps } from '@nameisjayant/react-native-navigation';

        export function TabBarWithPlayer(props: TabBarProps<TabName>) {
          return (
            <View>
              <MiniPlayer />
              <TabBar {...props} activeTintColor="#5C7057" style={{ height: 60 }} />
            </View>
          );
        }
      `}</CodeBlock>
      <p>
        <C>{'<TabBar />'}</C> accepts the <C>TabBarProps</C> plus{' '}
        <C>style</C>, <C>activeTintColor</C> and <C>inactiveTintColor</C>.
      </p>

      <H2>Switching designs at runtime</H2>
      <p>
        <C>tabBar</C> can change between renders — pass <C>undefined</C> to go
        back to the default bar:
      </p>
      <CodeBlock>{`
        <BottomTabs
          tabs={tabs}
          tabBar={variant === 'floating' ? FloatingTabBar : undefined}
        />
      `}</CodeBlock>
    </>
  );
}
