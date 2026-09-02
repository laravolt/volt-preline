import type { Handle, RemixNode } from 'remix/ui'

import { entryHref, entryPreloads } from './assets.ts'

export function Document(handle: Handle<{ title: string; children?: RemixNode }>) {
  return () => (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <script>{"(function(){var r=document.documentElement;var m=matchMedia('(prefers-color-scheme: dark)');function a(){r.classList.toggle('dark',m.matches)}a();m.addEventListener('change',a)})()"}</script>
        <title>{handle.props.title}</title>
        <link rel="stylesheet" href="/app.css" />
        {entryPreloads.map((href) => (
          <link key={href} rel="modulepreload" href={href} />
        ))}
        <script type="module" src={entryHref}></script>
      </head>
      <body className="h-full bg-background text-foreground antialiased">
        {handle.props.children}
      </body>
    </html>
  )
}

export function KitchenSink(handle: Handle<{ sections: Array<{ id: string; title: string; node: RemixNode }> }>) {
  return () => (
    <Document title="velix-preline playground">
      <main className="mx-auto max-w-6xl space-y-16 p-8">
        <h1 className="text-2xl font-semibold">velix-preline playground</h1>
        <nav className="flex flex-wrap gap-3 text-sm">
          {handle.props.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="underline">
              {s.id}
            </a>
          ))}
        </nav>
        {handle.props.sections.map((s) => (
          <section key={s.id} id={s.id} data-section={s.id} className="space-y-6">
            <h2 className="border-b border-border pb-2 text-lg font-semibold">{s.title}</h2>
            {s.node}
          </section>
        ))}
      </main>
    </Document>
  )
}
