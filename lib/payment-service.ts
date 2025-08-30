import { mockApi, type Service, type Payment } from "./mock-data"
import { notificationService } from "./notification-service"

export interface PaymentResult {
  success: boolean
  paymentId?: string
  transactionId?: string
  error?: string
}

export class PaymentService {
  private static instance: PaymentService

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  // Process payment for a service
  async processPayment(userId: string, service: Service): Promise<PaymentResult> {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const success = Math.random() > 0

      if (success) {
        // Create payment record
        const payment: Payment = {
          id: `payment_${Date.now()}`,
          serviceId: service.id,
          userId,
          amount: service.amount,
          currency: service.currency,
          status: "completed",
          paymentDate: new Date().toISOString(),
          mercadoPagoTransactionId: `mp_tx_${Date.now()}`,
          description: `Pago ${service.name} - ${new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" })}`,
        }

        mockApi.updateServicePaymentStatus(service.id, "paid")
        mockApi.addPayment(payment)

        // Generate success notification
        const notification = notificationService.generatePaymentSuccessNotification(
          userId,
          service.name,
          service.amount,
        )

        // Update service next payment date (simulate)
        const nextMonth = new Date()
        nextMonth.setMonth(nextMonth.getMonth() + 1)

        return {
          success: true,
          paymentId: payment.id,
          transactionId: payment.mercadoPagoTransactionId,
        }
      } else {
        // Generate failure notification
        const notification = notificationService.generatePaymentFailureNotification(
          userId,
          service.name,
          "Fondos insuficientes en la cuenta",
        )

        return {
          success: false,
          error: "No se pudo procesar el pago. Verifica tu método de pago.",
        }
      }
    } catch (error) {
      return {
        success: false,
        error: "Error interno del servidor. Intenta nuevamente.",
      }
    }
  }

  // Setup automatic payment for a service
  async setupAutoPay(userId: string, serviceId: string, enabled: boolean): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real implementation, this would update the service configuration
      console.log(`Auto-pay ${enabled ? "enabled" : "disabled"} for service ${serviceId}`)

      return true
    } catch (error) {
      return false
    }
  }

  // Get payment methods for user
  async getPaymentMethods(userId: string) {
    // Simulate getting connected payment methods
    return [
      {
        id: "mp_wallet",
        type: "mercadopago",
        name: "MercadoPago",
        description: "Billetera virtual",
        isDefault: true,
        isConnected: true,
      },
    ]
  }

  // Validate payment before processing
  validatePayment(service: Service, userId: string): { valid: boolean; error?: string } {
    if (!service) {
      return { valid: false, error: "Servicio no encontrado" }
    }

    if (service.amount <= 0) {
      return { valid: false, error: "Monto inválido" }
    }

    if (!userId) {
      return { valid: false, error: "Usuario no autenticado" }
    }

    // Check if user has MercadoPago connected
    const user = mockApi.getUser(userId)
    if (!user?.mercadoPagoConnected) {
      return { valid: false, error: "MercadoPago no conectado" }
    }

    return { valid: true }
  }

  // Calculate fees (if any)
  calculateFees(amount: number): { fees: number; total: number } {
    // For this demo, no fees are applied
    return {
      fees: 0,
      total: amount,
    }
  }
}

export async function processPayment(serviceId: string, amount: number, paymentMethod: string): Promise<PaymentResult> {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const success = Math.random() > 0

    if (success) {
      // Update service payment status
      mockApi.updateServicePaymentStatus(serviceId, "paid")

      // Create payment record
      const payment: Payment = {
        id: `payment_${Date.now()}`,
        serviceId,
        userId: "user_1", // In real app, this would come from auth context
        amount,
        currency: "ARS",
        status: "completed",
        paymentDate: new Date().toISOString(),
        mercadoPagoTransactionId: `mp_tx_${Date.now()}`,
        description: `Pago servicio - ${new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" })}`,
      }

      mockApi.addPayment(payment)

      return {
        success: true,
        paymentId: payment.id,
        transactionId: payment.mercadoPagoTransactionId,
      }
    } else {
      return {
        success: false,
        error: "No se pudo procesar el pago. Verifica tu método de pago.",
      }
    }
  } catch (error) {
    return {
      success: false,
      error: "Error interno del servidor. Intenta nuevamente.",
    }
  }
}

export const paymentService = PaymentService.getInstance()
