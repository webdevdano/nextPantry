"use client"
import { useEffect, useState } from 'react'
import { createItem, deleteItem, listItems, toggleItem, updateItem, type Item } from '../lib/api'

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const data = await listItems()
        setItems(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function onAdd() {
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      const created = await createItem({ name, quantity })
      setItems((prev) => [created, ...prev])
      setName('')
      setQuantity(1)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function onToggle(id: string) {
    try {
      const updated = await toggleItem(id)
      setItems((prev) => prev.map((i) => (i._id === id ? updated : i)))
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteItem(id)
      setItems((prev) => prev.filter((i) => i._id !== id))
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Shopping List</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Add item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          min={1}
          className="w-24 rounded border px-3 py-2"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
        />
        <button
          onClick={onAdd}
          className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-zinc-600">Loading...</p>}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item._id} className="flex items-center justify-between rounded border px-3 py-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggle(item._id)}
                className={`h-5 w-5 rounded border ${item.completed ? 'bg-green-600 border-green-600' : 'bg-white'}`}
                aria-label="Toggle completed"
              />
              <span className={`${item.completed ? 'line-through text-zinc-500' : ''}`}>
                {item.name} {item.quantity ? `× ${item.quantity}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDelete(item._id)}
                className="rounded bg-zinc-100 px-3 py-1 hover:bg-zinc-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
