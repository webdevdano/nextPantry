"use client"
import { useEffect, useState } from 'react'
import { createItem, deleteItem, listItems, toggleItem, updateItem, type Item } from '../lib/api'

const CATEGORIES = [
  'fruit', 'vegetable', 'dairy', 'meat', 'grain', 'snack', 'beverage', 'supplement', 'other',
]
const UNITS = [
  'piece', 'gram', 'kilogram', 'liter', 'milliliter', 'packet',
]

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState('other')
  const [unit, setUnit] = useState('piece')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editQuantity, setEditQuantity] = useState<number>(1)
  const [editCategory, setEditCategory] = useState('other')
  const [editUnit, setEditUnit] = useState('piece')

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
      const created = await createItem({ name, quantity, category, unit })
      setItems((prev) => [created, ...prev])
      setName('')
      setQuantity(1)
      setCategory('other')
      setUnit('piece')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }
  function startEdit(item: Item) {
    setEditingId(item._id)
    setEditName(item.name)
    setEditQuantity(item.quantity || 1)
    setEditCategory(item.category || 'other')
    setEditUnit(item.unit || 'piece')
  }

  async function onEditSave(id: string) {
    setLoading(true)
    setError(null)
    try {
      const updated = await updateItem(id, {
        name: editName,
        quantity: editQuantity,
        category: editCategory,
        unit: editUnit,
      })
      setItems((prev) => prev.map((i) => (i._id === id ? updated : i)))
      setEditingId(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function onEditCancel() {
    setEditingId(null)
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
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Add item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          min={1}
          className="w-20 rounded border px-3 py-2"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
        />
        <select
          className="rounded border px-2 py-2"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          className="rounded border px-2 py-2"
          value={unit}
          onChange={e => setUnit(e.target.value)}
        >
          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <button
          onClick={onAdd}
          className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </div>
      {error && <p className="text-red-600 mb-4" role="alert">{error}</p>}
      {loading && <p className="text-zinc-600">Loading...</p>}
      {!loading && items.length === 0 && <p className="text-zinc-500">No items yet. Add your first item!</p>}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item._id} className="flex items-center justify-between rounded border px-3 py-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggle(item._id)}
                className={`h-5 w-5 rounded border ${item.completed ? 'bg-green-600 border-green-600' : 'bg-white'}`}
                aria-label="Toggle completed"
              />
              {editingId === item._id ? (
                <>
                  <input
                    className="rounded border px-2 py-1 w-32"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                  <input
                    type="number"
                    min={1}
                    className="w-16 rounded border px-2 py-1"
                    value={editQuantity}
                    onChange={e => setEditQuantity(Number(e.target.value) || 1)}
                  />
                  <select
                    className="rounded border px-2 py-1"
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    className="rounded border px-2 py-1"
                    value={editUnit}
                    onChange={e => setEditUnit(e.target.value)}
                  >
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <button
                    onClick={() => onEditSave(item._id)}
                    className="rounded bg-green-600 text-white px-3 py-1 ml-2"
                    disabled={loading}
                  >Save</button>
                  <button
                    onClick={onEditCancel}
                    className="rounded bg-zinc-200 px-3 py-1 ml-1"
                    disabled={loading}
                  >Cancel</button>
                </>
              ) : (
                <span className={`${item.completed ? 'line-through text-zinc-500' : ''}`}>
                  {item.name} {item.quantity ? `× ${item.quantity}` : ''} <span className="text-xs text-zinc-400">[{item.category || 'other'}] [{item.unit || 'piece'}]</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editingId !== item._id && (
                <button
                  onClick={() => startEdit(item)}
                  className="rounded bg-zinc-100 px-3 py-1 hover:bg-zinc-200"
                  disabled={loading}
                >Edit</button>
              )}
              <button
                onClick={() => onDelete(item._id)}
                className="rounded bg-zinc-100 px-3 py-1 hover:bg-zinc-200"
                disabled={loading}
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
