import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, H2, PropsTable } from '@/components/Doc';

export default function UseRoute() {
  return (
    <>
      <p>
        <C>useRoute()</C> returns the <strong>route</strong> of the screen the
        component is rendered in — the same object a screen receives as its{' '}
        <C>route</C> prop.
      </p>

      <H2>Usage</H2>
      <CodeBlock title="ProfileHero.tsx">{`
        import { Text } from 'react-native';
        import { useRoute } from '@nameisjayant/react-native-navigation';
        import type { RootParamList } from '../navigation/types';

        export function ProfileHero() {
          const { params } = useRoute<RootParamList, 'Profile'>();
          const user = useUser(params.userId);

          return <Text style={{ fontSize: 24 }}>{user.name}</Text>;
        }
      `}</CodeBlock>

      <H2>Returned value</H2>
      <PropsTable
        rows={[
          { name: 'name', type: 'Name', description: 'The route name, e.g. "Profile".' },
          { name: 'params', type: 'ParamList[Name]', description: 'The params passed when the screen was opened.' },
          {
            name: 'key',
            type: 'string',
            description: (
              <>
                Unique id of this stack entry, e.g. <C>&quot;Profile-3&quot;</C>.
                Two <C>Profile</C> screens in the same stack have different keys.
              </>
            ),
          },
        ]}
      />

      <H2>Signature</H2>
      <CodeBlock lang="ts">{`
        function useRoute<
          ParamList extends ParamListBase = ParamListBase,
          Name extends keyof ParamList = keyof ParamList,
        >(): Route<ParamList, Name>;
      `}</CodeBlock>
      <p>
        The second type argument narrows <C>params</C> to a single route.
        Use it in components that only ever appear on one screen.
      </p>

      <H2>Using the key</H2>
      <p>
        Because <C>key</C> is unique per entry, it is a good cache key for data
        that belongs to one particular screen instance:
      </p>
      <CodeBlock>{`
        const { key } = useRoute();
        const draft = useDraftStore((store) => store.drafts[key]);
      `}</CodeBlock>

      <Callout type="warning">
        <p>
          Like <C>useNavigation()</C>, this hook must be called inside a screen
          rendered by <C>{'<AppNavigation />'}</C>; otherwise it throws.
        </p>
      </Callout>
    </>
  );
}
