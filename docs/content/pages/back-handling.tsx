import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, Diagram, H2, Table } from '@/components/Doc';

export default function BackHandling() {
  return (
    <>
      <p>
        On Android, the system back button and the back gesture are handled
        for you. You don&apos;t register listeners or return booleans — the
        library walks through your navigators in the order users expect.
      </p>

      <H2>The order of back</H2>
      <p>Each back press does the first thing that applies:</p>
      <ol>
        <li>
          <strong>Pop the innermost focused stack</strong>, if it has more than
          one screen. A stack inside the active tab goes before the root stack.
        </li>
        <li>
          <strong>Return to the initial tab</strong>, if you are on another
          tab (unless <C>backBehavior=&quot;none&quot;</C>).
        </li>
        <li>
          <strong>Pop the parent stack</strong>, and so on outwards.
        </li>
        <li>
          Nothing left? Back goes to the system, which{' '}
          <strong>closes the app</strong> as usual.
        </li>
      </ol>

      <H2>A walkthrough</H2>
      <p>
        With the tree <C>Root(Main → Tabs(Home | Search → Stack | Settings))</C>,
        starting on the Search tab with a result open:
      </p>
      <Table
        head={['Press', 'Before', 'After']}
        rows={[
          ['1', 'Search tab: SearchList → SearchResult', 'Search tab: SearchList'],
          ['2', 'Search tab, stack at its first screen', <>Home tab (the <C>initialTab</C>)</>],
          ['3', 'Home tab, root stack has only Main', 'App closes'],
        ]}
      />
      <p>
        If a <C>Profile</C> had been pushed on the root stack over the tabs, the
        first press would close it before anything else.
      </p>

      <H2>Predictive back</H2>
      <p>
        Stacks are rendered by Jetpack Navigation 3, which supports Android&apos;s
        predictive back gesture: while the user drags, the previous screen is
        revealed, and releasing completes the pop. Nested stacks hand the
        gesture to the right container automatically, and hidden navigators
        (a background tab, a covered screen) never react to it.
      </p>

      <H2>Customizing tab behavior</H2>
      <p>
        By default back on a non-initial tab returns to the initial tab. Turn
        it off to let back go straight to the parent (or close the app):
      </p>
      <CodeBlock>{`
        <BottomTabs tabs={tabs} initialTab="Home" backBehavior="none" />
      `}</CodeBlock>
      <Diagram>
        {"backBehavior='initialTab'   Settings  →  "}<b>Home</b>{'  →  exit\n'}
        {"backBehavior='none'         Settings  →  "}<b>exit</b>
      </Diagram>

      <H2>Back from code</H2>
      <p>
        <C>navigation.goBack()</C> follows similar rules for stacks: it pops
        the current stack, or the parent stack when called on the first screen
        of a nested one. It never closes the app.
      </p>

      <Callout type="note" title="iOS">
        <p>
          iOS has no system back button. Add a back button to your header that
          calls <C>navigation.goBack()</C>, shown when{' '}
          <C>navigation.canGoBack()</C> is true.
        </p>
      </Callout>
      <Callout type="tip" title="BottomTabs without a stack">
        <p>
          <C>{'<BottomTabs />'}</C> also works on its own, without an{' '}
          <C>{'<AppNavigation />'}</C> around it. It then listens to the Android
          back button itself to return to the initial tab.
        </p>
      </Callout>
    </>
  );
}
