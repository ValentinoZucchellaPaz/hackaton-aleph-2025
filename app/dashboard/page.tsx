"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { NotificationCenter } from "@/components/notification-center"
import { PaymentModal } from "@/components/payment-modal"
import { ServicesCalendar } from "@/components/services-calendar"
import { AddServiceModal } from "@/components/add-service-modal"
import { ServiceDetailModal } from "@/components/service-detail-modal"
import { AddFundsModal } from "@/components/add-funds-modal"
import { PayAllModal } from "@/components/pay-all-modal"
import { MobileNav } from "@/components/mobile-nav"
import { mockApi, type Service } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CreditCard,
  Plus,
  Wallet,
  LogOut,
  ArrowRight,
  AlertTriangle,
  DollarSign,
  Percent,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

function DashboardContent() {
  const { user, logout } = useAuth()
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"calendar" | "grid">("calendar")
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)
  const [isServiceDetailModalOpen, setIsServiceDetailModalOpen] = useState(false)
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<Service | null>(null)
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false)
  const [isPayAllModalOpen, setIsPayAllModalOpen] = useState(false)
  const [userBalance, setUserBalance] = useState(user?.mercadoPagoAccount?.balance || 0)
  const [userServices, setUserServices] = useState<Service[]>([])

  useEffect(() => {
    if (user) {
      setUserServices(mockApi.getUserServices(user.id))
    }
  }, [user])

  if (!user) return null

  const unreadNotifications = mockApi.getUnreadNotifications(user.id)
  const availableDiscounts = mockApi.getAvailableDiscounts ? mockApi.getAvailableDiscounts(user.id) : []

  const currentMonthPayments = mockApi.getUserPayments(user.id).filter((payment) => {
    const paymentDate = new Date(payment.paymentDate)
    const currentDate = new Date()
    return paymentDate.getMonth() === 7 && paymentDate.getFullYear() === 2025 // Agosto 2025
  })

  const totalMonthlyAmount = userServices.reduce((sum, service) => sum + service.amount, 0)
  const activeServices = userServices.filter((service) => service.status === "active")
  const pendingServices = userServices.filter((service) => service.status === "pending")

  const totalPendingAmount = pendingServices
    .filter((service) => service.paymentStatus === "pending" && !service.autopay)
    .reduce((sum, service) => sum + service.amount, 0)

  const payablePendingServices = pendingServices.filter(
    (service) => service.paymentStatus === "pending" && !service.autopay,
  )

  const hasInsufficientFunds = userBalance < totalPendingAmount

  const handlePayNow = (service: Service) => {
    setSelectedService(service)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentComplete = (success: boolean) => {
    if (success && selectedService) {
      setUserServices((prevServices) =>
        prevServices.map((service) =>
          service.id === selectedService.id ? { ...service, paymentStatus: "paid" as const } : service,
        ),
      )
      console.log("Payment completed successfully")
    }
  }

  const handleServiceAdded = (newService: any) => {
    console.log("New service added:", newService)
  }

  const handleViewServiceDetail = (service: Service) => {
    setSelectedServiceForDetail(service)
    setIsServiceDetailModalOpen(true)
  }

  const handleFundsAdded = (amount: number) => {
    setUserBalance((prev) => prev + amount)
  }

  const handlePayAllComplete = (success: boolean) => {
    if (success) {
      setUserServices((prevServices) =>
        prevServices.map((service) =>
          payablePendingServices.some((ps) => ps.id === service.id)
            ? { ...service, paymentStatus: "paid" as const }
            : service,
        ),
      )
      console.log("All payments completed successfully")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">PayHub</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <NotificationCenter />
              <Link href="/services">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Servicios
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} title="Cerrar sesión" className="cursor-pointer">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            <div className="md:hidden">
              <MobileNav
                userBalance={userBalance}
                onAddFunds={() => setIsAddFundsModalOpen(true)}
                onLogout={logout}
                unreadCount={unreadNotifications.length}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Hola, {user.name}</h2>
          <p className="text-muted-foreground">Gestiona todos tus servicios y pagos desde un solo lugar</p>
          <div className="flex flex-col gap-2 mt-3">
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground w-fit">
              {user.mercadoPagoConnected ? "✓ MercadoPago conectado" : "⚠ MercadoPago no conectado"}
            </Badge>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg w-fit">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">${userBalance.toLocaleString("es-AR")}</span>
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs bg-transparent cursor-pointer"
                onClick={() => setIsAddFundsModalOpen(true)}
              >
                Ingresar
              </Button>
            </div>
          </div>
        </div>

        {hasInsufficientFunds && totalPendingAmount > 0 && (
          <Alert className="mb-8 border-destructive bg-destructive/5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <span className="font-medium text-destructive">Fondos insuficientes</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Tu balance actual (${userBalance.toLocaleString("es-AR")}) no es suficiente para cubrir los pagos
                  pendientes (${totalPendingAmount.toLocaleString("es-AR")}).
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddFundsModalOpen(true)}
                className="shrink-0 w-full sm:w-auto cursor-pointer"
              >
                Ingresar Fondos
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Alert Banner for urgent notifications */}
        {unreadNotifications.some((n) => n.type === "payment_failed") && (
          <Card className="mb-8 border-destructive bg-destructive/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                <div>
                  <h4 className="font-medium text-destructive">Atención requerida</h4>
                  <p className="text-sm text-muted-foreground">
                    Tienes pagos pendientes que requieren tu atención inmediata.
                  </p>
                </div>
                <Link href="/notifications" className="ml-auto">
                  <Button variant="outline" size="sm">
                    Ver detalles
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mensual</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockApi.formatCurrency(totalMonthlyAmount)}</div>
              <p className="text-xs text-muted-foreground">{userServices.length} servicios activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
              <div className="h-4 w-4 rounded-full bg-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{activeServices.length}</div>
              <p className="text-xs text-muted-foreground">Funcionando correctamente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
              <div className="h-4 w-4 rounded-full bg-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{pendingServices.length}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-xl font-semibold text-foreground">Mis Servicios</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {payablePendingServices.length > 0 && (
                <Button
                  variant="secondary"
                  className="gap-2 cursor-pointer flex-1 sm:flex-none"
                  onClick={() => setIsPayAllModalOpen(true)}
                  disabled={hasInsufficientFunds}
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Pagar Todos ({payablePendingServices.length})</span>
                  <span className="sm:hidden">Pagar ({payablePendingServices.length})</span>
                </Button>
              )}
              <Link href="/services" className="flex-1 sm:flex-none">
                <Button variant="outline" className="gap-2 bg-transparent w-full cursor-pointer">
                  <span className="hidden sm:inline">Ver Todos</span>
                  <span className="sm:hidden">Todos</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                className="gap-2 flex-1 sm:flex-none cursor-pointer"
                onClick={() => setIsAddServiceModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Agregar Servicio</span>
                <span className="sm:hidden">Agregar</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-6 p-1 bg-muted rounded-lg w-fit">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Calendario
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Lista
            </button>
          </div>

          {viewMode === "calendar" ? (
            <ServicesCalendar services={userServices} onPayNow={handlePayNow} onViewDetail={handleViewServiceDetail} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {userServices.slice(0, 6).map((service) => {
                const daysUntilPayment = mockApi.getDaysUntilPayment(service.nextPaymentDate)

                return (
                  <Card key={service.id} className="relative cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader onClick={() => handleViewServiceDetail(service)} className="cursor-pointer">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: service.color }}
                          >
                            {service.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base sm:text-lg truncate">{service.name}</CardTitle>
                            <CardDescription className="text-sm truncate">{service.category}</CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:flex-col sm:gap-1 shrink-0">
                          <Badge
                            variant={service.status === "active" ? "default" : "destructive"}
                            className={`text-xs ${service.status === "active" ? "bg-secondary" : ""}`}
                          >
                            {service.status === "active" ? "Activo" : "Pendiente"}
                          </Badge>
                          {service.autopay && (
                            <Badge variant="outline" className="text-xs">
                              Auto
                            </Badge>
                          )}
                          {service.paymentStatus === "paid" && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Pagado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3" onClick={() => handleViewServiceDetail(service)}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Monto:</span>
                          <span className="font-semibold text-primary text-sm sm:text-base">
                            {mockApi.formatCurrency(service.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Próximo pago:</span>
                          <span className="text-sm font-medium">{mockApi.formatDate(service.nextPaymentDate)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Faltan:</span>
                          <span
                            className={`text-sm font-medium ${
                              daysUntilPayment <= 3
                                ? "text-destructive"
                                : daysUntilPayment <= 7
                                  ? "text-yellow-600"
                                  : "text-secondary"
                            }`}
                          >
                            {daysUntilPayment} días
                          </span>
                        </div>
                        {service.status === "pending" && service.paymentStatus === "pending" && !service.autopay && (
                          <Button className="w-full mt-4 cursor-pointer" size="sm">
                            Pagar Ahora
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Discounts Section */}
        {availableDiscounts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Descuentos Disponibles</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableDiscounts.map((discount) => (
                <Card
                  key={discount.id}
                  className="border-l-4 cursor-pointer hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: discount.color }}
                  onClick={() => window.open(discount.redirectUrl, "_blank")}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-medium text-foreground truncate">{discount.title}</h4>
                          <Badge
                            variant="secondary"
                            className="text-xs shrink-0"
                            style={{ backgroundColor: `${discount.color}20`, color: discount.color }}
                          >
                            {discount.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{discount.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground line-through">
                              ${discount.originalPrice.toLocaleString("es-AR")}
                            </p>
                            <p className="font-semibold text-green-600">
                              ${discount.discountedPrice.toLocaleString("es-AR")}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600 shrink-0">
                            -{discount.discountPercentage}%
                          </Badge>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate">
                        Válido hasta: {new Date(discount.validUntil).toLocaleDateString("es-AR")}
                      </span>
                      <span className="font-medium shrink-0 ml-2" style={{ color: discount.color }}>
                        {discount.provider}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {unreadNotifications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">Notificaciones Recientes</h3>
              <Link href="/notifications">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  Ver todas
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {unreadNotifications.slice(0, 3).map((notification) => (
                <Card key={notification.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {mockApi.formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        {notification.type === "payment_reminder" ? "Recordatorio" : "Error"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      <PaymentModal
        service={selectedService}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        onServiceAdded={handleServiceAdded}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedServiceForDetail}
        isOpen={isServiceDetailModalOpen}
        onClose={() => setIsServiceDetailModalOpen(false)}
        onPayNow={handlePayNow}
      />

      <AddFundsModal
        isOpen={isAddFundsModalOpen}
        onClose={() => setIsAddFundsModalOpen(false)}
        currentBalance={userBalance}
        onFundsAdded={handleFundsAdded}
      />

      {/* Pay All Modal */}
      <PayAllModal
        services={userServices}
        isOpen={isPayAllModalOpen}
        onClose={() => setIsPayAllModalOpen(false)}
        onPaymentComplete={handlePayAllComplete}
        userBalance={userBalance}
      />
    </div>
  )
}

export default function HomePage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
