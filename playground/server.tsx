import * as http from 'node:http'
import { createRequestListener } from 'remix/node-fetch-server'
import { render } from 'remix/middleware/render'
import { staticFiles } from 'remix/middleware/static'
import { createRouter } from 'remix/router'

import { assets } from './assets.ts'
import { KitchenSink } from './page.tsx'
import { sections } from './sections/index.ts'

const router = createRouter({
  middleware: [staticFiles('./playground/public', { index: false }), render({ assets })],
})

router.get('/assets/*path', async ({ request }) => (await assets.fetch(request)) ?? new Response('Not Found', { status: 404 }))

router.get('/', async (context) => {
  let only = context.url.searchParams.get('section')
  let loaded = await Promise.all(
    sections
      .filter((s) => !only || s.id === only)
      .map(async (s) => {
        try {
          let mod = await s.load()
          let Section = mod.Section
          return { id: s.id, title: s.title, node: <Section /> }
        } catch (error) {
          // A section still being ported must not take the whole kitchen sink down.
          console.error(`[playground] section "${s.id}" failed to load:`, error)
          return { id: s.id, title: s.title, node: <p className="text-red-600">Section failed to load: {String(error)}</p> }
        }
      }),
  )
  return context.render(<KitchenSink sections={loaded} />)
})

router.post('/echo', async ({ request }) => {
  let fd = await request.formData()
  return Response.json(Object.fromEntries([...fd.entries()].map(([k, v]) => [k, typeof v === 'string' ? v : v.name])))
})

const port = process.env.PORT ? Number(process.env.PORT) : 4410
http.createServer(createRequestListener((req) => router.fetch(req))).listen(port, () => {
  console.log(`playground http://localhost:${port}`)
})
