'use client';
import { useState, useCallback } from 'react';
import { Link2, Check } from 'lucide-react';

interface SectionAnchorProps {
  id: string;
}

export default function SectionAnchor({ id }: SectionAnchorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [id]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 text-gray-400 hover:text-gray-700"
      title={copied ? 'Link copiado!' : 'Copiar link para esta seção'}
      aria-label="Copiar link para esta seção"
    >
      {copied ? (
        <Check className="size-4 text-green-600" />
      ) : (
        <Link2 className="size-4" />
      )}
      {copied && (
        <span className="text-[10px] text-green-600 ml-1 font-medium">Copiado!</span>
      )}
    </button>
  );
}
