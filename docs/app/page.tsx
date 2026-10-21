import Link from 'next/link';
import { CodeBlock } from '@/components/CodeBlock';
import { CopyButton } from '@/components/CopyButton';
import { Icons, type IconName } from '@/components/Icons';
import { GITHUB_URL } from '@/components/Navbar';

const INSTALL = 'npm install @nameisjayant/react-native-navigation';

const features: {
  icon: IconName;
  title: string;
  text: string;
  href: string;
}[] = [
  {
    icon: 'zap',
    title: 'Truly native on Android',
    text: 'Screens are rendered by Jetpack Compose Navigation 3, so transitions and predictive back feel exactly like a native app.',
    href: '/docs/how-it-works',
  },
  {
    icon: 'feather',
    title: 'Tiny, readable API',
    text: 'Two components and four hooks. Declare screens as a plain object, then call navigate() — that is the whole mental model.',
    href: '/docs/quick-start',
  },
  {
    icon: 'shield',
    title: 'Type-safe end to end',
    text: 'Route names and params are checked by TypeScript. A missing param or a misspelled screen is a compile error, not a crash.',
    href: '/docs/type-safety',
  },
  {
    icon: 'tabs',
    title: 'Bottom tabs that keep state',
    text: 'Tabs mount on first visit and stay alive. Use the built-in bar, theme it with props, or bring a fully custom design.',
    href: '/docs/bottom-tabs',
  },
  {
    icon: 'nested',
    title: 'Nesting that just works',
    text: 'Put a stack in a tab, or tabs in a stack. Unknown routes bubble up to the parent automatically — no wiring needed.',
    href: '/docs/nested-navigators',
  },
  {
    icon: 'back',
    title: 'Smart back handling',
    text: 'System back walks the innermost focused navigator first, then returns to your initial tab, then leaves the app.',
    href: '/docs/back-handling',
  },
];

const showcaseCode = `
import {
  AppNavigation,
  BottomTabs,
} from '@nameisjayant/react-native-navigation';

function MainTabs() {
  return (
    <BottomTabs
      tabs={{
        Home: { screen: HomeScreen, icon: homeIcon },
        Search: { screen: SearchStack, label: 'Explore' },
        Settings: { screen: SettingsScreen },
      }}
    />
  );
}

export default function App() {
  return (
    <AppNavigation
      screens={{
        Main: MainTabs,
        Profile: ProfileScreen,
      }}
    />
  );
}
`;

export default function Home() {
  return (
    <>
      <main>
        <section className="hero">
          <div className="container">
            <div className="pill">
              <span className="pill-badge">v0.1</span>
              Powered by Jetpack Navigation 3
            </div>
            <h1>
              Navigation for React Native that{' '}
              <span className="gradient-text">feels native</span>
            </h1>
            <p className="lead">
              Stacks, bottom tabs and nested navigators with a tiny, fully
              typed API. Your screens are plain components — the library takes
              care of the back stack, focus and the Android back button.
            </p>
            <div className="hero-actions">
              <Link href="/docs/quick-start" className="button button-primary">
                Get started <Icons.arrowRight size={16} />
              </Link>
              <Link href="/docs/introduction" className="button button-secondary">
                Read the docs
              </Link>
            </div>
            <div className="install-line">
              <span className="prompt">$</span>
              <code>{INSTALL}</code>
              <CopyButton text={INSTALL} />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Why this library</div>
              <h2>Everything you need, nothing you have to configure</h2>
              <p>
                Built for apps that want native transitions without a large
                navigation framework to learn.
              </p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => {
                const Icon = Icons[feature.icon];
                return (
                  <Link key={feature.title} href={feature.href} className="feature-card">
                    <div className="feature-icon">
                      <Icon size={22} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container showcase">
            <div>
              <div className="eyebrow">Simple by design</div>
              <h2>Your whole app, described as plain objects</h2>
              <p>
                There is no navigator factory, no screen registration and no
                linking config. A navigator is a component that receives a map
                of names to screens.
              </p>
              <ul className="check-list">
                <li>
                  <Icons.check size={18} />
                  <span>The first key is the first screen — or pick one with <code>initialRoute</code>.</span>
                </li>
                <li>
                  <Icons.check size={18} />
                  <span>Every screen receives <code>navigation</code> and <code>route</code> props.</span>
                </li>
                <li>
                  <Icons.check size={18} />
                  <span>Hooks give any child component the same access.</span>
                </li>
                <li>
                  <Icons.check size={18} />
                  <span>Pushing <code>Profile</code> from a tab covers the tab bar, automatically.</span>
                </li>
              </ul>
            </div>
            <CodeBlock title="App.tsx">{showcaseCode}</CodeBlock>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Platforms</div>
              <h2>One API, the best renderer per platform</h2>
              <p>
                Your navigation code is identical everywhere. Only the view
                that draws the stack changes.
              </p>
            </div>
            <div className="compare">
              <div className="platform-card">
                <h3>
                  <Icons.android size={20} /> Android
                </h3>
                <p>
                  Native stack rendered by Jetpack Compose Navigation 3, with
                  system transitions and predictive back gestures.
                </p>
              </div>
              <div className="platform-card">
                <h3>
                  <Icons.apple size={20} /> iOS
                </h3>
                <p>
                  A lightweight JavaScript stack that keeps every screen
                  mounted and shows the top one. Same API, same behavior.
                </p>
              </div>
              <div className="platform-card">
                <h3>
                  <Icons.globe size={20} /> Web & others
                </h3>
                <p>
                  Uses the same JavaScript fallback, so shared code and tests
                  run without native modules.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container">
          <div className="cta">
            <h2>Ready to build?</h2>
            <p>
              Follow the quick start and have a stack with tabs running in a
              few minutes.
            </p>
            <div className="hero-actions">
              <Link href="/docs/quick-start" className="button button-primary">
                Start the tutorial <Icons.arrowRight size={16} />
              </Link>
              <Link href="/docs/api-reference" className="button button-secondary">
                API reference
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>MIT License · Made by nameisjayant</span>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}
