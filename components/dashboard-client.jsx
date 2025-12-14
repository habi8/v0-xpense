"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AddTransactionForm from "@/components/add-transaction-form"
import TransactionsList from "@/components/transactions-list"

export default function DashboardClient({ user, initialTransactions }) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  async function refreshTransactions() {
    const { data } = await supabase.from("transactions").select("*").order("date", { ascending: false })

    if (data) {
      setTransactions(data)
    }
  }

  function handleTransactionAdded() {
    setShowForm(false)
    refreshTransactions()
  }

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  const balance = totalIncome - totalExpense

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary">XPENSE</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-primary/20 text-foreground hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            Logout
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="glass-card border-primary/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-foreground/60">Total Balance</CardDescription>
              <CardTitle className="text-3xl text-primary">৳{balance.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-foreground/60">Total Income</CardDescription>
              <CardTitle className="text-3xl text-green-400">৳{totalIncome.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-foreground/60">Total Expense</CardDescription>
              <CardTitle className="text-3xl text-red-400">৳{totalExpense.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Add Transaction Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg"
          >
            + Add Transaction
          </Button>
        )}

        {/* Add Transaction Form */}
        {showForm && (
          <AddTransactionForm userId={user.id} onSuccess={handleTransactionAdded} onCancel={() => setShowForm(false)} />
        )}

        {/* Transactions List */}
        <TransactionsList transactions={transactions} onDelete={refreshTransactions} />
      </div>
    </div>
  )
}
