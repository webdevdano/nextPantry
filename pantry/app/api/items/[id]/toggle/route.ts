export const dynamic = 'force-dynamic'

const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api'

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${base}/items/${params.id}/toggle`, { method: 'PATCH' })
  const data = await res.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status: res.status,
  })
}
