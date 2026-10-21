import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, Diagram, H2, H3, Table } from '@/components/Doc';

export default function HowItWorks() {
  return (
    <>
      <p>
        You don&apos;t need any of this to use the library, but knowing the
        architecture explains its behavior — why screens stay mounted, why
        exit animations never cut off, and why the API is so small.
      </p>

      <H2>JavaScript owns the stack</H2>
      <p>
        Each <C>{'<AppNavigation />'}</C> keeps its back stack in a React
        reducer. Every route has a unique <C>key</C>. Navigation functions just
        dispatch actions:
      </p>
      <Table
        head={['Call', 'Action', 'Effect on state']}
        rows={[
          [<C key="1">navigate</C>, <C key="2">push</C>, 'Append a new route.'],
          [<C key="1">replace</C>, <C key="2">replace</C>, 'Swap the last route for a new one.'],
          [<C key="1">goBack</C>, <C key="2">pop</C>, 'Remove the last route (never the first).'],
          [<C key="1">popToTop</C>, <C key="2">popToTop</C>, 'Keep only the first route.'],
        ]}
      />
      <p>
        Removed routes are not dropped immediately. They move to an{' '}
        <C>exiting</C> list and stay mounted until the native side reports that
        their exit animation finished.
      </p>
      <CodeBlock lang="ts" title="state shape">{`
        type StackState = {
          stack: Route[]; // the logical back stack, last = visible
          exiting: Route[]; // popped, still animating out
        };
      `}</CodeBlock>

      <H2>Android: Jetpack Navigation 3 draws it</H2>
      <Diagram>
        {'React (JS)                         Android (Kotlin / Compose)\n'}
        {'─────────────────────────          ──────────────────────────────\n'}
        <b>{'<AppNavigation />'}</b>{'                  '}<b>RNNavigationContainer</b>{'\n'}
        {'  stack: ["Home-0","Profile-1"] ─▶   ComposeView → NavDisplay\n'}
        {'  <RNNavScreen screenKey="Home-0">     NavEntry("Home-0")    ◀─ view\n'}
        {'  <RNNavScreen screenKey="Profile-1">  NavEntry("Profile-1") ◀─ view\n'}
        {'                                   \n'}
        {'  onBack()              ◀──────────  system / predictive back\n'}
        {'  onAttachedScreensChange ◀────────  exit animation finished'}
      </Diagram>
      <ul>
        <li>
          <strong>RNNavigationContainer</strong> is a native view hosting a
          Compose <C>NavDisplay</C>. JS sends it the ordered list of route keys.
        </li>
        <li>
          Every route is rendered by React inside an <strong>RNNavScreen</strong>{' '}
          view tagged with its <C>screenKey</C>. The native side moves each view
          into the matching <C>NavEntry</C>.
        </li>
        <li>
          Navigation 3 animates between entries and handles system and
          predictive back, reporting it to JS through <C>onBack</C>.
        </li>
        <li>
          When an entry leaves composition, <C>onAttachedScreensChange</C> tells
          JS it can finally unmount the exiting route.
        </li>
      </ul>

      <H3>Nested containers and back</H3>
      <p>
        Each container has a <C>backEnabled</C> flag. A navigator turns it off
        while it is hidden (a background tab, a covered screen) or while a
        nested navigator inside its focused screen can handle back itself. So
        exactly one container — the innermost relevant one — reacts to a back
        gesture.
      </p>

      <H2>iOS and other platforms</H2>
      <p>
        Without the native container, a simple JavaScript view stack is used:
        all routes are mounted, and every one except the top is hidden with{' '}
        <C>display: &apos;none&apos;</C>. The public API, state handling, focus
        and nesting behave exactly the same; there are no built-in transition
        animations.
      </p>

      <H2>Tabs</H2>
      <p>
        <C>{'<BottomTabs />'}</C> is implemented in JavaScript on every platform.
        Visited tabs are kept mounted in absolutely-positioned views and hidden
        when inactive, and the tab bar is a regular React Native component —
        which is why it is so easy to replace.
      </p>

      <Callout type="note" title="Focus is just context">
        <p>
          Every screen is wrapped in a context that says whether it is focused:
          the top of its stack, in the active tab, inside a focused parent.{' '}
          <C>useIsFocused()</C> simply reads it, which makes it cheap to call
          anywhere.
        </p>
      </Callout>
    </>
  );
}
