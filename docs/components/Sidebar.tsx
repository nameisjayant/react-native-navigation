'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sections } from '@/content/nav';
import { Icons } from './Icons';

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The navbar's menu button lives outside this tree, so it talks through an event.
  useEffect(() => {
    const toggle = () => setOpen((value) => !value);
    window.addEventListener('toggle-sidebar', toggle);
    return () => window.removeEventListener('toggle-sidebar', toggle);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div
        className={`sidebar-backdrop${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
      />
      <aside className={`sidebar${open ? ' open' : ''}`} aria-label="Docs">
        {sections.map((section) => {
          const Icon = Icons[section.icon];
          return (
            <div key={section.title} className="sidebar-group">
              <p className="sidebar-title">
                <Icon size={15} />
                {section.title}
              </p>
              <ul className="sidebar-links">
                {section.pages.map((page) => {
                  const href = `/docs/${page.slug}`;
                  return (
                    <li key={page.slug}>
                      <Link
                        href={href}
                        className={`sidebar-link${pathname === href ? ' active' : ''}`}
                      >
                        {page.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </aside>
    </>
  );
}
