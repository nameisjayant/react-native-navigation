import { CodeBlock } from '@/components/CodeBlock';
import { C, Callout, DocLink, H2, Step, Steps, Table } from '@/components/Doc';

export default function Installation() {
  return (
    <>
      <Steps>
        <Step title="Install the package">
          <p>Add the library with the package manager your app uses.</p>
          <CodeBlock lang="bash" title="npm">{`
            npm install @nameisjayant/react-native-navigation
          `}</CodeBlock>
          <CodeBlock lang="bash" title="yarn">{`
            yarn add @nameisjayant/react-native-navigation
          `}</CodeBlock>
          <p>
            <C>react</C> and <C>react-native</C> are peer dependencies, so the
            versions already in your app are used.
          </p>
        </Step>

        <Step title="Rebuild the Android app">
          <p>
            The library ships native Android code (a Jetpack Compose view that
            hosts Navigation 3). Autolinking picks it up, but a JavaScript reload
            is not enough — rebuild the app once:
          </p>
          <CodeBlock lang="bash">{`
            npx react-native run-android
          `}</CodeBlock>
        </Step>

        <Step title="Render a navigator">
          <p>
            There is no provider or container to wrap your app in. Render an{' '}
            <C>{'<AppNavigation />'}</C> at the root and you are done.
          </p>
          <CodeBlock title="App.tsx">{`
            import { AppNavigation } from '@nameisjayant/react-native-navigation';
            import { HomeScreen } from './screens/HomeScreen';

            export default function App() {
              return <AppNavigation screens={{ Home: HomeScreen }} />;
            }
          `}</CodeBlock>
        </Step>
      </Steps>

      <H2>Requirements</H2>
      <Table
        head={['Requirement', 'Details']}
        rows={[
          ['React Native', <>New Architecture (Fabric), the default in modern React Native. The native views are generated with codegen.</>],
          ['Android minSdk', <>24 or higher.</>],
          ['Android compileSdk', <>36 (the library default, overridable from your root project).</>],
          ['Kotlin', <>The library applies the Kotlin Compose compiler plugin. It defaults to Kotlin 2.1.20 and uses your project&apos;s <C>kotlinVersion</C> if set.</>],
          ['Java', <>Java 17.</>],
          ['iOS', <>No native setup. iOS uses the JavaScript stack implementation.</>],
        ]}
      />

      <Callout type="tip" title="Overriding Android versions">
        <p>
          The library reads <C>kotlinVersion</C>, <C>minSdkVersion</C> and{' '}
          <C>compileSdkVersion</C> from your root <C>build.gradle</C> when they
          exist, so it stays in sync with the rest of your app.
        </p>
      </Callout>
      <CodeBlock lang="groovy" title="android/build.gradle">{`
        buildscript {
          ext {
            minSdkVersion = 24
            compileSdkVersion = 36
            kotlinVersion = "2.1.20"
          }
        }
      `}</CodeBlock>

      <H2>What gets installed natively</H2>
      <p>
        On Android the library brings in Jetpack Compose UI and Navigation 3. You
        do not need to add these yourself — they come with the package:
      </p>
      <CodeBlock lang="groovy" title="library dependencies">{`
        implementation "androidx.compose.ui:ui:1.10.0"
        implementation "androidx.compose.foundation:foundation-layout:1.10.0"
        implementation "androidx.navigation3:navigation3-runtime:1.1.7"
        implementation "androidx.navigation3:navigation3-ui:1.1.7"
      `}</CodeBlock>

      <Callout type="warning" title="Seeing an error mentioning RNNavigationContainer or RNNavScreen?">
        <p>
          That means the native part is not in your build yet. Make sure the New
          Architecture is enabled, then do a clean rebuild of the Android app.
        </p>
      </Callout>

      <p>
        Next, follow the <DocLink href="/docs/quick-start">Quick Start</DocLink>{' '}
        to build a real app with a stack and tabs.
      </p>
    </>
  );
}
