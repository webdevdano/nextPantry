export const dynamic = 'force-dynamic'

const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${base}/items/${params.id}`, { cache: 'no-store' })
  const data = await res.json()
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' }, status: res.status })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => ({}))
  const res = await fetch(`${base}/items/${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' }, status: res.status })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${base}/items/${params.id}`, { method: 'DELETE' })
  const contentType = res.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await res.json() : await res.text()
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload)
  return new Response(body, { headers: { 'Content-Type': contentType || 'application/json' }, status: res.status })
}
