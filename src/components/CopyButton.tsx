'use client';

import { useState } from 'react';

export default function CopyButton({
  text,
  label = 'Copiar',
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual'>('idle');
  return (
    <div className="min-w-0">
      <button
        type="button"
        className="min-h-11 rounded-lg border border-dark-600 bg-dark-800 px-3 text-sm text-white hover:bg-dark-700"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setStatus('copied');
          } catch {
            setStatus('manual');
          }
        }}
      >
        {label}
      </button>
      <output className="ml-2 text-sm text-primary-300">
        {status === 'copied' ? 'Copiado!' : ''}
      </output>
      {status === 'manual' && (
        <div className="mt-2">
          <output className="mb-2 text-sm text-dark-200">
            Não foi possível copiar automaticamente. Selecione o texto abaixo
            para copiar.
          </output>
          <textarea
            aria-label="Texto para copiar manualmente"
            readOnly
            value={text}
            onFocus={event => event.currentTarget.select()}
            className="w-full rounded-lg border border-dark-600 bg-dark-800 p-3 text-sm"
            rows={3}
          />
        </div>
      )}
    </div>
  );
}
