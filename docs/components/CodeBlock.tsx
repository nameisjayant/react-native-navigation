import { createHighlighter, type Highlighter } from 'shiki';
import { CopyButton } from './CopyButton';

const LANGS = ['tsx', 'ts', 'bash', 'json', 'kotlin', 'groovy'] as const;
type Lang = (typeof LANGS)[number];

let highlighter: Promise<Highlighter> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: [...LANGS],
  });
  return highlighter;
}

/** Removes the leading newline and the indentation shared by every line. */
function dedent(source: string) {
  const lines = source.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  const indent = Math.min(
    ...lines
      .filter((line) => line.trim() !== '')
      .map((line) => line.match(/^ */)![0].length)
  );
  return lines.map((line) => line.slice(indent)).join('\n');
}

type CodeBlockProps = {
  children: string;
  lang?: Lang;
  /** Shown in the header, usually a file name. */
  title?: string;
};

export async function CodeBlock({ children, lang = 'tsx', title }: CodeBlockProps) {
  const code = dedent(children);
  const html = (await getHighlighter()).codeToHtml(code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  });

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-title">
          <span className="dots">
            <span />
            <span />
            <span />
          </span>
          {title ?? lang}
        </span>
        <CopyButton text={code} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
