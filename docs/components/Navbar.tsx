'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from './Icons';
import { ThemeToggle } from './ThemeToggle';

export const GITHUB_URL = 'https://github.com/nameisjayant/react-native-navigation';

export function Navbar() {
  const pathname = usePathname();
  const inDocs = pathname.startsWith('/docs');

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button
          type="button"
          className={`icon-button menu-button${inDocs ? ' has-menu' : ''}`}
          aria-label="Open docs menu"
          onClick={() => window.dispatchEvent(new Event('toggle-sidebar'))}
        >
          <Icons.menu />
        </button>
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Icons.logo size={18} strokeWidth={2.4} />
          </span>
          <span className="brand-name">
            <span>@nameisjayant/</span>react-native-navigation
          </span>
        </Link>
        <div className="nav-spacer" />
        <nav className="nav-tabs" aria-label="Main">
          <Link href="/" className={`nav-tab${inDocs ? '' : ' active'}`}>
            Home
          </Link>
          <Link href="/docs" className={`nav-tab${inDocs ? ' active' : ''}`}>
            Docs
          </Link>
        </nav>
        <a
          href={GITHUB_URL}
          className="icon-button github-link"
          aria-label="GitHub repository"
          target="_blank"
          rel="noreferrer"
        >
          <Icons.github />
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
