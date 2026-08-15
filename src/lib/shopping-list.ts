import type { ShoppingCategory, ShoppingItem, ShoppingProgress } from "./types"

export const QUICK_SUGGESTIONS = [
  "Pão",
  "Ovos",
  "Tomate",
  "Queijo",
  "Frango",
  "Água",
  "Detergente",
] as const

type CreateShoppingItemInput = {
  name: string
  quantity: string
}

type ValidationResult =
  | {
      valid: true
      message: null
    }
  | {
      valid: false
      message: string
    }

const CATEGORY_KEYWORDS: Array<{
  category: ShoppingCategory
  terms: string[]
}> = [
  {
    category: "Hortifruti",
    terms: ["banana", "tomate", "alface", "cebola", "batata", "maca", "laranja"],
  },
  {
    category: "Carnes",
    terms: ["frango", "carne", "peixe", "bife", "linguica"],
  },
  {
    category: "Laticínios",
    terms: ["leite", "queijo", "iogurte", "manteiga", "requeijao"],
  },
  {
    category: "Mercearia",
    terms: ["arroz", "feijao", "pao", "ovos", "macarrao", "farinha", "acucar"],
  },
  {
    category: "Bebidas",
    terms: ["agua", "suco", "refrigerante", "cerveja", "vinho"],
  },
  {
    category: "Limpeza",
    terms: ["detergente", "sabao", "desinfetante", "amaciante", "esponja"],
  },
  {
    category: "Casa",
    terms: [],
  },
]

export function normalizeProductName(value: string): string {
  return value.trim().replace(/\s+/g, " ")
}

function normalizeForMatch(value: string): string {
  return normalizeProductName(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

export function validateProductName(value: string): ValidationResult {
  if (!normalizeProductName(value)) {
    return {
      valid: false,
      message: "Informe o nome do produto.",
    }
  }

  return {
    valid: true,
    message: null,
  }
}

export function inferCategory(name: string): ShoppingCategory {
  const normalizedName = normalizeForMatch(name)
  const match = CATEGORY_KEYWORDS.find(({ terms }) =>
    terms.some((term) => normalizedName.includes(term)),
  )

  return match?.category ?? "Outros"
}

export function createShoppingItem(
  input: CreateShoppingItemInput,
  now: string,
  createId: () => string = () => crypto.randomUUID(),
  position = 0,
): ShoppingItem {
  const name = normalizeProductName(input.name)
  const quantity = normalizeProductName(input.quantity) || "1 un"

  return {
    id: createId(),
    name,
    quantity,
    category: inferCategory(name),
    completed: false,
    position,
    createdAt: now,
    updatedAt: now,
  }
}

export function calculateProgress(items: ShoppingItem[]): ShoppingProgress {
  const total = items.length
  const completed = items.filter((item) => item.completed).length

  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
}
