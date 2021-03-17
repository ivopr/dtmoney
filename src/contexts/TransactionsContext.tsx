import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

export const TransactionsContext = createContext({} as TransactionsContextProps)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactionList, setTransactionList] = useState([] as Transaction[])

  async function createTransaction({ amount, category, title, type }: TransactionInput) {
    await api.post("transactions", {
      amount,
      category,
      title,
      type,
      createdAt: new Date()
    }).then(response => setTransactionList([
      ...transactionList,
      response.data.transaction
    ]))
  }

  useEffect(() => {
    api.get("transactions").then(response => setTransactionList(response.data.transactions))
  }, [])

  return (
    <TransactionsContext.Provider value={{
      createTransaction,
      list: transactionList
    }}>
      {children}
    </TransactionsContext.Provider>
  )
}

interface TransactionsContextProps {
  createTransaction: (transaction: TransactionInput) => Promise<void>
  list: Transaction[]
}

interface TransactionsProviderProps {
  children: ReactNode
}

interface Transaction {
  id: number
  title: string
  amount: number
  category: string
  type: string
  createdAt: string
}

type TransactionInput = Omit<Transaction, "id" | "createdAt">