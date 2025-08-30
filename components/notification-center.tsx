"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockApi, type Notification } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, BellRing, CheckCheck, AlertTriangle, Info, CheckCircle } from "lucide-react"
import Link from "next/link"

export function NotificationCenter() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user) {
      const userNotifications = mockApi.getUserNotifications(user.id)
      setNotifications(userNotifications)
    }
  }, [user])

  const unreadNotifications = notifications.filter((n) => !n.isRead)
  const recentNotifications = notifications.slice(0, 5)

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment_reminder":
        return <BellRing className="h-4 w-4 text-blue-500" />
      case "payment_failed":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "payment_success":
        return <CheckCircle className="h-4 w-4 text-secondary" />
      case "new_service":
        return <Info className="h-4 w-4 text-primary" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              {unreadNotifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notificaciones</h3>
            {unreadNotifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs gap-1">
                <CheckCheck className="h-3 w-3" />
                Marcar todas
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-80">
          {recentNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay notificaciones</p>
            </div>
          ) : (
            <div className="p-2">
              {recentNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`mb-2 cursor-pointer transition-all hover:bg-muted/50 ${
                    !notification.isRead ? "border-l-2 border-l-primary bg-primary/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{notification.title}</p>
                          {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {mockApi.formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t">
          <Link href="/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="outline" className="w-full text-sm bg-transparent">
              Ver todas las notificaciones
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
