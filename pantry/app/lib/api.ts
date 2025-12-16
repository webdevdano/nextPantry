const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api'

export type Item = {
  _id: string
  name: string
  quantity?: number
  unit?: string
  category?: string
  type?: string
  status?: string
  priority?: string
  source?: string
  storageCondition?: string
  notes?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

type ApiResponse<T> = { ok: boolean; data?: T; error?: string }

export async function listItems(): Promise<Item[]> {
  const res = await fetch(`${BASE}/items`, { cache: 'no-store' })
  const json: ApiResponse<Item[]> = await res.json()
  if (!json.ok) throw new Error(json.error || 'Failed to list items')
  return json.data || []
}

export async function createItem(payload: Partial<Item>): Promise<Item> {
  const res = await fetch(`${BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json: ApiResponse<Item> = await res.json()
  if (!json.ok) throw new Error(json.error || 'Failed to create item')
  return json.data as Item
}

export async function updateItem(id: string, payload: Partial<Item>): Promise<Item> {
  const res = await fetch(`${BASE}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json: ApiResponse<Item> = await res.json()
  if (!json.ok) throw new Error(json.error || 'Failed to update item')
  return json.data as Item
}

export async function toggleItem(id: string): Promise<Item> {
  const res = await fetch(`${BASE}/items/${id}/toggle`, { method: 'PATCH' })
  const json: ApiResponse<Item> = await res.json()
  if (!json.ok) throw new Error(json.error || 'Failed to toggle item')
  return json.data as Item
}

export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`${BASE}/items/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const ct = res.headers.get('content-type') || ''
    const payload = ct.includes('application/json') ? await res.json() : await res.text()
    const err = typeof payload === 'string' ? payload : payload?.error
    throw new Error(err || 'Failed to delete item')
  }
}
