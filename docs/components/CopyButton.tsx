'use client';

import { useState } from 'react';
import { Icons } from './Icons';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be denied; nothing useful to do.
    }
  };

  return (
    <button type="button" className="copy-button" onClick={copy}>
      {copied ? <Icons.check size={14} /> : <Icons.copy size={14} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
