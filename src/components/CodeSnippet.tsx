/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable code, tables and diagrams need keyboard focus for arrow-key scrolling. */
import CopyButton from './CopyButton';

export default function CodeSnippet({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  return (
    <div className="not-prose my-6 min-w-0 overflow-hidden rounded-lg border border-dark-700 bg-dark-800">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dark-700 px-3 py-2">
        <span className="text-xs text-dark-200">{language || 'Código'}</span>
        <CopyButton text={code} label="Copiar código" />
      </div>
      <pre
        tabIndex={0}
        aria-label={`Código ${language}`}
        className="m-0 max-w-full overflow-x-auto p-4 text-sm leading-relaxed text-dark-100"
      >
        <code className={language ? `language-${language}` : undefined}>
          {code}
        </code>
      </pre>
    </div>
  );
}
