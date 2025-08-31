"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { NotificationCenter } from "@/components/notification-center"
import { MobileNav } from "@/components/mobile-nav"
import { mockApi } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  CreditCard,
  DollarSign,
  History,
  Wallet,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from "lucide-react"
import Link from "next/link"

function PaymentsContent() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPeriod, setFilterPeriod] = useState("all")

  if (!user) return null

  const userServices = mockApi.getUserServices(user.id)
  const userPayments = mockApi.getUserPayments(user.id)

  // Enhanced payments with service information
  const enhancedPayments = userPayments.map((payment) => {
    const service = mockApi.getService(payment.serviceId)
    return { ...payment, service }
  })

  // Filter payments
  const filteredPayments = enhancedPayments.filter((payment) => {
    const matchesSearch =
      payment.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus

    let matchesPeriod = true
    if (filterPeriod !== "all") {
      const paymentDate = new Date(payment.paymentDate)
      const now = new Date()
      const diffTime = now.getTime() - paymentDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (filterPeriod) {
        case "week":
          matchesPeriod = diffDays <= 7
          break
        case "month":
          matchesPeriod = diffDays <= 30
          break
        case "quarter":
          matchesPeriod = diffDays <= 90
          break
      }
    }

    return matchesSearch && matchesStatus && matchesPeriod
  })

  // Calculate statistics
  const totalPaid = enhancedPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const completedPayments = enhancedPayments.filter((p) => p.status === "completed").length
  const pendingPayments = enhancedPayments.filter((p) => p.status === "pending").length
  const failedPayments = enhancedPayments.filter((p) => p.status === "failed").length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-secondary" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "pending":
        return "Pendiente"
      case "failed":
        return "Fallido"
      default:
        return "Desconocido"
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                <Wallet className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">PayHub</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <NotificationCenter />
              <Button variant="ghost" size="icon" onClick={logout} title="Cerrar sesión" className="cursor-pointer">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Historial de Pagos</h2>
            <p className="text-muted-foreground">Revisa todos tus pagos y transacciones</p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent cursor-pointer w-full md:w-auto">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history" className="cursor-pointer">
              Historial
            </TabsTrigger>
            <TabsTrigger value="analytics" className="cursor-pointer">
              Análisis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{mockApi.formatCurrency(totalPaid)}</div>
                  <p className="text-xs text-muted-foreground">Este período</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completados</CardTitle>
                  <CheckCircle className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{completedPayments}</div>
                  <p className="text-xs text-muted-foreground">Pagos exitosos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingPayments}</div>
                  <p className="text-xs text-muted-foreground">En proceso</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fallidos</CardTitle>
                  <XCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{failedPayments}</div>
                  <p className="text-xs text-muted-foreground">Requieren atención</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar pagos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="failed">Fallido</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todo el tiempo</SelectItem>
                        <SelectItem value="week">Última semana</SelectItem>
                        <SelectItem value="month">Último mes</SelectItem>
                        <SelectItem value="quarter">Últimos 3 meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payments List */}
            <div className="space-y-4">
              {filteredPayments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No se encontraron pagos que coincidan con los filtros.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredPayments.map((payment) => (
                  <Card key={payment.id} className="transition-all hover:shadow-md">
                    <CardContent className="pt-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{ backgroundColor: payment.service?.color || "#666" }}
                          >
                            {payment.service?.name.charAt(0) || "?"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-foreground truncate">
                              {payment.service?.name || "Servicio desconocido"}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">{payment.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">{mockApi.formatDate(payment.paymentDate)}</p>
                              {payment.mercadoPagoTransactionId && (
                                <Badge variant="outline" className="text-xs w-fit">
                                  ID: {payment.mercadoPagoTransactionId}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 md:text-right">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payment.status)}
                            <Badge variant={getStatusVariant(payment.status)}>{getStatusLabel(payment.status)}</Badge>
                          </div>
                          <p className="text-lg font-bold text-primary">{mockApi.formatCurrency(payment.amount)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Monthly Spending Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Gastos Mensuales
                </CardTitle>
                <CardDescription>Evolución de tus pagos en los últimos meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Gráfico de gastos mensuales (implementar con biblioteca de gráficos)</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Métodos de Pago
                </CardTitle>
                <CardDescription>Distribución por método de pago utilizado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        MP
                      </div>
                      <div>
                        <h4 className="font-medium">MercadoPago</h4>
                        <p className="text-sm text-muted-foreground">Billetera virtual</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{completedPayments} pagos</p>
                      <p className="text-sm text-muted-foreground">100% del total</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Services */}
            <Card>
              <CardHeader>
                <CardTitle>Servicios con Más Pagos</CardTitle>
                <CardDescription>Tus servicios más utilizados este período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userServices.slice(0, 5).map((service, index) => {
                    const servicePayments = enhancedPayments.filter((p) => p.serviceId === service.id)
                    const totalAmount = servicePayments.reduce((sum, p) => sum + p.amount, 0)

                    return (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: service.color }}
                          >
                            {service.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{mockApi.formatCurrency(totalAmount)}</p>
                          <p className="text-sm text-muted-foreground">{servicePayments.length} pagos</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function PaymentsPage() {
  return (
    <AuthGuard>
      <PaymentsContent />
    </AuthGuard>
  )
}
