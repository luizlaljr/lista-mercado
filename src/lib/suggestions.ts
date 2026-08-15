import { normalizeProductName } from "./shopping-list"
import type { ProductSuggestionStat } from "./types"

type GetQuickSuggestionsInput = {
  history: ProductSuggestionStat[]
  initialOrder: readonly string[]
  defaults: readonly string[]
  limit: number
}

export function normalizeSuggestionKey(value: string): string {
  return normalizeProductName(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

export function buildSuggestionHistory(
  history: ProductSuggestionStat[],
  productName: string,
  now: string,
): ProductSuggestionStat[] {
  const name = normalizeProductName(productName)
  const key = normalizeSuggestionKey(name)
  const existing = history.find((entry) => entry.key === key)

  if (!existing) {
    return [
      ...history,
      {
        key,
        name,
        count: 1,
        lastUsedAt: now,
      },
    ]
  }

  return history.map((entry) =>
    entry.key === key
      ? {
          ...entry,
          name,
          count: entry.count + 1,
          lastUsedAt: now,
        }
      : entry,
  )
}

export function getQuickSuggestions({
  history,
  initialOrder,
  defaults,
  limit,
}: GetQuickSuggestionsInput): string[] {
  const rankedHistory = [...history].sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count
    }

    if (right.lastUsedAt !== left.lastUsedAt) {
      return right.lastUsedAt.localeCompare(left.lastUsedAt)
    }

    return left.name.localeCompare(right.name, "pt-BR")
  })

  const suggestions: string[] = []
  const seenKeys = new Set<string>()

  function addSuggestion(name: string) {
    const key = normalizeSuggestionKey(name)

    if (!key || seenKeys.has(key) || suggestions.length >= limit) {
      return
    }

    seenKeys.add(key)
    suggestions.push(normalizeProductName(name))
  }

  rankedHistory.forEach((entry) => addSuggestion(entry.name))
  initialOrder.forEach(addSuggestion)
  defaults.forEach(addSuggestion)

  return suggestions
}
