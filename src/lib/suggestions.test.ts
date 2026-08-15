import { describe, expect, it } from "vitest"
import {
  buildSuggestionHistory,
  getQuickSuggestions,
  normalizeSuggestionKey,
} from "./suggestions"
import type { ProductSuggestionStat } from "./types"

describe("adaptive quick suggestions", () => {
  it("normalizes suggestion keys across case, accents, and repeated spaces", () => {
    expect(normalizeSuggestionKey("  Água   Mineral ")).toBe("agua mineral")
  })

  it("uses the saved first-use order when there is no product history", () => {
    expect(
      getQuickSuggestions({
        history: [],
        initialOrder: ["Tomate", "Pão", "Ovos"],
        defaults: ["Pão", "Ovos", "Tomate"],
        limit: 3,
      }),
    ).toEqual(["Tomate", "Pão", "Ovos"])
  })

  it("orders suggestions by count, most recent usage, then product name", () => {
    const history: ProductSuggestionStat[] = [
      {
        key: "arroz",
        name: "Arroz",
        count: 2,
        lastUsedAt: "2026-08-15T10:00:00.000Z",
      },
      {
        key: "leite",
        name: "Leite",
        count: 3,
        lastUsedAt: "2026-08-15T09:00:00.000Z",
      },
      {
        key: "banana",
        name: "Banana",
        count: 2,
        lastUsedAt: "2026-08-15T11:00:00.000Z",
      },
      {
        key: "abacate",
        name: "Abacate",
        count: 2,
        lastUsedAt: "2026-08-15T11:00:00.000Z",
      },
    ]

    expect(
      getQuickSuggestions({
        history,
        initialOrder: [],
        defaults: [],
        limit: 4,
      }),
    ).toEqual(["Leite", "Abacate", "Banana", "Arroz"])
  })

  it("fills remaining slots from the saved initial order without duplicates", () => {
    const history: ProductSuggestionStat[] = [
      {
        key: "leite",
        name: "Leite",
        count: 4,
        lastUsedAt: "2026-08-15T10:00:00.000Z",
      },
    ]

    expect(
      getQuickSuggestions({
        history,
        initialOrder: ["Pão", "Leite", "Ovos", "Tomate"],
        defaults: ["Detergente"],
        limit: 4,
      }),
    ).toEqual(["Leite", "Pão", "Ovos", "Tomate"])
  })

  it("increments normalized history entries and preserves the latest display name", () => {
    const first = buildSuggestionHistory(
      [],
      "Água mineral",
      "2026-08-15T10:00:00.000Z",
    )
    const second = buildSuggestionHistory(
      first,
      "agua   MINERAL",
      "2026-08-15T11:00:00.000Z",
    )

    expect(second).toEqual([
      {
        key: "agua mineral",
        name: "agua MINERAL",
        count: 2,
        lastUsedAt: "2026-08-15T11:00:00.000Z",
      },
    ])
  })
})
