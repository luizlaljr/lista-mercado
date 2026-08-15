export type ShoppingCategory =
  | "Hortifruti"
  | "Carnes"
  | "Laticínios"
  | "Mercearia"
  | "Bebidas"
  | "Limpeza"
  | "Casa"
  | "Outros"

export interface ShoppingItem {
  id: string
  name: string
  quantity: string
  category: ShoppingCategory
  completed: boolean
  position: number
  createdAt: string
  updatedAt: string
}

export interface ShoppingProgress {
  completed: number
  total: number
  percentage: number
}
