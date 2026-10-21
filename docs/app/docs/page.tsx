import { redirect } from 'next/navigation';
import { allPages } from '@/content/nav';

export default function DocsIndex() {
  redirect(`/docs/${allPages[0]!.slug}`);
}
