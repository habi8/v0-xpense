"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

export default function TransactionsList({ transactions, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(5)
  const supabase = createClient()

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this transaction?")) return

    const { error } = await supabase.from("transactions").delete().eq("id", id)

    if (!error) {
      onDelete()
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase().trim()
    const category = (t.category || "").toLowerCase()
    const details = (t.details || "").toLowerCase()
    const type = t.type === "income" || t.type === "earnings" ? "earnings" : "expense"
    const paymentMethod = (t.payment_method || "").toLowerCase()
    const amount = t.amount.toString()
    
    return (
      category.includes(query) ||
      details.includes(query) ||
      type.includes(query) ||
      paymentMethod.includes(query) ||
      amount.includes(query)
    )
  })

  // Get visible transactions based on visibleCount
  const visibleTransactions = filteredTransactions.slice(0, visibleCount)
  const hasMore = filteredTransactions.length > visibleCount

  function handleShowMore() {
    setVisibleCount((prev) => prev + 5)
  }

  function clearSearch() {
    setSearchQuery("")
    setVisibleCount(5)
  }

  if (transactions.length === 0) {
    return (
      <Card className="glass-card border-primary/20">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No transactions yet. Add your first one!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle className="text-primary">Recent Transactions</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by category, details, amount..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setVisibleCount(5) // Reset visible count when searching
              }}
              className="pl-10 pr-10 bg-background/50 border-primary/20 text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              Found {filteredTransactions.length} result{filteredTransactions.length !== 1 ? "s" : ""} for "{searchQuery}"
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No transactions match your search.</p>
          </div>
        ) : (
          <>
            {visibleTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-primary/10"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        transaction.type === "income" || transaction.type === "earnings"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {transaction.type === "income" || transaction.type === "earnings" ? "earnings" : "expense"}
                    </span>
                    <span className="text-xs text-muted-foreground">{transaction.payment_method}</span>
                  </div>
                  <div className="font-semibold text-foreground capitalize">
                    {transaction.category}
                    {transaction.details && (
                      <span className="text-muted-foreground font-normal text-sm"> • {transaction.details}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{formatDate(transaction.date)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`text-xl font-bold ${transaction.type === "income" || transaction.type === "earnings" ? "text-green-400" : "text-red-400"}`}
                  >
                    {transaction.type === "income" || transaction.type === "earnings" ? "+" : "-"}৳
                    {Number.parseFloat(transaction.amount).toFixed(2)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Show More Button */}
            {hasMore && (
              <Button
                variant="outline"
                onClick={handleShowMore}
                className="w-full mt-4 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                Show More ({filteredTransactions.length - visibleCount} remaining)
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
