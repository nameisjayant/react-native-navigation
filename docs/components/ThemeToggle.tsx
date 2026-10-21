'use client';

import { Icons } from './Icons';

/** Inline script that applies the saved (or system) theme before first paint. */
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies.
    }
  };

  // Both icons are rendered and CSS shows the right one, so the server and
  // client markup match whatever the theme is.
  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      onClick={toggle}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      <Icons.sun className="theme-icon-sun" />
      <Icons.moon className="theme-icon-moon" />
    </button>
  );
}
