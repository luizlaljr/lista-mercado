"use client"

import {
  Check,
  History,
  ListChecks,
  Plus,
  Settings,
  ShoppingBasket,
  Trash2,
} from "lucide-react"
import { FormEvent, useEffect, useMemo, useState } from "react"
import {
  calculateProgress,
  createShoppingItem,
  QUICK_SUGGESTIONS,
  validateProductName,
} from "@/lib/shopping-list"
import {
  loadShoppingItems,
  loadSuggestionHistory,
  loadSuggestionOrder,
  saveShoppingItems,
  saveSuggestionHistory,
  saveSuggestionOrder,
} from "@/lib/storage"
import {
  buildSuggestionHistory,
  getQuickSuggestions,
} from "@/lib/suggestions"
import type { ProductSuggestionStat, ShoppingItem } from "@/lib/types"

function formatToday(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date())
}

function reorderItems(items: ShoppingItem[]): ShoppingItem[] {
  return items.map((item, index) => ({
    ...item,
    position: index,
  }))
}

function getRandomIndex(maxExclusive: number): number {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1)
    window.crypto.getRandomValues(values)
    return values[0] % maxExclusive
  }

  return Math.floor(Math.random() * maxExclusive)
}

function shuffleSuggestions(suggestions: readonly string[]): string[] {
  const shuffled = [...suggestions]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomIndex(index + 1)
    const current = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = current
  }

  return shuffled
}

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [initialSuggestionOrder, setInitialSuggestionOrder] = useState<string[]>([
    ...QUICK_SUGGESTIONS,
  ])
  const [suggestionHistory, setSuggestionHistory] = useState<
    ProductSuggestionStat[]
  >([])
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("1 un")
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const progress = useMemo(() => calculateProgress(items), [items])
  const suggestions = useMemo(
    () =>
      getQuickSuggestions({
        history: suggestionHistory,
        initialOrder: initialSuggestionOrder,
        defaults: QUICK_SUGGESTIONS,
        limit: QUICK_SUGGESTIONS.length,
      }),
    [initialSuggestionOrder, suggestionHistory],
  )
  const remainingItems = progress.total - progress.completed

  useEffect(() => {
    setItems(loadShoppingItems(window.localStorage))

    const savedSuggestionOrder = loadSuggestionOrder(window.localStorage)
    const nextSuggestionOrder =
      savedSuggestionOrder.length > 0
        ? savedSuggestionOrder
        : shuffleSuggestions(QUICK_SUGGESTIONS)

    if (savedSuggestionOrder.length === 0) {
      saveSuggestionOrder(window.localStorage, nextSuggestionOrder)
    }

    setInitialSuggestionOrder(nextSuggestionOrder)
    setSuggestionHistory(loadSuggestionHistory(window.localStorage))
    setHasLoaded(true)
  }, [])

  useEffect(() => {
    if (hasLoaded) {
      saveShoppingItems(window.localStorage, items)
    }
  }, [hasLoaded, items])

  useEffect(() => {
    if (hasLoaded) {
      saveSuggestionHistory(window.localStorage, suggestionHistory)
    }
  }, [hasLoaded, suggestionHistory])

  function addItem(productName: string, productQuantity: string) {
    const validation = validateProductName(productName)

    if (!validation.valid) {
      setError(validation.message)
      return
    }

    const now = new Date().toISOString()
    const nextItem = createShoppingItem(
      { name: productName, quantity: productQuantity },
      now,
      () => crypto.randomUUID(),
      0,
    )

    setItems((currentItems) => reorderItems([nextItem, ...currentItems]))
    setSuggestionHistory((currentHistory) =>
      buildSuggestionHistory(currentHistory, nextItem.name, now),
    )
    setName("")
    setQuantity("1 un")
    setError(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    addItem(name, quantity)
  }

  function toggleItem(itemId: string) {
    const now = new Date().toISOString()

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              completed: !item.completed,
              updatedAt: now,
            }
          : item,
      ),
    )
  }

  function deleteItem(itemId: string) {
    setItems((currentItems) =>
      reorderItems(currentItems.filter((item) => item.id !== itemId)),
    )
  }

  function removeCompletedItems() {
    setItems((currentItems) =>
      reorderItems(currentItems.filter((item) => !item.completed)),
    )
  }

  function startNewList() {
    if (items.length === 0 || window.confirm("Criar uma nova lista vazia?")) {
      setItems([])
      setError(null)
    }
  }

  return (
    <main className="min-h-screen bg-brand-background pb-28 text-brand-text">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
        <header className="bg-brand-primary px-5 pb-8 pt-6 text-white shadow-soft sm:rounded-b-[32px] sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium capitalize text-white/80">
                {formatToday()}
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight">
                Lista de mercado
              </h1>
              <p className="mt-1 text-base font-medium text-white/85">
                Compras da semana
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
              <ShoppingBasket aria-hidden="true" className="h-6 w-6" />
            </div>
          </div>

          <section className="mt-7" aria-label="Progresso da compra">
            <div className="flex items-center justify-between gap-3 text-sm font-semibold">
              <span>
                {progress.completed} de {progress.total} produtos comprados
              </span>
              <span>{progress.percentage}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </section>
        </header>

        <div className="flex-1 px-4 pt-5 sm:px-8">
          <section className="rounded-[24px] bg-brand-surface p-4 shadow-soft">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-[1fr_minmax(82px,112px)_52px] gap-2"
            >
              <label className="sr-only" htmlFor="product-name">
                Produto
              </label>
              <input
                id="product-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  if (error) {
                    setError(null)
                  }
                }}
                placeholder="Ex.: Leite integral"
                className="min-h-12 min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 text-base outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-red-100"
              />

              <label className="sr-only" htmlFor="product-quantity">
                Quantidade
              </label>
              <input
                id="product-quantity"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="1 un"
                className="min-h-12 min-w-0 rounded-2xl border border-neutral-200 bg-white px-3 text-base outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-red-100"
              />

              <button
                type="submit"
                className="flex min-h-12 items-center justify-center rounded-2xl bg-brand-primary text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
                aria-label="Adicionar produto"
                title="Adicionar produto"
              >
                <Plus aria-hidden="true" className="h-6 w-6" />
              </button>
            </form>
            {error ? (
              <p className="mt-3 text-sm font-medium text-brand-primary">
                {error}
              </p>
            ) : null}
          </section>

          <section className="mt-5" aria-label="Sugestões rápidas">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addItem(suggestion, "1 un")}
                  className="flex min-h-11 shrink-0 items-center gap-1 rounded-full border border-red-100 bg-white px-4 text-sm font-semibold text-brand-primary shadow-sm transition hover:border-brand-primary focus:outline-none focus:ring-4 focus:ring-red-100"
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  {suggestion}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-5" aria-label="Produtos da lista">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Produtos</h2>
                <p className="text-sm text-brand-muted">
                  {remainingItems === 1
                    ? "1 item restante"
                    : `${remainingItems} itens restantes`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={removeCompletedItems}
                  disabled={progress.completed === 0}
                  className="min-h-11 rounded-full border border-neutral-200 bg-white px-3 text-sm font-semibold text-brand-text transition hover:border-brand-primary disabled:cursor-not-allowed disabled:text-neutral-300"
                >
                  Remover comprados
                </button>
                <button
                  type="button"
                  onClick={startNewList}
                  className="min-h-11 rounded-full bg-brand-text px-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Nova lista
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-neutral-300 bg-white px-5 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-brand-primary">
                  <ListChecks aria-hidden="true" className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-bold">Sua lista está vazia</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-brand-muted">
                  Adicione o primeiro produto pelo campo acima ou toque em uma
                  sugestão.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="grid grid-cols-[52px_1fr_48px] items-center gap-3 rounded-[24px] bg-white p-3 shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`flex h-12 w-12 items-center justify-center rounded-full border transition focus:outline-none focus:ring-4 ${
                        item.completed
                          ? "border-brand-success bg-brand-success text-white focus:ring-green-100"
                          : "border-neutral-300 bg-white text-transparent hover:border-brand-primary focus:ring-red-100"
                      }`}
                      aria-label={
                        item.completed
                          ? `Desmarcar ${item.name}`
                          : `Marcar ${item.name} como comprado`
                      }
                      title={item.completed ? "Desmarcar" : "Marcar comprado"}
                    >
                      <Check aria-hidden="true" className="h-6 w-6" />
                    </button>

                    <div className="min-w-0">
                      <h3
                        className={`truncate text-base font-bold ${
                          item.completed
                            ? "text-brand-muted line-through"
                            : "text-brand-text"
                        }`}
                      >
                        {item.name}
                      </h3>
                      <p className="mt-1 truncate text-sm text-brand-muted">
                        {item.quantity} · {item.category}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="flex h-12 w-12 items-center justify-center rounded-full text-brand-muted transition hover:bg-red-50 hover:text-brand-primary focus:outline-none focus:ring-4 focus:ring-red-100"
                      aria-label={`Excluir ${item.name}`}
                      title="Excluir produto"
                    >
                      <Trash2 aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-neutral-200 bg-white/95 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-2">
          <button
            type="button"
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl bg-red-50 text-xs font-bold text-brand-primary"
          >
            <ListChecks aria-hidden="true" className="h-5 w-5" />
            Lista
          </button>
          <button
            type="button"
            disabled
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-semibold text-brand-muted opacity-60"
          >
            <History aria-hidden="true" className="h-5 w-5" />
            Histórico
          </button>
          <button
            type="button"
            disabled
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-semibold text-brand-muted opacity-60"
          >
            <Settings aria-hidden="true" className="h-5 w-5" />
            Ajustes
          </button>
        </div>
      </nav>
    </main>
  )
}
