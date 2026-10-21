import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, H2, H3, Table } from '@/components/Doc';

export default function UseIsFocused() {
  return (
    <>
      <p>
        Screens stay mounted when another screen covers them, and tabs stay
        mounted when you switch away. <C>useIsFocused()</C> tells a component
        whether the screen it lives in is the one the user is looking at right
        now — and re-renders it when that changes.
      </p>

      <H2>Usage</H2>
      <CodeBlock>{`
        import { useIsFocused } from '@nameisjayant/react-native-navigation';

        function LiveBadge() {
          const isFocused = useIsFocused();
          return <Text>{isFocused ? 'Visible' : 'In the background'}</Text>;
        }
      `}</CodeBlock>

      <H2>When is a screen focused?</H2>
      <p>A screen is focused only when all of these are true:</p>
      <Table
        head={['Condition', 'Example of not focused']}
        rows={[
          ['It is the top screen of its stack.', <>Another screen was pushed on top of it.</>],
          ['Inside tabs, its tab is the active one.', <>The user switched to a different tab.</>],
          ['Every navigator around it is focused too.', <>Its whole tab bar is covered by a screen pushed on the root stack.</>],
        ]}
      />
      <p>
        Outside of any navigator the hook returns <C>true</C>.
      </p>

      <H2>Common recipes</H2>
      <H3>Pause a video or animation while hidden</H3>
      <CodeBlock>{`
        function Player({ source }: { source: string }) {
          const isFocused = useIsFocused();
          return <Video source={{ uri: source }} paused={!isFocused} />;
        }
      `}</CodeBlock>

      <H3>Refresh data when the user comes back</H3>
      <CodeBlock>{`
        function InboxScreen() {
          const isFocused = useIsFocused();
          const { data, refetch } = useInbox();

          useEffect(() => {
            if (isFocused) {
              refetch();
            }
          }, [isFocused, refetch]);

          return <MessageList messages={data} />;
        }
      `}</CodeBlock>

      <H3>Stop polling in the background</H3>
      <CodeBlock>{`
        useEffect(() => {
          if (!isFocused) {
            return;
          }
          const id = setInterval(fetchPrices, 5000);
          return () => clearInterval(id);
        }, [isFocused]);
      `}</CodeBlock>

      <Callout type="tip">
        <p>
          The effect runs on the first render too, so the “refresh on focus”
          recipe also loads data when the screen first opens.
        </p>
      </Callout>
    </>
  );
}
