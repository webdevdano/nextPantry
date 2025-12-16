import { Router, Request, Response } from 'express'
import { ItemModel, ITEM_CATEGORIES, ITEM_PRIORITIES, ITEM_STATUSES, ITEM_STORAGE_CONDITIONS, ITEM_TYPES, ITEM_UNITS } from '../models/Item'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await ItemModel.find().lean().sort({ createdAt: -1 })
    res.json({ ok: true, data: items })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, quantity, unit, category, type, status, priority, source, storageCondition, notes } = req.body || {}
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ ok: false, error: 'name is required' })
    }
    if (quantity != null && (typeof quantity !== 'number' || quantity < 0)) {
      return res.status(400).json({ ok: false, error: 'quantity must be a non-negative number' })
    }
    if (unit && !ITEM_UNITS.includes(unit)) {
      return res.status(400).json({ ok: false, error: 'invalid unit' })
    }
    if (category && !ITEM_CATEGORIES.includes(category)) {
      return res.status(400).json({ ok: false, error: 'invalid category' })
    }
    if (type && !ITEM_TYPES.includes(type)) {
      return res.status(400).json({ ok: false, error: 'invalid type' })
    }
    if (status && !ITEM_STATUSES.includes(status)) {
      return res.status(400).json({ ok: false, error: 'invalid status' })
    }
    if (priority && !ITEM_PRIORITIES.includes(priority)) {
      return res.status(400).json({ ok: false, error: 'invalid priority' })
    }
    if (storageCondition && !ITEM_STORAGE_CONDITIONS.includes(storageCondition)) {
      return res.status(400).json({ ok: false, error: 'invalid storageCondition' })
    }

    const item = await ItemModel.create({ name, quantity, unit, category, type, status, priority, source, storageCondition, notes })
    res.status(201).json({ ok: true, data: item })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await ItemModel.findById(req.params.id).lean()
    if (!item) return res.status(404).json({ ok: false, error: 'not found' })
    res.json({ ok: true, data: item })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await ItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean()
    if (!updated) return res.status(404).json({ ok: false, error: 'not found' })
    res.json({ ok: true, data: updated })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

router.patch('/:id/toggle', async (req: Request, res: Response) => {
  try {
    const current = await ItemModel.findById(req.params.id)
    if (!current) return res.status(404).json({ ok: false, error: 'not found' })
    current.completed = !current.completed
    await current.save()
    res.json({ ok: true, data: current })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await ItemModel.findByIdAndDelete(req.params.id).lean()
    if (!deleted) return res.status(404).json({ ok: false, error: 'not found' })
    res.json({ ok: true })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

export default router
