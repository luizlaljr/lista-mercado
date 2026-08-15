import { describe, expect, it } from "vitest"
import {
  calculateProgress,
  createShoppingItem,
  inferCategory,
  normalizeProductName,
  validateProductName,
} from "./shopping-list"

describe("shopping-list domain helpers", () => {
  it("creates a new incomplete item with normalized input, inferred category, and provided quantity", () => {
    const item = createShoppingItem(
      { name: "  Leite   integral ", quantity: " 2 un " },
      "2026-08-15T12:00:00.000Z",
      () => "item-1",
      3,
    )

    expect(item).toEqual({
      id: "item-1",
      name: "Leite integral",
      quantity: "2 un",
      category: "Laticínios",
      completed: false,
      position: 3,
      createdAt: "2026-08-15T12:00:00.000Z",
      updatedAt: "2026-08-15T12:00:00.000Z",
    })
  })

  it("uses one unit as the default quantity for quick additions", () => {
    const item = createShoppingItem(
      { name: "Pão", quantity: "" },
      "2026-08-15T12:00:00.000Z",
      () => "item-2",
      0,
    )

    expect(item.quantity).toBe("1 un")
  })

  it("normalizes product names by trimming and collapsing repeated spaces", () => {
    expect(normalizeProductName("  arroz   integral   ")).toBe("arroz integral")
  })

  it("rejects empty product names without changing list state", () => {
    expect(validateProductName("   ")).toEqual({
      valid: false,
      message: "Informe o nome do produto.",
    })
  })

  it.each([
    ["Banana prata", "Hortifruti"],
    ["TOMATE italiano", "Hortifruti"],
    ["Frango", "Carnes"],
    ["leite", "Laticínios"],
    ["Queijo minas", "Laticínios"],
    ["Pão francês", "Mercearia"],
    ["arroz", "Mercearia"],
    ["Água mineral", "Bebidas"],
    ["agua com gas", "Bebidas"],
    ["Detergente neutro", "Limpeza"],
  ] as const)("infers %s as %s", (name, category) => {
    expect(inferCategory(name)).toBe(category)
  })

  it("falls back to Outros when no category rule matches", () => {
    expect(inferCategory("pilha alcalina")).toBe("Outros")
  })

  it("calculates zero progress for an empty list", () => {
    expect(calculateProgress([])).toEqual({
      completed: 0,
      total: 0,
      percentage: 0,
    })
  })

  it("calculates completed count and rounded percentage", () => {
    expect(
      calculateProgress([
        {
          id: "1",
          name: "Arroz",
          quantity: "1 kg",
          category: "Mercearia",
          completed: true,
          position: 0,
          createdAt: "2026-08-15T12:00:00.000Z",
          updatedAt: "2026-08-15T12:00:00.000Z",
        },
        {
          id: "2",
          name: "Leite",
          quantity: "2 un",
          category: "Laticínios",
          completed: false,
          position: 1,
          createdAt: "2026-08-15T12:00:00.000Z",
          updatedAt: "2026-08-15T12:00:00.000Z",
        },
      ]),
    ).toEqual({
      completed: 1,
      total: 2,
      percentage: 50,
    })
  })

  it("returns full completion when every item is completed", () => {
    expect(
      calculateProgress([
        {
          id: "1",
          name: "Arroz",
          quantity: "1 kg",
          category: "Mercearia",
          completed: true,
          position: 0,
          createdAt: "2026-08-15T12:00:00.000Z",
          updatedAt: "2026-08-15T12:00:00.000Z",
        },
      ]),
    ).toEqual({
      completed: 1,
      total: 1,
      percentage: 100,
    })
  })
})
