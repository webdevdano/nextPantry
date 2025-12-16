export const dynamic = 'force-dynamic'

export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api'
  try {
    const res = await fetch(`${base}/health`, { cache: 'no-store' })
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: res.status,
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || 'proxy error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 502,
    })
  }
}
