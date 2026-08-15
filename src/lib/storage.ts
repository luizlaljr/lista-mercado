import type {
  ProductSuggestionStat,
  ShoppingCategory,
  ShoppingItem,
} from "./types"

export const STORAGE_KEY = "minha-lista.items.v1"
export const SUGGESTION_ORDER_STORAGE_KEY = "minha-lista.suggestions.order.v1"
export const SUGGESTION_HISTORY_STORAGE_KEY =
  "minha-lista.suggestions.history.v1"

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

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string")
}

function isSuggestionStat(value: unknown): value is ProductSuggestionStat {
  if (!value || typeof value !== "object") {
    return false
  }

  const stat = value as Record<string, unknown>

  return (
    typeof stat.key === "string" &&
    typeof stat.name === "string" &&
    typeof stat.count === "number" &&
    Number.isInteger(stat.count) &&
    stat.count > 0 &&
    typeof stat.lastUsedAt === "string"
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

export function loadSuggestionOrder(storage: Storage | null): string[] {
  if (!storage) {
    return []
  }

  try {
    const rawValue = storage.getItem(SUGGESTION_ORDER_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue: unknown = JSON.parse(rawValue)

    return isStringArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export function saveSuggestionOrder(
  storage: Storage | null,
  suggestions: readonly string[],
): void {
  if (!storage) {
    return
  }

  try {
    storage.setItem(SUGGESTION_ORDER_STORAGE_KEY, JSON.stringify(suggestions))
  } catch {
    // The app can keep using in-memory suggestions when persistence is blocked.
  }
}

export function loadSuggestionHistory(
  storage: Storage | null,
): ProductSuggestionStat[] {
  if (!storage) {
    return []
  }

  try {
    const rawValue = storage.getItem(SUGGESTION_HISTORY_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue: unknown = JSON.parse(rawValue)

    return Array.isArray(parsedValue) && parsedValue.every(isSuggestionStat)
      ? parsedValue
      : []
  } catch {
    return []
  }
}

export function saveSuggestionHistory(
  storage: Storage | null,
  history: ProductSuggestionStat[],
): void {
  if (!storage) {
    return
  }

  try {
    storage.setItem(SUGGESTION_HISTORY_STORAGE_KEY, JSON.stringify(history))
  } catch {
    // The app remains usable with in-memory ranking when persistence is blocked.
  }
}
