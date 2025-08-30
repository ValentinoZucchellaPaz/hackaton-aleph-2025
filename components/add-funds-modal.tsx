"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreditCard, DollarSign, Loader2 } from "lucide-react"

interface AddFundsModalProps {
  isOpen: boolean
  onClose: () => void
  currentBalance: number
  onFundsAdded: (amount: number) => void
}

export function AddFundsModal({ isOpen, onClose, currentBalance, onFundsAdded }: AddFundsModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddFunds = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) return

    setIsLoading(true)

    // Simular proceso de carga de fondos
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const fundsAmount = Number.parseFloat(amount)
    onFundsAdded(fundsAmount)
    setAmount("")
    setIsLoading(false)
    onClose()
  }

  const quickAmounts = [5000, 10000, 20000, 50000]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Ingresar Fondos
          </DialogTitle>
          <DialogDescription>Agrega dinero a tu cuenta de MercadoPago para realizar pagos</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Balance actual:</span>
              <span className="font-medium">${currentBalance.toLocaleString("es-AR")}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto a ingresar</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Montos rápidos</Label>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="text-sm"
                >
                  ${quickAmount.toLocaleString("es-AR")}
                </Button>
              ))}
            </div>
          </div>

          {amount && Number.parseFloat(amount) > 0 && (
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Nuevo balance:</span>
                <span className="font-medium text-primary">
                  ${(currentBalance + Number.parseFloat(amount)).toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleAddFunds} disabled={!amount || Number.parseFloat(amount) <= 0 || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Ingresar Fondos"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
