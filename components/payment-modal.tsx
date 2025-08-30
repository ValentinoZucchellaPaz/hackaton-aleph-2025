"use client"

import { useState } from "react"
import type { Service } from "@/lib/mock-data"
import { mockApi } from "@/lib/mock-data"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

interface PaymentModalProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
  onPaymentComplete: (success: boolean) => void
}

export function PaymentModal({ service, isOpen, onClose, onPaymentComplete }: PaymentModalProps) {
  const [paymentStep, setPaymentStep] = useState<"confirm" | "processing" | "success" | "error">("confirm")
  const [paymentMethod] = useState("mercadopago")

  if (!service) return null

  const isAutoPayEnabled = service.autopay
  const isAlreadyPaid = service.paymentStatus === "paid"

  const handlePayment = async () => {
    if (isAutoPayEnabled || isAlreadyPaid) {
      return
    }

    setPaymentStep("processing")

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate 90% success rate
    const success = Math.random() > 0.1

    if (success) {
      setPaymentStep("success")
      setTimeout(() => {
        onPaymentComplete(true)
        onClose()
        setPaymentStep("confirm")
      }, 2000)
    } else {
      setPaymentStep("error")
    }
  }

  const handleRetry = () => {
    setPaymentStep("confirm")
  }

  const handleCancel = () => {
    onClose()
    setPaymentStep("confirm")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Procesar Pago
          </DialogTitle>
          <DialogDescription>Confirma los detalles del pago para continuar</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {isAlreadyPaid && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Servicio Ya Pagado</span>
                </div>
                <p className="text-sm text-green-700 mt-1">Este servicio ya ha sido pagado para el período actual.</p>
              </CardContent>
            </Card>
          )}

          {isAutoPayEnabled && !isAlreadyPaid && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Débito Automático Activo</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  Este servicio tiene débito automático habilitado. El pago se procesará automáticamente en la fecha de
                  vencimiento.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: service.color }}
                >
                  {service.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monto:</span>
                  <span className="font-semibold">{mockApi.formatCurrency(service.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Período:</span>
                  <span className="text-sm">Mensual</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Próximo vencimiento:</span>
                  <span className="text-sm">{mockApi.formatDate(service.nextPaymentDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <h4 className="font-medium mb-3">Método de Pago</h4>
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-primary/5 border-primary/20">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  MP
                </div>
                <div>
                  <p className="font-medium">MercadoPago</p>
                  <p className="text-sm text-muted-foreground">Billetera conectada</p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  Conectado
                </Badge>
              </div>
            </CardContent>
          </Card>

          {paymentStep === "confirm" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Pago seguro procesado por MercadoPago</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button onClick={handlePayment} className="flex-1" disabled={isAutoPayEnabled || isAlreadyPaid}>
                  {isAlreadyPaid
                    ? "Ya Pagado"
                    : isAutoPayEnabled
                      ? "Débito Automático Activo"
                      : `Pagar ${mockApi.formatCurrency(service.amount)}`}
                </Button>
              </div>
            </div>
          )}

          {paymentStep === "processing" && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Procesando pago...</h3>
              <p className="text-sm text-muted-foreground">
                Estamos procesando tu pago con MercadoPago. Por favor espera.
              </p>
            </div>
          )}

          {paymentStep === "success" && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">¡Pago exitoso!</h3>
              <p className="text-sm text-muted-foreground">
                Tu pago de {mockApi.formatCurrency(service.amount)} ha sido procesado correctamente.
              </p>
            </div>
          )}

          {paymentStep === "error" && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Error en el pago</h3>
                <p className="text-sm text-muted-foreground">
                  No se pudo procesar el pago. Por favor, verifica tu método de pago e intenta nuevamente.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button onClick={handleRetry} className="flex-1">
                  Reintentar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
