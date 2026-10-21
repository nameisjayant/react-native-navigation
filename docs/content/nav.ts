import type { IconName } from '@/components/Icons';

export type DocPage = {
  slug: string;
  title: string;
  description: string;
};

export type DocSection = {
  title: string;
  icon: IconName;
  pages: DocPage[];
};

/** Sidebar order is reading order: the pager walks through it top to bottom. */
export const sections: DocSection[] = [
  {
    title: 'Getting Started',
    icon: 'rocket',
    pages: [
      {
        slug: 'introduction',
        title: 'Introduction',
        description:
          'What the library is, how it is built and the ideas behind its API.',
      },
      {
        slug: 'installation',
        title: 'Installation',
        description: 'Add the package to your app and check the requirements.',
      },
      {
        slug: 'quick-start',
        title: 'Quick Start',
        description: 'Build a working two-screen app in about five minutes.',
      },
    ],
  },
  {
    title: 'Stack Navigation',
    icon: 'layers',
    pages: [
      {
        slug: 'app-navigation',
        title: 'AppNavigation',
        description:
          'The stack navigator: declare your screens and let it manage the back stack.',
      },
      {
        slug: 'navigating',
        title: 'Navigating Between Screens',
        description:
          'navigate, replace, goBack, popToTop and canGoBack, explained with examples.',
      },
      {
        slug: 'route-params',
        title: 'Passing Params',
        description:
          'Send data to a screen when you open it, and read it on the other side.',
      },
    ],
  },
  {
    title: 'Hooks',
    icon: 'hook',
    pages: [
      {
        slug: 'use-navigation',
        title: 'useNavigation',
        description:
          'Reach the navigation functions from any component inside a screen.',
      },
      {
        slug: 'use-route',
        title: 'useRoute',
        description: "Read the current screen's name, key and params anywhere.",
      },
      {
        slug: 'use-is-focused',
        title: 'useIsFocused',
        description: 'Know whether the screen a component lives in is visible.',
      },
      {
        slug: 'use-tabs',
        title: 'useTabs',
        description: 'Read the active tab and switch tabs from inside a tab.',
      },
    ],
  },
  {
    title: 'Bottom Tabs',
    icon: 'tabs',
    pages: [
      {
        slug: 'bottom-tabs',
        title: 'BottomTabs',
        description:
          'A bottom tab navigator that keeps each tab alive while you switch.',
      },
      {
        slug: 'tab-icons',
        title: 'Tab Icons',
        description:
          'Use SVGs, icon fonts or images, with an optional focused variant.',
      },
      {
        slug: 'custom-tab-bar',
        title: 'Styling & Custom Tab Bar',
        description:
          'Theme the built-in tab bar, or replace it with one of your own.',
      },
    ],
  },
  {
    title: 'Nesting',
    icon: 'nested',
    pages: [
      {
        slug: 'nested-navigators',
        title: 'Nested Navigators',
        description:
          'Put stacks inside tabs (and tabs inside stacks) and understand how they talk.',
      },
      {
        slug: 'opening-nested-screens',
        title: 'Opening Nested Screens',
        description:
          'Jump straight to a tab, or a screen inside a tab, with one navigate call.',
      },
    ],
  },
  {
    title: 'Guides',
    icon: 'book',
    pages: [
      {
        slug: 'type-safety',
        title: 'TypeScript & Type Safety',
        description:
          'Typed route names and params, so typos are compile errors instead of crashes.',
      },
      {
        slug: 'back-handling',
        title: 'Android Back Button',
        description:
          'How system back and predictive back move through stacks and tabs.',
      },
      {
        slug: 'how-it-works',
        title: 'How It Works',
        description:
          'Under the hood: JS owns the stack, Jetpack Navigation 3 renders it.',
      },
    ],
  },
  {
    title: 'Reference',
    icon: 'shield',
    pages: [
      {
        slug: 'api-reference',
        title: 'API Reference',
        description:
          'Every exported component, hook and type on a single page.',
      },
    ],
  },
];

export const allPages: (DocPage & { section: string })[] = sections.flatMap(
  (section) => section.pages.map((page) => ({ ...page, section: section.title }))
);

export function findPage(slug: string) {
  const index = allPages.findIndex((page) => page.slug === slug);
  if (index === -1) {
    return undefined;
  }
  return {
    page: allPages[index]!,
    prev: allPages[index - 1],
    next: allPages[index + 1],
  };
}
