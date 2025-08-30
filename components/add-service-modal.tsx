"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Sparkles, FileText, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface AddServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onServiceAdded: (service: any) => void
}

const serviceCategories = [
  "Entretenimiento",
  "Música",
  "Servicios Públicos",
  "Telefonía",
  "Internet",
  "Seguros",
  "Salud y Fitness",
  "Educación",
  "Software",
  "Otros",
]

const serviceColors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

export function AddServiceModal({ isOpen, onClose, onServiceAdded }: AddServiceModalProps) {
  const [loadingMethod, setLoadingMethod] = useState<"manual" | "ai" | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amount: "",
    description: "",
    website: "",
    color: serviceColors[0],
    paymentDay: "",
    frequency: "monthly",
    autoPayEnabled: false,
    serviceType: "entertainment" as "entertainment" | "government" | "non_recurring" | "other",
    isRecurring: true,
    lastBillAmount: "",
    // Account details
    email: "",
    username: "",
    clientNumber: "",
    contractNumber: "",
    billCode: "",
    providerCBU: "",
    recipientCBU: "",
  })
  const [nextPaymentDate, setNextPaymentDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleMethodSelect = (method: "manual" | "ai") => {
    setLoadingMethod(method)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getServiceTypeFromCategory = (category: string): "entertainment" | "government" | "non_recurring" | "other" => {
    if (["Entretenimiento", "Música", "Software"].includes(category)) return "entertainment"
    if (["Servicios Públicos"].includes(category)) return "government"
    if (["Salud y Fitness"].includes(category)) return "non_recurring"
    return "other"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nextPaymentDate) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const serviceType = getServiceTypeFromCategory(formData.category)

    const accountDetails: any = {}

    if (serviceType === "entertainment") {
      if (formData.email) accountDetails.email = formData.email
      if (formData.username) accountDetails.username = formData.username
    } else if (serviceType === "government") {
      if (formData.clientNumber) accountDetails.clientNumber = formData.clientNumber
      if (formData.contractNumber) accountDetails.contractNumber = formData.contractNumber
      if (formData.billCode) accountDetails.billCode = formData.billCode
      if (formData.providerCBU) accountDetails.providerCBU = formData.providerCBU
    } else if (serviceType === "non_recurring") {
      if (formData.recipientCBU) accountDetails.recipientCBU = formData.recipientCBU
    }

    const newService = {
      id: Date.now().toString(),
      userId: "user_1",
      name: formData.name,
      category: formData.category,
      amount: Math.round(Number.parseFloat(formData.amount) * 100), // Convert to cents
      currency: "ARS",
      description: formData.description,
      color: formData.color,
      nextPaymentDate: nextPaymentDate.toISOString(),
      paymentDate: nextPaymentDate.toISOString(),
      frequency: formData.frequency,
      status: "active",
      autoPayEnabled: formData.autoPayEnabled,
      createdAt: new Date().toISOString(),
      serviceType,
      isRecurring: formData.isRecurring,
      lastBillAmount: formData.lastBillAmount
        ? Math.round(Number.parseFloat(formData.lastBillAmount) * 100)
        : undefined,
      accountDetails: Object.keys(accountDetails).length > 0 ? accountDetails : undefined,
      icon: "service", // Default icon
    }

    onServiceAdded(newService)
    setIsSubmitting(false)
    onClose()

    // Reset form
    setFormData({
      name: "",
      category: "",
      amount: "",
      description: "",
      website: "",
      color: serviceColors[0],
      paymentDay: "",
      frequency: "monthly",
      autoPayEnabled: false,
      serviceType: "entertainment",
      isRecurring: true,
      lastBillAmount: "",
      email: "",
      username: "",
      clientNumber: "",
      contractNumber: "",
      billCode: "",
      providerCBU: "",
      recipientCBU: "",
    })
    setNextPaymentDate(undefined)
    setLoadingMethod(null)
  }

  const handleClose = () => {
    setLoadingMethod(null)
    onClose()
  }

  const renderServiceSpecificFields = () => {
    const serviceType = getServiceTypeFromCategory(formData.category)

    if (serviceType === "entertainment") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Datos de la Cuenta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email de la cuenta</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Usuario/Nombre de cuenta</Label>
              <Input
                id="username"
                placeholder="nombre_usuario"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>
          </div>
          {formData.autoPayEnabled && (
            <div className="space-y-2">
              <Label htmlFor="lastBillAmount">Monto de la última factura (ARS)</Label>
              <Input
                id="lastBillAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.lastBillAmount}
                onChange={(e) => handleInputChange("lastBillAmount", e.target.value)}
              />
            </div>
          )}
        </div>
      )
    }

    if (serviceType === "government") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Datos del Servicio Público</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientNumber">Número de cliente *</Label>
              <Input
                id="clientNumber"
                placeholder="123456789"
                value={formData.clientNumber}
                onChange={(e) => handleInputChange("clientNumber", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractNumber">Número de contrato</Label>
              <Input
                id="contractNumber"
                placeholder="CON-123456789"
                value={formData.contractNumber}
                onChange={(e) => handleInputChange("contractNumber", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billCode">Código de factura</Label>
              <Input
                id="billCode"
                placeholder="EDESUR-2024-001"
                value={formData.billCode}
                onChange={(e) => handleInputChange("billCode", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="providerCBU">CBU del proveedor</Label>
              <Input
                id="providerCBU"
                placeholder="0110599520000001234567"
                value={formData.providerCBU}
                onChange={(e) => handleInputChange("providerCBU", e.target.value)}
              />
            </div>
          </div>
          {formData.autoPayEnabled && (
            <div className="space-y-2">
              <Label htmlFor="lastBillAmount">Monto de la última factura (ARS)</Label>
              <Input
                id="lastBillAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.lastBillAmount}
                onChange={(e) => handleInputChange("lastBillAmount", e.target.value)}
              />
            </div>
          )}
        </div>
      )
    }

    if (serviceType === "non_recurring") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Datos de Transferencia</h3>
          <div className="space-y-2">
            <Label htmlFor="recipientCBU">CBU del destinatario *</Label>
            <Input
              id="recipientCBU"
              placeholder="0170999820000001234567"
              value={formData.recipientCBU}
              onChange={(e) => handleInputChange("recipientCBU", e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Se enviará una notificación cuando se acerque la fecha de pago para realizar la transferencia.
            </p>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Agregar Nuevo Servicio</DialogTitle>
          <DialogDescription>Agrega un nuevo servicio para gestionar sus pagos automáticamente</DialogDescription>
        </DialogHeader>

        {!loadingMethod ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Manual Loading Option */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary"
                onClick={() => handleMethodSelect("manual")}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Carga Manual</CardTitle>
                      <CardDescription>Ingresa los datos del servicio manualmente</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Completa un formulario con toda la información del servicio que deseas agregar.
                  </p>
                </CardContent>
              </Card>

              {/* AI Loading Option */}
              <Card className="cursor-not-allowed opacity-50 border-2 border-muted">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg text-muted-foreground">Carga con IA</CardTitle>
                      <CardDescription>Detecta automáticamente los datos del servicio</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    Próximamente
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sube una factura o ingresa la URL del servicio para detectar automáticamente los datos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Básica</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Servicio *</Label>
                  <Input
                    id="name"
                    placeholder="ej. Netflix, EDESUR, Gimnasio PowerFit"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción opcional del servicio"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://ejemplo.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información de Pago</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto (ARS) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frecuencia *</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => handleInputChange("frequency", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Próxima Fecha de Pago *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !nextPaymentDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {nextPaymentDate ? format(nextPaymentDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={nextPaymentDate} onSelect={setNextPaymentDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoPayEnabled"
                  checked={formData.autoPayEnabled}
                  onCheckedChange={(checked) => handleInputChange("autoPayEnabled", checked)}
                />
                <Label htmlFor="autoPayEnabled">Habilitar pago automático</Label>
              </div>
            </div>

            {formData.category && renderServiceSpecificFields()}

            {/* Visual Customization */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personalización</h3>

              <div className="space-y-2">
                <Label>Color del Servicio</Label>
                <div className="flex gap-2 flex-wrap">
                  {serviceColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        formData.color === color ? "border-foreground scale-110" : "border-muted",
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => handleInputChange("color", color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Agregando...
                  </>
                ) : (
                  "Agregar Servicio"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
