import type { ShoppingCategory, ShoppingItem } from "./types"

export const STORAGE_KEY = "minha-lista.items.v1"

const CATEGORIES: ShoppingCategory[] = [
  "Hortifruti",
  "Carnes",
  "Laticínios",
  "Mercearia",
  "Bebidas",
  "Limpeza",
  "Casa",
  "Outros",
]

function isShoppingItem(value: unknown): value is ShoppingItem {
  if (!value || typeof value !== "object") {
    return false
  }

  const item = value as Record<string, unknown>

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.quantity === "string" &&
    typeof item.category === "string" &&
    CATEGORIES.includes(item.category as ShoppingCategory) &&
    typeof item.completed === "boolean" &&
    typeof item.position === "number" &&
    typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string"
  )
}

export function loadShoppingItems(storage: Storage | null): ShoppingItem[] {
  if (!storage) {
    return []
  }

  try {
    const rawValue = storage.getItem(STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue: unknown = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue) || !parsedValue.every(isShoppingItem)) {
      return []
    }

    return parsedValue
  } catch {
    return []
  }
}

export function saveShoppingItems(
  storage: Storage | null,
  items: ShoppingItem[],
): void {
  if (!storage) {
    return
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // The app remains usable for the current session when persistence is blocked.
  }
}
