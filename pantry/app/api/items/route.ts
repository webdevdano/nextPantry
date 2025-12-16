export const dynamic = 'force-dynamic'

const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api'

export async function GET() {
  const res = await fetch(`${base}/items`, { cache: 'no-store' })
  const data = await res.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status: res.status,
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const res = await fetch(`${base}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status: res.status,
  })
}
