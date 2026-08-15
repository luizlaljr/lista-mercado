import { describe, expect, it } from "vitest"
import { loadShoppingItems, saveShoppingItems, STORAGE_KEY } from "./storage"
import type { ShoppingItem } from "./types"

function createFakeStorage(initial: Record<string, string> = {}): Storage {
  const store = new Map(Object.entries(initial))

  return {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
  }
}

const validItem: ShoppingItem = {
  id: "1",
  name: "Leite",
  quantity: "2 un",
  category: "Laticínios",
  completed: false,
  position: 0,
  createdAt: "2026-08-15T12:00:00.000Z",
  updatedAt: "2026-08-15T12:00:00.000Z",
}

describe("shopping list storage", () => {
  it("restores a valid saved shopping list", () => {
    const storage = createFakeStorage({
      [STORAGE_KEY]: JSON.stringify([validItem]),
    })

    expect(loadShoppingItems(storage)).toEqual([validItem])
  })

  it("returns an empty list when storage has invalid JSON", () => {
    const storage = createFakeStorage({
      [STORAGE_KEY]: "{invalid-json",
    })

    expect(loadShoppingItems(storage)).toEqual([])
  })

  it("returns an empty list when storage has an invalid item shape", () => {
    const storage = createFakeStorage({
      [STORAGE_KEY]: JSON.stringify([{ id: "1", name: "Leite" }]),
    })

    expect(loadShoppingItems(storage)).toEqual([])
  })

  it("returns an empty list when storage is unavailable", () => {
    expect(loadShoppingItems(null)).toEqual([])
  })

  it("saves serialized items to the MVP storage key", () => {
    const storage = createFakeStorage()

    saveShoppingItems(storage, [validItem])

    expect(storage.getItem(STORAGE_KEY)).toBe(JSON.stringify([validItem]))
  })

  it("does nothing when saving while storage is unavailable", () => {
    expect(() => saveShoppingItems(null, [validItem])).not.toThrow()
  })
})
