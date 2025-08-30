"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockApi, type Service } from "@/lib/mock-data"
import { processPayment } from "@/lib/payment-service"
import { CreditCard, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface PayAllModalProps {
  services: Service[]
  isOpen: boolean
  onClose: () => void
  onPaymentComplete: (success: boolean) => void
  userBalance: number
}

export function PayAllModal({ services, isOpen, onClose, onPaymentComplete, userBalance }: PayAllModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResults, setPaymentResults] = useState<{ service: Service; success: boolean }[]>([])
  const [showResults, setShowResults] = useState(false)

  // Filter services that can be paid (pending and not autopay)
  const payableServices = services.filter((service) => service.paymentStatus === "pending" && !service.autopay)

  const totalAmount = payableServices.reduce((sum, service) => sum + service.amount, 0)
  const hasInsufficientFunds = userBalance < totalAmount

  const handlePayAll = async () => {
    setIsProcessing(true)
    const results: { service: Service; success: boolean }[] = []

    for (const service of payableServices) {
      try {
        const result = await processPayment(service.id, service.amount, "mercadopago")
        results.push({ service, success: result.success })
      } catch (error) {
        results.push({ service, success: false })
      }
    }

    setPaymentResults(results)
    setShowResults(true)
    setIsProcessing(false)

    const allSuccessful = results.every((result) => result.success)
    onPaymentComplete(allSuccessful)
  }

  const handleClose = () => {
    setShowResults(false)
    setPaymentResults([])
    onClose()
  }

  if (payableServices.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>No hay servicios para pagar</DialogTitle>
            <DialogDescription>Todos tus servicios están al día o tienen débito automático activado.</DialogDescription>
          </DialogHeader>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {showResults ? "Resultados del Pago" : "Pagar Todos los Servicios"}
          </DialogTitle>
          <DialogDescription>
            {showResults
              ? "Resumen de los pagos procesados"
              : `Vas a pagar ${payableServices.length} servicio${payableServices.length > 1 ? "s" : ""} pendiente${payableServices.length > 1 ? "s" : ""}`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {showResults ? (
            <div className="space-y-4">
              {paymentResults.map(({ service, success }) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: service.color }}
                    >
                      {service.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{mockApi.formatCurrency(service.amount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <Badge
                      variant={success ? "default" : "destructive"}
                      className={success ? "bg-green-100 text-green-800" : ""}
                    >
                      {success ? "Pagado" : "Error"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {hasInsufficientFunds && (
                <Alert className="border-destructive bg-destructive/5">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    <span className="font-medium">Fondos insuficientes</span>
                    <p className="text-sm mt-1">
                      Tu balance actual (${userBalance.toLocaleString("es-AR")}) no es suficiente para cubrir el total
                      ($
                      {totalAmount.toLocaleString("es-AR")}).
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">Servicios a pagar:</h4>
                {payableServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
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
                      <p className="font-semibold">{mockApi.formatCurrency(service.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        Vence: {mockApi.formatDate(service.nextPaymentDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total a pagar:</span>
                <span className="text-primary">{mockApi.formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}
        </div>

        {!showResults && (
          <div className="flex gap-3 pt-4 flex-shrink-0 border-t">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handlePayAll} disabled={isProcessing || hasInsufficientFunds} className="flex-1">
              {isProcessing ? "Procesando..." : "Pagar Todo"}
            </Button>
          </div>
        )}

        {showResults && (
          <div className="flex justify-end pt-4 flex-shrink-0 border-t">
            <Button onClick={handleClose}>Cerrar</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
