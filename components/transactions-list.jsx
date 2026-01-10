"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TransactionsList({ transactions, onDelete }) {
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
        <CardTitle className="text-primary">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((transaction) => (
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
      </CardContent>
    </Card>
  )
}
