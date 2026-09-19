export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Frontmatter must never be able to terminate the script element.
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
