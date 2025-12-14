export const ItemType = {
  FOOD: 'food',
  BEVERAGE: 'beverage',
  SUPPLEMENT: 'supplement',
  OTHER: 'other',
} as const
export type ItemType = typeof ItemType[keyof typeof ItemType]
export const ITEM_TYPES = Object.values(ItemType)

export const ItemStatus = {
  AVAILABLE: 'available',
  OUT_OF_STOCK: 'out_of_stock',
  EXPIRED: 'expired',
} as const
export type ItemStatus = typeof ItemStatus[keyof typeof ItemStatus]
export const ITEM_STATUSES = Object.values(ItemStatus)

export const ItemCategory = {
  FRUIT: 'fruit',
  VEGETABLE: 'vegetable',
  DAIRY: 'dairy',
  MEAT: 'meat',
  GRAIN: 'grain',
  SNACK: 'snack',
  BEVERAGE: 'beverage',
  SUPPLEMENT: 'supplement',
  OTHER: 'other',
} as const
export type ItemCategory = typeof ItemCategory[keyof typeof ItemCategory]
export const ITEM_CATEGORIES = Object.values(ItemCategory)

export const ItemUnit = {
  GRAM: 'gram',
  KILOGRAM: 'kilogram',
  LITER: 'liter',
  MILLILITER: 'milliliter',
  PIECE: 'piece',
  PACKET: 'packet',
} as const
export type ItemUnit = typeof ItemUnit[keyof typeof ItemUnit]
export const ITEM_UNITS = Object.values(ItemUnit)

export const ItemPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const
export type ItemPriority = typeof ItemPriority[keyof typeof ItemPriority]
export const ITEM_PRIORITIES = Object.values(ItemPriority)

export const ItemSource = {
  STORE: 'store',
  FARMER_MARKET: 'farmer_market',
  ONLINE: 'online',
  OTHER: 'other',
} as const
export type ItemSource = typeof ItemSource[keyof typeof ItemSource]
export const ITEM_SOURCES = Object.values(ItemSource)

export const ItemStorageCondition = {
  ROOM_TEMPERATURE: 'room_temperature',
  REFRIGERATED: 'refrigerated',
  FROZEN: 'frozen',
} as const
export type ItemStorageCondition =
  typeof ItemStorageCondition[keyof typeof ItemStorageCondition]
export const ITEM_STORAGE_CONDITIONS = Object.values(ItemStorageCondition)

// --- Mongoose schema & model ---
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IItem extends Document {
  name: string
  quantity?: number
  unit?: ItemUnit
  category?: ItemCategory
  type?: ItemType
  status?: ItemStatus
  priority?: ItemPriority
  source?: ItemSource
  storageCondition?: ItemStorageCondition
  notes?: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, min: 0, default: 1 },
    unit: { type: String, enum: ITEM_UNITS, default: ItemUnit.PIECE },
    category: { type: String, enum: ITEM_CATEGORIES, default: ItemCategory.OTHER },
    type: { type: String, enum: ITEM_TYPES, default: ItemType.OTHER },
    status: { type: String, enum: ITEM_STATUSES, default: ItemStatus.AVAILABLE },
    priority: { type: String, enum: ITEM_PRIORITIES, default: ItemPriority.MEDIUM },
    source: { type: String, enum: ITEM_SOURCES },
    storageCondition: { type: String, enum: ITEM_STORAGE_CONDITIONS },
    notes: { type: String, trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const ItemModel: Model<IItem> =
  mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema)

