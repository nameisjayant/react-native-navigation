import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allPages, findPage } from '@/content/nav';
import { pages } from '@/content/pages';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allPages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = findPage(slug);
  return found
    ? { title: found.page.title, description: found.page.description }
    : {};
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const found = findPage(slug);
  const Content = pages[slug];
  if (found == null || Content == null) {
    notFound();
  }
  const { page, prev, next } = found;

  return (
    <article className="article">
      <div className="breadcrumb">{page.section}</div>
      <h1>{page.title}</h1>
      <p className="description">{page.description}</p>
      <Content />
      <nav className="pager" aria-label="Pages">
        {prev && (
          <Link href={`/docs/${prev.slug}`}>
            <small>← Previous</small>
            <strong>{prev.title}</strong>
          </Link>
        )}
        {next && (
          <Link href={`/docs/${next.slug}`} className="next">
            <small>Next →</small>
            <strong>{next.title}</strong>
          </Link>
        )}
      </nav>
    </article>
  );
}
