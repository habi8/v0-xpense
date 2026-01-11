"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const CATEGORY_COLORS = {
  transport: "hsl(200 70% 45%)",
  food: "hsl(10 70% 50%)",
  visit: "hsl(280 60% 50%)",
  lending: "hsl(40 70% 45%)",
  helped: "hsl(120 60% 45%)",
  tour: "hsl(350 65% 48%)",
  bills: "hsl(180 70% 40%)",
  shopping: "hsl(300 55% 48%)",
  others: "hsl(60 65% 45%)",
}

export default function YearlyReports({ transactions }) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(String(currentYear))

  const availableYears = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i
    return String(year)
  })

  const yearlyTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transDate = new Date(t.date)
      return transDate.getFullYear() === Number.parseInt(selectedYear)
    })
  }, [transactions, selectedYear])

  const totalYearlyEarnings = useMemo(() => {
    return yearlyTransactions
      .filter((t) => t.type === "income" || t.type === "earnings")
      .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
  }, [yearlyTransactions])

  const totalYearlyExpense = useMemo(() => {
    return yearlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
  }, [yearlyTransactions])

  const yearlyNetSavings = totalYearlyEarnings - totalYearlyExpense

  const yearlyExpenseBreakdown = useMemo(() => {
    const categoryMap = {}
    yearlyTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const cat = t.category || "Uncategorized"
        categoryMap[cat] = (categoryMap[cat] || 0) + Number.parseFloat(t.amount)
      })

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: Number.parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value)
  }, [yearlyTransactions])

  const monthlyEarningsExpenses = useMemo(() => {
    const monthlyData = {}

    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = {
        month: new Date(2024, i - 1).toLocaleString("default", { month: "short" }),
        earnings: 0,
        expenses: 0,
      }
    }

    yearlyTransactions.forEach((t) => {
      const transDate = new Date(t.date)
      const month = transDate.getMonth() + 1
      if (t.type === "income" || t.type === "earnings") {
        monthlyData[month].earnings += Number.parseFloat(t.amount)
      } else if (t.type === "expense") {
        monthlyData[month].expenses += Number.parseFloat(t.amount)
      }
    })

    return Object.values(monthlyData).map((m) => ({
      ...m,
      earnings: Number.parseFloat(m.earnings.toFixed(2)),
      expenses: Number.parseFloat(m.expenses.toFixed(2)),
    }))
  }, [yearlyTransactions])

  const monthlyPaymentBreakdown = useMemo(() => {
    const monthlyData = {}

    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = { month: new Date(2024, i - 1).toLocaleString("default", { month: "short" }), cash: 0, bkash: 0 }
    }

    yearlyTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const transDate = new Date(t.date)
        const month = transDate.getMonth() + 1
        if (t.payment_method === "cash") {
          monthlyData[month].cash += Number.parseFloat(t.amount)
        } else if (t.payment_method === "bkash") {
          monthlyData[month].bkash += Number.parseFloat(t.amount)
        }
      })

    return Object.values(monthlyData).map((m) => ({
      ...m,
      cash: Number.parseFloat(m.cash.toFixed(2)),
      bkash: Number.parseFloat(m.bkash.toFixed(2)),
    }))
  }, [yearlyTransactions])

  function getCategoryColor(categoryName) {
    const categoryKey = Object.keys(CATEGORY_COLORS).find((key) => key.toLowerCase() === categoryName.toLowerCase())
    return categoryKey ? CATEGORY_COLORS[categoryKey] : "hsl(200 100% 50%)"
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Select Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex-1 max-w-xs">
            <label className="text-sm text-muted-foreground mb-2 block">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-background/50 border-primary/20 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-primary/20">
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Yearly Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-foreground/60">Yearly Earnings</CardDescription>
            <CardTitle className="text-3xl text-green-400">৳{totalYearlyEarnings.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-foreground/60">Yearly Expense</CardDescription>
            <CardTitle className="text-3xl text-red-400">৳{totalYearlyExpense.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-foreground/60">Net Savings</CardDescription>
            <CardTitle className={`text-3xl ${yearlyNetSavings >= 0 ? "text-primary" : "text-red-400"}`}>
              ৳{yearlyNetSavings.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {monthlyEarningsExpenses.some((m) => m.earnings > 0 || m.expenses > 0) ? (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Monthly Earnings vs Expenses</CardTitle>
            <CardDescription>Earnings and expenses comparison by month for {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEarningsExpenses} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `৳${value.toFixed(2)}`} contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "4px" }} textStyle={{ color: "#fff" }} />
                  <Legend />
                  <Bar dataKey="earnings" fill="hsl(120 100% 50%)" name="Earnings" />
                  <Bar dataKey="expenses" fill="hsl(10 100% 60%)" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-primary/20">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No earnings/expense data available for {selectedYear}
          </CardContent>
        </Card>
      )}

      {/* Yearly Expense Pie Chart */}
      {yearlyExpenseBreakdown.length > 0 ? (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Yearly Expense Breakdown by Category</CardTitle>
            <CardDescription>Distribution of all expenses for {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <div style={{ width: "100%", height: "300px" }} className="md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <Pie
                      data={yearlyExpenseBreakdown}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      label={false}
                      outerRadius={{ xs: 80, sm: 100, md: 120 }}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {yearlyExpenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `৳${value.toFixed(2)}`} />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {yearlyExpenseBreakdown.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded bg-background/50">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(entry.name) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">৳{entry.value.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-primary/20">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No expense data available for {selectedYear}
          </CardContent>
        </Card>
      )}

      {/* Monthly Cash vs bKash Comparison */}
      {monthlyPaymentBreakdown.some((m) => m.cash > 0 || m.bkash > 0) ? (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Monthly Cash vs bKash Expenses</CardTitle>
            <CardDescription>Payment method breakdown by month for {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPaymentBreakdown} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `৳${value.toFixed(2)}`} contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "4px" }} textStyle={{ color: "#fff" }} />
                  <Legend />
                  <Bar dataKey="cash" fill="hsl(58 90% 50%)" name="Cash" />
                  <Bar dataKey="bkash" fill="hsl(280 85% 55%)" name="bKash" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-primary/20">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No payment method data available for {selectedYear}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
