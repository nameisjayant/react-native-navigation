import type { ReactNode } from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container docs-shell">
      <Sidebar />
      {children}
    </div>
  );
}
