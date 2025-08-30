"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { mockApi, type Service } from "@/lib/mock-data"

interface ServicesCalendarProps {
  services: Service[]
  onPayNow: (service: Service) => void
  onViewDetail?: (service: Service) => void
}

export function ServicesCalendar({ services, onPayNow, onViewDetail }: ServicesCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getServicesForDate = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return services.filter((service) => {
      const serviceDate = new Date(service.nextPaymentDate)
      return (
        serviceDate.getDate() === day &&
        serviceDate.getMonth() === currentDate.getMonth() &&
        serviceDate.getFullYear() === currentDate.getFullYear()
      )
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleServiceClick = (service: Service, event: React.MouseEvent) => {
    event.stopPropagation()

    if (service.paymentStatus === "paid" || service.autopay) {
      // If service is paid or has autopay, show details
      if (onViewDetail) {
        onViewDetail(service)
      }
    } else if (service.paymentStatus === "pending" && !service.autopay) {
      // Only allow payment for pending services without autopay
      onPayNow(service)
    }
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const today = new Date()
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-16 md:h-24" />
            }

            const dayServices = getServicesForDate(day)
            const isToday = isCurrentMonth && day === today.getDate()
            const hasPendingPayments = dayServices.some((s) => s.paymentStatus === "pending" && !s.autopay)

            return (
              <div
                key={day}
                className={`h-16 md:h-24 border rounded-lg p-1 relative ${
                  isToday ? "border-primary bg-primary/5" : "border-border"
                } ${hasPendingPayments ? "border-destructive/50" : ""}`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>{day}</div>

                <div className="md:hidden">
                  {dayServices.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayServices.slice(0, 3).map((service) => (
                        <div
                          key={`mobile-${day}-${service.id}`}
                          className="w-2 h-2 rounded-full cursor-pointer hover:scale-125 transition-transform"
                          style={{ backgroundColor: service.color }}
                          onClick={(e) => handleServiceClick(service, e)}
                          title={`${service.name} - ${mockApi.formatCurrency(service.amount)} - ${
                            service.paymentStatus === "paid"
                              ? "Pagado"
                              : service.autopay
                                ? "Débito automático"
                                : "Pendiente"
                          }`}
                        />
                      ))}
                      {dayServices.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{dayServices.length - 3}</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="hidden md:block space-y-1 overflow-hidden">
                  {dayServices.slice(0, 2).map((service) => {
                    const getTooltipText = () => {
                      if (service.paymentStatus === "paid") return "ver detalles"
                      if (service.autopay) return "ver detalles (débito automático)"
                      return "pagar"
                    }

                    const getBadgeInfo = () => {
                      if (service.paymentStatus === "paid") return { text: "Pagado", variant: "default" as const }
                      if (service.autopay) return { text: "Auto", variant: "secondary" as const }
                      return { text: "Pendiente", variant: "destructive" as const }
                    }

                    const badgeInfo = getBadgeInfo()

                    return (
                      <div
                        key={`desktop-${day}-${service.id}`}
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: service.color + "20", color: service.color }}
                        onClick={(e) => handleServiceClick(service, e)}
                        title={`${service.name} - ${mockApi.formatCurrency(service.amount)} - Click para ${getTooltipText()}`}
                      >
                        <div className="truncate font-medium">{service.name}</div>
                        <div className="truncate">{mockApi.formatCurrency(service.amount)}</div>
                        <Badge variant={badgeInfo.variant} className="text-xs h-4 px-1">
                          {badgeInfo.text}
                        </Badge>
                      </div>
                    )
                  })}

                  {dayServices.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">+{dayServices.length - 2} más</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
