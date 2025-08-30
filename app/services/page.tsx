"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { NotificationCenter } from "@/components/notification-center"
import { PaymentModal } from "@/components/payment-modal"
import { ServiceDetailModal } from "@/components/service-detail-modal"
import { AddServiceModal } from "@/components/add-service-modal"
import { mockApi, type Service } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Plus,
  Wallet,
  LogOut,
  Search,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
} from "lucide-react"
import Link from "next/link"
import {
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

function ServicesContent() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isServiceDetailModalOpen, setIsServiceDetailModalOpen] = useState(false)
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<Service | null>(null)
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)

  if (!user) return null

  const userServices = mockApi.getUserServices(user.id)
  const unreadNotifications = mockApi.getUnreadNotifications(user.id)
  const categories = mockApi.getCategories()
  const monthlyExpenses = mockApi.getMonthlyExpenses()

  const filteredServices = userServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || service.category === filterCategory
    const matchesStatus = filterStatus === "all" || service.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalMonthlyAmount = userServices.reduce((sum, service) => sum + service.amount, 0)
  const activeServices = userServices.filter((service) => service.status === "active")
  const pendingServices = userServices.filter((service) => service.status === "pending")

  const servicesByCategory = categories.map((category) => ({
    ...category,
    services: userServices.filter((service) => service.category === category.name),
    totalAmount: userServices
      .filter((service) => service.category === category.name)
      .reduce((sum, service) => sum + service.amount, 0),
  }))

  const handlePayNow = (service: Service) => {
    setSelectedService(service)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentComplete = (success: boolean) => {
    if (success) {
      console.log("Payment completed successfully")
    }
  }

  const handleViewServiceDetail = (service: Service) => {
    setSelectedServiceForDetail(service)
    setIsServiceDetailModalOpen(true)
  }

  const handleAddService = () => {
    setIsAddServiceModalOpen(true)
  }

  const handleServiceAdded = () => {
    console.log("Servicio agregado exitosamente")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Wallet className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">PayHub</h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <Link href="/dashboard" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} title="Cerrar sesión" className="cursor-pointer">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Gestión de Servicios</h2>
            <p className="text-muted-foreground">Administra todos tus servicios y suscripciones</p>
          </div>
          <Button className="gap-2 cursor-pointer w-full sm:w-auto" onClick={handleAddService}>
            <Plus className="h-4 w-4" />
            <span className="sm:hidden">Agregar</span>
            <span className="hidden sm:inline">Agregar Servicio</span>
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Mensual</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-primary">
                    {mockApi.formatCurrency(totalMonthlyAmount)}
                  </div>
                  <p className="text-xs text-muted-foreground">{userServices.length} servicios</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Servicios Activos</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-secondary">{activeServices.length}</div>
                  <p className="text-xs text-muted-foreground">Funcionando</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Pagos Pendientes</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-destructive">{pendingServices.length}</div>
                  <p className="text-xs text-muted-foreground">Requieren atención</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Próximo Pago</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-foreground">
                    {Math.min(...userServices.map((s) => mockApi.getDaysUntilPayment(s.nextPaymentDate)))}
                  </div>
                  <p className="text-xs text-muted-foreground">días</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de Servicios - Agosto 2025</CardTitle>
                <CardDescription>Detalle de todos los servicios y sus costos mensuales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: service.color }}
                        >
                          {service.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium truncate">{service.name}</h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm text-muted-foreground">{service.category}</p>
                            {service.autopay && (
                              <Badge variant="secondary" className="text-xs">
                                Auto
                              </Badge>
                            )}
                            {service.paymentStatus === "paid" && (
                              <Badge variant="default" className="text-xs bg-green-500">
                                Pagado
                              </Badge>
                            )}
                            {service.paymentStatus === "pending" && !service.autopay && (
                              <Badge variant="destructive" className="text-xs">
                                Pendiente
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-lg">{mockApi.formatCurrency(service.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          Vence: {mockApi.formatDate(service.nextPaymentDate)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-bold text-lg">Total del Mes</h4>
                        <p className="text-sm text-muted-foreground">{userServices.length} servicios activos</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-2xl text-primary">{mockApi.formatCurrency(totalMonthlyAmount)}</p>
                        <p className="text-sm text-muted-foreground">Agosto 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar servicios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={`category-${category.id}`} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const daysUntilPayment = mockApi.getDaysUntilPayment(service.nextPaymentDate)

                return (
                  <Card key={service.id} className="relative group cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader onClick={() => handleViewServiceDetail(service)} className="cursor-pointer">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: service.color }}
                            >
                              {service.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-lg truncate">{service.name}</CardTitle>
                              <CardDescription className="truncate">{service.category}</CardDescription>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewServiceDetail(service)
                              }}
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent onClick={() => handleViewServiceDetail(service)} className="cursor-pointer">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Monto mensual:</span>
                          <span className="font-semibold text-primary text-lg">
                            {mockApi.formatCurrency(service.amount)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Próximo pago:</span>
                          <span className="text-sm font-medium">{mockApi.formatDate(service.nextPaymentDate)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Faltan:</span>
                          <Badge
                            variant={
                              daysUntilPayment <= 3 ? "destructive" : daysUntilPayment <= 7 ? "default" : "secondary"
                            }
                            className={daysUntilPayment <= 7 && daysUntilPayment > 3 ? "bg-yellow-500 text-white" : ""}
                          >
                            {daysUntilPayment} días
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Estado:</span>
                          <Badge
                            variant={service.status === "active" ? "default" : "destructive"}
                            className={service.status === "active" ? "bg-secondary" : ""}
                          >
                            {service.status === "active" ? "Activo" : "Pendiente"}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Auto-pago:</span>
                          <Badge variant={service.autopay ? "secondary" : "outline"}>
                            {service.autopay ? "Habilitado" : "Deshabilitado"}
                          </Badge>
                        </div>

                        {service.status === "pending" && service.paymentStatus === "pending" && !service.autopay && (
                          <Button
                            className="w-full mt-4 cursor-pointer"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePayNow(service)
                            }}
                          >
                            Pagar Ahora
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredServices.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No se encontraron servicios que coincidan con los filtros.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Distribución de Gastos
                  </CardTitle>
                  <CardDescription>Gastos por categoría del mes actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={servicesByCategory.filter((cat) => cat.totalAmount > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="totalAmount"
                        >
                          {servicesByCategory.map((entry, index) => (
                            <Cell key={`pie-cell-${entry.id}-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => mockApi.formatCurrency(value as number)} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {servicesByCategory
                      .filter((cat) => cat.totalAmount > 0)
                      .map((category) => {
                        const percentage =
                          totalMonthlyAmount > 0 ? (category.totalAmount / totalMonthlyAmount) * 100 : 0
                        return (
                          <div key={`legend-${category.id}`} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="truncate">{category.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-medium">{mockApi.formatCurrency(category.totalAmount)}</span>
                              <span className="text-muted-foreground">({percentage.toFixed(1)}%)</span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Evolución de Gastos
                  </CardTitle>
                  <CardDescription>Tendencia de gastos en los últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyExpenses}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="monthName" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip
                          formatter={(value) => [mockApi.formatCurrency(value as number), "Total"]}
                          labelFormatter={(label) => `Mes: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="totalAmount"
                          stroke="#0066CC"
                          strokeWidth={3}
                          dot={{ fill: "#0066CC", strokeWidth: 2, r: 4 }}
                          name="Gastos Totales"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-muted-foreground">Promedio mensual</p>
                      <p className="font-semibold text-lg">
                        {mockApi.formatCurrency(
                          monthlyExpenses.reduce((sum, month) => sum + month.totalAmount, 0) / monthlyExpenses.length,
                        )}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-muted-foreground">Mes más alto</p>
                      <p className="font-semibold text-lg">
                        {mockApi.formatCurrency(Math.max(...monthlyExpenses.map((m) => m.totalAmount)))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Cronograma de Pagos
                </CardTitle>
                <CardDescription>Próximos pagos en los siguientes 30 días</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userServices.slice(0, 3).map((service) => (
                    <div
                      key={`schedule-${service.id}`}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: service.color }}
                        >
                          {service.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">{service.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{mockApi.formatCurrency(service.amount)}</p>
                        <p className="text-sm text-muted-foreground">{mockApi.formatDate(service.nextPaymentDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <PaymentModal
        service={selectedService}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentComplete={handlePaymentComplete}
      />

      <ServiceDetailModal
        service={selectedServiceForDetail}
        isOpen={isServiceDetailModalOpen}
        onClose={() => setIsServiceDetailModalOpen(false)}
        onPayNow={handlePayNow}
      />

      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        onServiceAdded={handleServiceAdded}
      />
    </div>
  )
}

export default function ServicesPage() {
  return (
    <AuthGuard>
      <ServicesContent />
    </AuthGuard>
  )
}
