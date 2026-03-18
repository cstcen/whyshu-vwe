import React from 'react'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">VWE Website Template</h1>
      <p>
        This template demonstrates how to embed the VWE editor/renderer into a site. Copy your
        Vue pages from <strong>E:\\Code\\lktop\\website\\pages</strong> into
        <code>packages/website-template/src/pages</code> and adapt them as React pages or use
        an iframe to host original Vue pages.
      </p>
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold">Quick Start</h2>
        <ol className="list-decimal list-inside mt-2">
          <li>Run <code>pnpm --filter @whyshu/website-template dev</code> from repo root.</li>
          <li>Open <code>/editor</code> to see the Editor Demo and integration notes.</li>
        </ol>
      </section>
    </div>
  )
}
