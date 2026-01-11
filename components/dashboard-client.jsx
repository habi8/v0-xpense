"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddTransactionForm from "@/components/add-transaction-form"
import TransactionsList from "@/components/transactions-list"
import MonthlyReports from "@/components/monthly-reports"
import YearlyReports from "@/components/yearly-reports"
import Loader from "@/components/loader"
import { BarChart3, TrendingUp, TrendingDown, BookOpen } from "lucide-react"

export default function DashboardClient({ user, initialTransactions }) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    setLoggingOut(true)
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

  const totalEarnings = transactions
    .filter((t) => t.type === "income" || t.type === "earnings")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  const balance = totalEarnings - totalExpense

  return (
    <div className="min-h-screen flex flex-col">
      {loggingOut && <Loader message="Signing out..." />}
      
      {/* Fixed Header */}
      <div className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20 p-4 md:p-8 ${loggingOut ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary">XPENSE</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={loggingOut}
            className="border-primary/20 text-foreground hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            {loggingOut ? "Signing out..." : "Logout"}
          </Button>
        </div>
      </div>

      {/* Fixed Tabs */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-primary/20 ${loggingOut ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full transition-all duration-300">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/20 border border-primary/20">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Monthly Reports
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Yearly Reports
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto pt-32 ${loggingOut ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Tab Content */}
            <div>
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Summary Cards */}
                  <div className="grid gap-4">
                    {/* Current Balance - Full Width */}
                    <Card className="glass-card border-primary/20">
                      <CardHeader className="pb-3">
                        <CardDescription className="text-foreground/60">Current Balance</CardDescription>
                        <CardTitle className="text-5xl text-primary">৳{balance.toFixed(2)}</CardTitle>
                      </CardHeader>
                    </Card>

                    {/* Earnings and Expense Cards Side by Side */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="glass-card border-primary/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardDescription className="text-foreground/60">Total Earnings</CardDescription>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          </div>
                          <CardTitle className="text-2xl text-green-400">৳{totalEarnings.toFixed(2)}</CardTitle>
                        </CardHeader>
                      </Card>

                      <Card className="glass-card border-primary/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardDescription className="text-foreground/60">Total Expense</CardDescription>
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          </div>
                          <CardTitle className="text-2xl text-red-400">৳{totalExpense.toFixed(2)}</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>

                    {/* Reports Card */}
                    <Card
                      className="glass-card border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
                      onClick={() => setActiveTab("reports")}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-primary" />
                            <div>
                              <CardTitle className="text-lg">Reports</CardTitle>
                              <CardDescription className="text-foreground/60 text-sm">
                                View monthly and yearly reports
                              </CardDescription>
                            </div>
                          </div>
                          <BarChart3 className="w-6 h-6 text-primary/40" />
                        </div>
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
                    <AddTransactionForm
                      userId={user.id}
                      onSuccess={handleTransactionAdded}
                      onCancel={() => setShowForm(false)}
                    />
                  )}

                  {/* Transactions List */}
                  <TransactionsList transactions={transactions} onDelete={refreshTransactions} />
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && (
                <div className="animate-fadeIn">
                  <MonthlyReports transactions={transactions} />
                </div>
              )}

              {/* Yearly Reports Tab */}
              {activeTab === "yearly" && (
                <div className="animate-fadeIn">
                  <YearlyReports transactions={transactions} />
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
  )
      
{/* Footer */}

      <footer className={`bg-background/95 backdrop-blur-sm border-t border-primary/20 p-4 md:p-6 mt-auto ${loggingOut ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © 2026 XPENSE by habib
        </div>
      </footer>
    
  
}
