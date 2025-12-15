"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const EXPENSE_CATEGORIES = {
  transport: ["Bus", "CNG", "Rickshaw", "Uber", "Train", "Other","Pathao"],
  food: ["Breakfast", "Lunch", "Dinner", "Snacks", "Restaurant", "Groceries", "Other"],
  visit: ["Movie", "Park", "Museum", "Friend's place","relative's house","Shopping mall", "Other"],
  lending: ["Family", "Friend", "Charity", "Gift", "Other"],
  helped: ["Family help", "Friend help", "Neighbor", "Other"],
  tour: ["Hotel", "Travel tickets", "Food", "Activities", "Souvenirs", "Other"],
  bills: ["Electricity", "Water", "Gas", "Internet", "Phone", "Rent","MRT", "Other"],
  shopping: ["Clothing", "Electronics", "Household", "Personal care", "Other"],
  others: ["Medicine", "Entertainment", "Miscellaneous", "Other"],
}

export default function AddTransactionForm({ userId, onSuccess, onCancel }) {
  const [type, setType] = useState("expense")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [details, setDetails] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClient()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: userId,
        type,
        payment_method: paymentMethod,
        amount: Number.parseFloat(amount),
        category,
        details: details || null,
        date: new Date().toISOString(),
      })

      if (error) throw error

      onSuccess()

      // Reset form
      setAmount("")
      setCategory("")
      setDetails("")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card border-primary/20 bg-card">
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
            <div className="grid grid-cols-2 gap-3">
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
                variant={type === "income" ? "default" : "outline"}
                onClick={() => {
                  setType("income")
                  setCategory("")
                }}
                className={
                  type === "income" ? "bg-primary text-primary-foreground" : "border-primary/20 text-foreground"
                }
              >
                Income
              </Button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-foreground">Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={paymentMethod === "cash" ? "default" : "outline"}
                onClick={() => setPaymentMethod("cash")}
                className={
                  paymentMethod === "cash" ? "bg-primary text-primary-foreground" : "border-primary/20 text-foreground"
                }
              >
                Cash
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "bkash" ? "default" : "outline"}
                onClick={() => setPaymentMethod("bkash")}
                className={
                  paymentMethod === "bkash" ? "bg-primary text-primary-foreground" : "border-primary/20 text-foreground"
                }
              >
                bKash
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">
              Amount (৳)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="bg-background/50 border-primary/20 text-foreground"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Category
            </Label>
            {type === "expense" ? (
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-background/50 border-primary/20 text-foreground">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="visit">Visit</SelectItem>
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

          {/* Details */}
          {type === "expense" && category && EXPENSE_CATEGORIES[category] ? (
            <div className="space-y-2">
              <Label htmlFor="details" className="text-foreground">
                Details
              </Label>
              <Select value={details} onValueChange={setDetails}>
                <SelectTrigger className="bg-background/50 border-primary/20 text-foreground">
                  <SelectValue placeholder="Select or skip" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
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
