"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const EXPENSE_CATEGORIES = {
  transport: ["Bus", "CNG", "Rickshaw", "Uber", "Pathao", "Train", "Other"],
  food: ["Breakfast", "Lunch", "Dinner", "Snacks", "Restaurant", "Other"],
  visit: ["Movie", "Park", "Museum", "Friend's place", "Shopping mall", "Other"],
  date: ["Movie", "Restaurant", "Museum", "Exploration", "Other"],
  lending: ["Family", "Friend", "Charity", "Gift", "Other"],
  helped: ["Family help", "Friend help", "Neighbor", "Other"],
  tour: ["Hotel", "Travel tickets", "Food", "Activities", "Souvenirs", "Other"],
  bills: ["Electricity", "Water", "Gas", "Internet", "Phone", "Rent", "MRT", "Other"],
  shopping: ["Clothing", "Electronics", "Household", "Personal care", "Groceries", "Other"],
  others: ["Medicine", "Entertainment", "Miscellaneous", "Other"],
}

export default function AddTransactionForm({ userId, onSuccess, onCancel }) {
  const [type, setType] = useState("expense")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [details, setDetails] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClient()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const parsedAmount = Number.parseFloat(amount)

      if (!amount || parsedAmount <= 0) {
        setError("Amount must be greater than 0")
        setLoading(false)
        return
      }

      let dbType = type
      if (type === "earnings") {
        dbType = "income"
      }

      const finalCategory = category === "others" && customCategory ? customCategory : category
      const transactionData = {
        user_id: userId,
        type: dbType,
        amount: parsedAmount,
        date: new Date().toISOString(),
        payment_method: paymentMethod || "cash",
        category: finalCategory || "uncategorized",
      }

      if (type === "bank_deposit" || type === "bank_withdrawal") {
        transactionData.payment_method = "bank"
        transactionData.category = "bank"
      }

      const { error } = await supabase.from("transactions").insert(transactionData)

      if (error) throw error

      onSuccess()

      // Reset form
      setAmount("")
      setCategory("")
      setCustomCategory("")
      setDetails("")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Show simplified form for bank transactions
  const isBankTransaction = type === "bank_deposit" || type === "bank_withdrawal"

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Add New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded bg-destructive/10 border border-destructive text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Type Selection */}
          <div className="space-y-2">
            <Label className="text-foreground">Transaction Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                type="button"
                variant={type === "expense" ? "default" : "outline"}
                onClick={() => {
                  setType("expense")
                  setCategory("")
                }}
                className={
                  type === "expense" ? "bg-primary text-primary-foreground" : "border-primary/20 text-foreground"
                }
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={type === "earnings" ? "default" : "outline"}
                onClick={() => {
                  setType("earnings")
                  setCategory("")
                }}
                className={
                  type === "earnings" ? "bg-primary text-primary-foreground" : "border-primary/20 text-foreground"
                }
              >
                Earnings
              </Button>
              <Button
                type="button"
                variant={type === "bank_deposit" ? "default" : "outline"}
                onClick={() => {
                  setType("bank_deposit")
                  setCategory("")
                  setPaymentMethod("")
                }}
                className={
                  type === "bank_deposit" ? "bg-primary text-primary-foreground" : "border-primary/20 text-foreground"
                }
              >
                Bank Deposit
              </Button>
              <Button
                type="button"
                variant={type === "bank_withdrawal" ? "default" : "outline"}
                onClick={() => {
                  setType("bank_withdrawal")
                  setCategory("")
                  setPaymentMethod("")
                }}
                className={
                  type === "bank_withdrawal"
                    ? "bg-primary text-primary-foreground"
                    : "border-primary/20 text-foreground"
                }
              >
                Bank Withdrawal
              </Button>
            </div>
          </div>

          {/* Payment Method - Only show for non-bank transactions */}
          {!isBankTransaction && (
            <div className="space-y-2">
              <Label className="text-foreground">Payment Method</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                  className={
                    paymentMethod === "cash"
                      ? "bg-primary text-primary-foreground"
                      : "border-primary/20 text-foreground"
                  }
                >
                  Cash
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === "bkash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("bkash")}
                  className={
                    paymentMethod === "bkash"
                      ? "bg-primary text-primary-foreground"
                      : "border-primary/20 text-foreground"
                  }
                >
                  bKash
                </Button>
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">
              Amount (৳)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="bg-background/50 border-primary/20 text-foreground"
            />
          </div>

          {/* Category - Only show for non-bank transactions */}
          {!isBankTransaction && (
            <>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground">
                  Category
                </Label>
                {type === "expense" ? (
                  <Select
                    value={category}
                    onValueChange={(val) => {
                      setCategory(val)
                      setCustomCategory("")
                    }}
                    required
                  >
                    <SelectTrigger className="bg-background/50 border-primary/20 text-foreground">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-primary/20">
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="visit">Visit</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="lending">Lending Money</SelectItem>
                      <SelectItem value="helped">Helped With</SelectItem>
                      <SelectItem value="tour">Tour</SelectItem>
                      <SelectItem value="bills">Bills</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="category"
                    type="text"
                    placeholder="e.g., Salary, Freelance, Gift"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="bg-background/50 border-primary/20 text-foreground"
                  />
                )}
              </div>

              {type === "expense" && category === "others" && (
                <div className="space-y-2">
                  <Label htmlFor="customCategory" className="text-foreground">
                    Custom Category Name
                  </Label>
                  <Input
                    id="customCategory"
                    type="text"
                    placeholder="e.g., Haircut, Books, etc."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    required
                    className="bg-background/50 border-primary/20 text-foreground"
                  />
                </div>
              )}

              {/* Details */}
              {type === "expense" && category && category !== "others" && EXPENSE_CATEGORIES[category] ? (
                <div className="space-y-2">
                  <Label htmlFor="details" className="text-foreground">
                    Details
                  </Label>
                  <Select value={details} onValueChange={setDetails}>
                    <SelectTrigger className="bg-background/50 border-primary/20 text-foreground">
                      <SelectValue placeholder="Select or skip" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-primary/20">
                      {EXPENSE_CATEGORIES[category].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="details" className="text-foreground">
                    Details (Optional)
                  </Label>
                  <Input
                    id="details"
                    type="text"
                    placeholder="Add more details..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="bg-background/50 border-primary/20 text-foreground"
                  />
                </div>
              )}
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-primary/20 text-foreground bg-transparent"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Transaction"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
