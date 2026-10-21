import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, H2, H3, PropsTable } from '@/components/Doc';

export default function TabIcons() {
  return (
    <>
      <p>
        A tab icon can be given in two forms: a <strong>render function</strong>{' '}
        (for SVGs, icon fonts or anything else) or an <strong>image
        source</strong>. Add a <C>focusedIcon</C> to swap icons when the tab is
        active.
      </p>

      <H2>Render function</H2>
      <p>
        The function receives the color and size to use, and whether the tab is
        focused. Return any React element.
      </p>
      <PropsTable
        rows={[
          { name: 'focused', type: 'boolean', description: 'Whether this tab is the active one.' },
          { name: 'color', type: 'string', description: 'The active or inactive tint color.' },
          { name: 'size', type: 'number', description: 'Suggested size in points (24 in the default tab bar).' },
        ]}
      />

      <H3>With an icon font</H3>
      <CodeBlock>{`
        import MaterialIcons from '@react-native-vector-icons/material-icons';

        <BottomTabs
          tabs={{
            Home: {
              screen: HomeScreen,
              icon: ({ color, size }) => (
                <MaterialIcons name="home" color={color} size={size} />
              ),
            },
          }}
        />
      `}</CodeBlock>

      <H3>With an SVG component</H3>
      <CodeBlock>{`
        import HomeSvg from './assets/home.svg';

        const homeIcon = ({ color, size }: TabIconProps) => (
          <HomeSvg width={size} height={size} color={color} />
        );

        <BottomTabs tabs={{ Home: { screen: HomeScreen, icon: homeIcon } }} />
      `}</CodeBlock>

      <Callout type="warning" title="No hooks in icon functions">
        <p>
          Icon functions are called during render like a plain function, not
          rendered as a component. They must not call hooks. If you need a
          hook, return a component that uses it:{' '}
          <C>{'(props) => <MyIcon {...props} />'}</C>.
        </p>
      </Callout>

      <H2>Image source</H2>
      <p>
        Pass a <C>require()</C> or <C>{'{ uri }'}</C> directly. The image is
        sized to <C>size</C> and <strong>tinted</strong> with the tab color, so
        use single-color PNGs with a transparent background.
      </p>
      <CodeBlock>{`
        <BottomTabs
          tabs={{
            Home: { screen: HomeScreen, icon: require('./assets/home.png') },
            Profile: {
              screen: ProfileScreen,
              icon: { uri: 'https://example.com/profile.png' },
            },
          }}
        />
      `}</CodeBlock>
      <Callout type="tip" title="Full-color images">
        <p>
          Tinting turns every pixel into the tab color. For a colored image —
          like a user avatar — use a render function returning an{' '}
          <C>{'<Image />'}</C> instead:
        </p>
      </Callout>
      <CodeBlock>{`
        icon: ({ size, focused }) => (
          <Image
            source={{ uri: user.avatarUrl }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: focused ? 2 : 0,
              borderColor: '#5C7057',
            }}
          />
        ),
      `}</CodeBlock>

      <H2>Focused icon</H2>
      <p>
        Many designs use an outlined icon normally and a filled one for the
        active tab. Set both:
      </p>
      <CodeBlock>{`
        Home: {
          screen: HomeScreen,
          icon: tabIcon('home-outline'),
          focusedIcon: tabIcon('home'),
        },
      `}</CodeBlock>
      <p>
        If only <C>focusedIcon</C> is set, it is used for both states. The two
        can even be of different forms (one image, one function).
      </p>

      <H2>A reusable helper</H2>
      <p>
        Wrap your icon component once and every tab stays short:
      </p>
      <CodeBlock title="icons/tabIcon.tsx">{`
        import type { TabIconProps } from '@nameisjayant/react-native-navigation';
        import { Icon, type IconName } from './Icon';

        export function tabIcon(name: IconName) {
          return ({ color, size }: TabIconProps) => (
            <Icon name={name} color={color} size={size} />
          );
        }
      `}</CodeBlock>
    </>
  );
}
