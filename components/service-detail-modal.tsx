"use client"

import { useState } from "react"
import type { Service } from "@/lib/mock-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  CreditCard,
  Globe,
  Mail,
  User,
  FileText,
  Building,
  Banknote,
  Clock,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react"

interface ServiceDetailModalProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
  onPayNow?: (service: Service) => void
}

export function ServiceDetailModal({ service, isOpen, onClose, onPayNow }: ServiceDetailModalProps) {
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  if (!service) return null

  const maskSensitiveData = (data: string) => {
    if (showSensitiveData) return data
    return data.replace(/./g, "*").slice(0, -4) + data.slice(-4)
  }

  const getServiceTypeLabel = () => {
    switch (service.serviceType) {
      case "entertainment":
        return "Entretenimiento"
      case "government":
        return "Servicio Gubernamental"
      case "non_recurring":
        return "Pago No Recurrente"
      default:
        return "Servicio"
    }
  }

  const canPayService = () => {
    return service.paymentStatus === "pending" && !service.autopay
  }

  const renderServiceSpecificFields = () => {
    switch (service.serviceType) {
      case "entertainment":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email de cuenta</p>
                <p className="text-sm text-muted-foreground">{service.accountEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Usuario</p>
                <p className="text-sm text-muted-foreground">{service.accountUser}</p>
              </div>
            </div>
          </div>
        )

      case "government":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Número de cliente/contrato</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground font-mono">
                    {maskSensitiveData(service.clientNumber || "")}
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setShowSensitiveData(!showSensitiveData)}>
                    {showSensitiveData ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Código de factura</p>
                <p className="text-sm text-muted-foreground font-mono">{maskSensitiveData(service.billCode || "")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">CBU del proveedor</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {maskSensitiveData(service.providerCBU || "")}
                </p>
              </div>
            </div>
          </div>
        )

      case "non_recurring":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">CBU del destinatario</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground font-mono">
                    {maskSensitiveData(service.recipientCBU || "")}
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setShowSensitiveData(!showSensitiveData)}>
                    {showSensitiveData ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: service.color }}
            >
              {service.name.charAt(0)}
            </div>
            <div>
              <DialogTitle className="text-xl">{service.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{service.category}</Badge>
                <Badge variant="secondary">{getServiceTypeLabel()}</Badge>
                <Badge
                  variant={service.paymentStatus === "paid" ? "default" : service.autopay ? "secondary" : "destructive"}
                  className={service.paymentStatus === "paid" ? "bg-secondary" : ""}
                >
                  {service.paymentStatus === "paid" ? "Pagado" : service.autopay ? "Auto" : "Pendiente"}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Monto</p>
                    <p className="text-lg font-bold text-primary">${service.amount.toLocaleString("es-AR")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Frecuencia</p>
                    <p className="text-sm text-muted-foreground capitalize">{service.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Próximo pago</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(service.nextPaymentDate).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>
                {service.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Sitio web</p>
                      <a
                        href={service.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {service.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              {service.description && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Descripción</p>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Autopay Information */}
          {service.autopay && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Autopago
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Estado del autopago</p>
                    <p className="text-sm text-muted-foreground">Habilitado</p>
                  </div>
                  <Badge className="bg-secondary">Activo</Badge>
                </div>
                {service.lastBillAmount && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Última factura pagada</p>
                    <p className="text-lg font-bold text-secondary">
                      ${service.lastBillAmount.toLocaleString("es-AR")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Service-specific Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Datos del Servicio</h3>
              {renderServiceSpecificFields()}
            </CardContent>
          </Card>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {canPayService() && onPayNow && <Button onClick={() => onPayNow(service)}>Pagar Ahora</Button>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
