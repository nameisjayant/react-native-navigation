import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icons } from './Icons';

/** Building blocks for doc pages. */

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function H2({ children, id }: { children: string; id?: string }) {
  const anchor = id ?? slugify(children);
  return (
    <h2 id={anchor}>
      <a href={`#${anchor}`}>{children}</a>
    </h2>
  );
}

export function H3({ children, id }: { children: string; id?: string }) {
  const anchor = id ?? slugify(children);
  return (
    <h3 id={anchor}>
      <a href={`#${anchor}`}>{children}</a>
    </h3>
  );
}

export function C({ children }: { children: ReactNode }) {
  return <code>{children}</code>;
}

export function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="link">
      {children}
    </Link>
  );
}

const calloutIcons = {
  note: Icons.info,
  tip: Icons.bulb,
  warning: Icons.alert,
};

export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: 'note' | 'tip' | 'warning';
  title?: string;
  children: ReactNode;
}) {
  const Icon = calloutIcons[type];
  return (
    <div className={`callout callout-${type}`}>
      <Icon />
      <div className="callout-body">
        {title && <div className="callout-title">{title}</div>}
        {children}
      </div>
    </div>
  );
}

export type PropRow = {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: ReactNode;
};

export function PropsTable({ rows }: { rows: PropRow[] }) {
  const hasDefaults = rows.some((row) => row.defaultValue != null);
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            {hasDefaults && <th>Default</th>}
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
                {row.required && <span className="required">required</span>}
              </td>
              <td className="type-cell">
                <code>{row.type}</code>
              </td>
              {hasDefaults && (
                <td>{row.defaultValue != null ? <code>{row.defaultValue}</code> : '—'}</td>
              )}
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <div className="steps">{children}</div>;
}

export function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="step">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

/** A monospace tree / flow drawing. Wrap highlighted parts in <b>. */
export function Diagram({ children }: { children: ReactNode }) {
  return (
    <div className="diagram">
      <pre className="tree">{children}</pre>
    </div>
  );
}

export function Cards({ children }: { children: ReactNode }) {
  return <div className="card-grid">{children}</div>;
}

export function Card({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="doc-card">
      <strong>{title}</strong>
      <span>{children}</span>
    </Link>
  );
}
