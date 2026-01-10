"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const CATEGORY_COLORS = {
  transport: "hsl(200 100% 50%)",
  food: "hsl(10 100% 60%)",
  visit: "hsl(280 100% 60%)",
  lending: "hsl(40 100% 50%)",
  helped: "hsl(120 100% 50%)",
  tour: "hsl(350 100% 50%)",
  bills: "hsl(180 100% 40%)",
  shopping: "hsl(300 100% 50%)",
  others: "hsl(60 100% 50%)",
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(58 90% 50%)",
  "hsl(348 83% 47%)",
  "hsl(45 93% 51%)",
  "hsl(280 85% 55%)",
]

export default function MonthlyReports({ transactions }) {
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0"))
  const [selectedYear, setSelectedYear] = useState(String(currentDate.getFullYear()))

  // Generate months list (1-12)
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: new Date(2024, i).toLocaleString("default", { month: "long" }),
  }))

  // Generate years list (current year and 2 previous years)
  const years = Array.from({ length: 5 }, (_, i) => {
    const year = currentDate.getFullYear() - i
    return String(year)
  })

  // Filter transactions for selected month/year
  const monthlyTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transDate = new Date(t.date)
      const transMonth = String(transDate.getMonth() + 1).padStart(2, "0")
      const transYear = String(transDate.getFullYear())
      return transMonth === selectedMonth && transYear === selectedYear
    })
  }, [transactions, selectedMonth, selectedYear])

  const monthlyEarnings = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === "income" || t.type === "earnings")
      .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
  }, [monthlyTransactions])

  const monthlyExpense = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
  }, [monthlyTransactions])

  const netSavings = monthlyEarnings - monthlyExpense

  const previousMonth = selectedMonth === "01" ? "12" : String(Number.parseInt(selectedMonth) - 1).padStart(2, "0")
  const previousYear = selectedMonth === "01" ? String(Number.parseInt(selectedYear) - 1) : selectedYear

  const previousMonthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transDate = new Date(t.date)
      const transMonth = String(transDate.getMonth() + 1).padStart(2, "0")
      const transYear = String(transDate.getFullYear())
      return transMonth === previousMonth && transYear === previousYear
    })
  }, [transactions, previousMonth, previousYear])

  const previousMonthExpense = useMemo(() => {
    return previousMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
  }, [previousMonthTransactions])

  const previousMonthEarnings = useMemo(() => {
    return previousMonthTransactions
      .filter((t) => t.type === "income" || t.type === "earnings")
      .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
  }, [previousMonthTransactions])

  const expenseDifference = monthlyExpense - previousMonthExpense
  const expenseDifferencePercent =
    previousMonthExpense > 0 ? ((expenseDifference / previousMonthExpense) * 100).toFixed(1) : 0

  const earningsDifference = monthlyEarnings - previousMonthEarnings
  const earningsDifferencePercent =
    previousMonthEarnings > 0 ? ((earningsDifference / previousMonthEarnings) * 100).toFixed(1) : 0

  // Prepare pie chart data for expense breakdown
  const expenseBreakdown = useMemo(() => {
    const categoryMap = {}
    monthlyTransactions
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
  }, [monthlyTransactions])

  // Get top spending category
  const topSpendingCategory = expenseBreakdown.length > 0 ? expenseBreakdown[0] : null

  function getCategoryColor(categoryName) {
    const categoryKey = Object.keys(CATEGORY_COLORS).find((key) => key.toLowerCase() === categoryName.toLowerCase())
    return categoryKey ? CATEGORY_COLORS[categoryKey] : CHART_COLORS[Math.floor(Math.random() * CHART_COLORS.length)]
  }

  return (
    <div className="space-y-6">
      {/* Month/Year Selection */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Select Month & Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-muted-foreground mb-2 block">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="bg-background/50 border-primary/20 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-muted-foreground mb-2 block">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-background/50 border-primary/20 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-foreground/60">Monthly Earnings</CardDescription>
            <CardTitle className="text-3xl text-green-400">৳{monthlyEarnings.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-foreground/60">Monthly Expense</CardDescription>
            <CardTitle className="text-3xl text-red-400">৳{monthlyExpense.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription className="text-foreground/60">Net Savings</CardDescription>
            <CardTitle className={`text-3xl ${netSavings >= 0 ? "text-primary" : "text-red-400"}`}>
              ৳{netSavings.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="glass-card border-primary/20">
        <CardHeader className="pb-3">
          <CardDescription className="text-foreground/60">Expense Comparison vs Previous Month</CardDescription>
          <div className="flex items-center justify-between mt-2">
            <CardTitle className="text-2xl text-primary">
              {expenseDifference >= 0 ? "↑" : "↓"} ৳{Math.abs(expenseDifference).toFixed(2)}
            </CardTitle>
            <span className={`text-lg font-semibold ${expenseDifference >= 0 ? "text-red-400" : "text-green-400"}`}>
              {expenseDifferencePercent}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {expenseDifference > 0 ? "More" : "Less"} than {months.find((m) => m.value === previousMonth)?.label}
          </p>
        </CardHeader>
      </Card>

      {/* Earnings Comparison vs Previous Month */}
      <Card className="glass-card border-primary/20">
        <CardHeader className="pb-3">
          <CardDescription className="text-foreground/60">Earnings Comparison vs Previous Month</CardDescription>
          <div className="flex items-center justify-between mt-2">
            <CardTitle className="text-2xl text-green-400">
              {earningsDifference >= 0 ? "↑" : "↓"} ৳{Math.abs(earningsDifference).toFixed(2)}
            </CardTitle>
            <span className={`text-lg font-semibold ${earningsDifference >= 0 ? "text-green-400" : "text-red-400"}`}>
              {earningsDifferencePercent}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {earningsDifference > 0 ? "More" : "Less"} than {months.find((m) => m.value === previousMonth)?.label}
          </p>
        </CardHeader>
      </Card>

      {/* Top Spending Category */}
      {topSpendingCategory && (
        <Card className="glass-card border-primary/20 border-2 border-yellow-500/50">
          <CardHeader className="pb-3">
            <CardDescription className="text-foreground/60">Top Spending Category</CardDescription>
            <div className="flex items-center justify-between mt-2">
              <CardTitle className="text-2xl text-primary">{topSpendingCategory.name}</CardTitle>
              <span className="text-xl text-primary">৳{topSpendingCategory.value.toFixed(2)}</span>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Pie Chart */}
      {expenseBreakdown.length > 0 ? (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Expense Breakdown by Category</CardTitle>
            <CardDescription>
              Distribution of expenses for {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ৳${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `৳${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-primary/20">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No expense data available for this month
          </CardContent>
        </Card>
      )}
    </div>
  )
}
