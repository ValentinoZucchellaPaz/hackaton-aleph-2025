"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { MobileNav } from "@/components/mobile-nav"
import { mockApi, type Notification } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Wallet,
  LogOut,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  Filter,
} from "lucide-react"
import Link from "next/link"

function NotificationsContent() {
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    user ? mockApi.getUserNotifications(user.id) : [],
  )
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const [notificationSettings, setNotificationSettings] = useState({
    paymentReminders: true,
    paymentFailures: true,
    newServices: true,
    discounts: true,
    weeklyReports: false,
  })

  if (!user) return null

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead
    if (filter === "read") return notification.isRead
    return true
  })

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment_reminder":
        return <BellRing className="h-5 w-5 text-blue-500" />
      case "payment_failed":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "payment_success":
        return <CheckCircle className="h-5 w-5 text-secondary" />
      case "new_service":
        return <Info className="h-5 w-5 text-primary" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "payment_reminder":
        return "Recordatorio"
      case "payment_failed":
        return "Error de Pago"
      case "payment_success":
        return "Pago Exitoso"
      case "new_service":
        return "Nuevo Servicio"
      default:
        return "Notificación"
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
              <Button variant="ghost" size="icon" className="relative cursor-pointer">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">{unreadCount}</Badge>
                )}
              </Button>
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Notificaciones</h2>
            <p className="text-muted-foreground">Gestiona tus alertas y configuraciones de notificaciones</p>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="gap-2 bg-transparent cursor-pointer w-full md:w-auto"
            >
              <CheckCheck className="h-4 w-4" />
              Marcar todas como leídas
            </Button>
          )}
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications" className="cursor-pointer">
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="settings" className="cursor-pointer">
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{notifications.length}</div>
                  <p className="text-xs text-muted-foreground">Notificaciones</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sin Leer</CardTitle>
                  <BellRing className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{unreadCount}</div>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Leídas</CardTitle>
                  <Check className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{notifications.length - unreadCount}</div>
                  <p className="text-xs text-muted-foreground">Completadas</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filtrar:</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                      className="cursor-pointer w-full sm:w-auto"
                    >
                      Todas ({notifications.length})
                    </Button>
                    <Button
                      variant={filter === "unread" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("unread")}
                      className="cursor-pointer w-full sm:w-auto"
                    >
                      Sin leer ({unreadCount})
                    </Button>
                    <Button
                      variant={filter === "read" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("read")}
                      className="cursor-pointer w-full sm:w-auto"
                    >
                      Leídas ({notifications.length - unreadCount})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {filter === "all"
                        ? "No tienes notificaciones"
                        : filter === "unread"
                          ? "No tienes notificaciones sin leer"
                          : "No tienes notificaciones leídas"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`transition-all ${
                      !notification.isRead ? "border-l-4 border-l-primary bg-primary/5" : "opacity-75"
                    }`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground truncate">{notification.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs w-fit">
                                  {getNotificationTypeLabel(notification.type)}
                                </Badge>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {mockApi.formatDate(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col items-center gap-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="gap-2 cursor-pointer w-full md:w-auto"
                            >
                              <Check className="h-4 w-4" />
                              <span className="hidden sm:inline">Marcar como leída</span>
                              <span className="sm:hidden">Leída</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-destructive hover:text-destructive cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>Configura qué tipos de notificaciones quieres recibir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">Recordatorios de Pago</h4>
                    <p className="text-sm text-muted-foreground">Recibe alertas antes de que venzan tus servicios</p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, paymentReminders: checked }))
                    }
                    className="cursor-pointer"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">Fallos de Pago</h4>
                    <p className="text-sm text-muted-foreground">Notificaciones cuando un pago no se puede procesar</p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentFailures}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, paymentFailures: checked }))
                    }
                    className="cursor-pointer"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">Nuevos Servicios</h4>
                    <p className="text-sm text-muted-foreground">Confirmaciones cuando agregues un nuevo servicio</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newServices}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, newServices: checked }))
                    }
                    className="cursor-pointer"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">Descuentos y Ofertas</h4>
                    <p className="text-sm text-muted-foreground">Alertas sobre promociones y descuentos disponibles</p>
                  </div>
                  <Switch
                    checked={notificationSettings.discounts}
                    onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, discounts: checked }))}
                    className="cursor-pointer"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">Reportes Semanales</h4>
                    <p className="text-sm text-muted-foreground">Resumen semanal de tus gastos y próximos pagos</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({ ...prev, weeklyReports: checked }))
                    }
                    className="cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de Alertas</CardTitle>
                <CardDescription>Personaliza cuándo y cómo recibir las notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recordar pagos con</label>
                    <select className="w-full p-2 border rounded-md bg-background cursor-pointer">
                      <option value="3">3 días de anticipación</option>
                      <option value="5">5 días de anticipación</option>
                      <option value="7">7 días de anticipación</option>
                      <option value="10">10 días de anticipación</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hora preferida</label>
                    <select className="w-full p-2 border rounded-md bg-background cursor-pointer">
                      <option value="09:00">9:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="gap-2 cursor-pointer w-full md:w-auto">
                <Check className="h-4 w-4" />
                Guardar Configuración
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <NotificationsContent />
    </AuthGuard>
  )
}
