import { mockApi, type Notification } from "./mock-data"

export class NotificationService {
  private static instance: NotificationService
  private notifications: Notification[] = []

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Generate payment reminder notifications
  generatePaymentReminders(userId: string): Notification[] {
    const userServices = mockApi.getUserServices(userId)
    const reminders: Notification[] = []

    userServices.forEach((service) => {
      const daysUntilPayment = mockApi.getDaysUntilPayment(service.nextPaymentDate)

      // Generate reminders for services due in 1, 3, or 7 days
      if ([1, 3, 7].includes(daysUntilPayment)) {
        const reminder: Notification = {
          id: `reminder_${service.id}_${daysUntilPayment}`,
          userId,
          type: "payment_reminder",
          title: `Pago próximo - ${service.name}`,
          message: `Tu suscripción de ${service.name} vence en ${daysUntilPayment} día${daysUntilPayment > 1 ? "s" : ""} (${mockApi.formatDate(service.nextPaymentDate)})`,
          serviceId: service.id,
          isRead: false,
          createdAt: new Date().toISOString(),
        }
        reminders.push(reminder)
      }
    })

    return reminders
  }

  // Generate discount notifications
  generateDiscountNotification(userId: string, serviceName: string, discount: number): Notification {
    return {
      id: `discount_${Date.now()}`,
      userId,
      type: "new_service",
      title: `¡Descuento disponible!`,
      message: `Aprovecha un ${discount}% de descuento en ${serviceName}. Oferta válida por tiempo limitado.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    }
  }

  // Generate new service notification
  generateNewServiceNotification(userId: string, serviceName: string): Notification {
    return {
      id: `new_service_${Date.now()}`,
      userId,
      type: "new_service",
      title: "Nuevo servicio agregado",
      message: `Has agregado exitosamente ${serviceName} a tu lista de servicios. El primer pago se procesará automáticamente.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    }
  }

  // Generate payment success notification
  generatePaymentSuccessNotification(userId: string, serviceName: string, amount: number): Notification {
    return {
      id: `payment_success_${Date.now()}`,
      userId,
      type: "payment_success",
      title: "Pago procesado exitosamente",
      message: `El pago de ${mockApi.formatCurrency(amount)} para ${serviceName} se ha procesado correctamente.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    }
  }

  // Generate payment failure notification
  generatePaymentFailureNotification(userId: string, serviceName: string, reason: string): Notification {
    return {
      id: `payment_failed_${Date.now()}`,
      userId,
      type: "payment_failed",
      title: `Error en el pago - ${serviceName}`,
      message: `No se pudo procesar el pago de ${serviceName}. ${reason}. Por favor, revisa tu método de pago.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    }
  }

  // Check and generate automatic notifications
  checkAndGenerateNotifications(userId: string): Notification[] {
    const newNotifications: Notification[] = []

    // Generate payment reminders
    const reminders = this.generatePaymentReminders(userId)
    newNotifications.push(...reminders)

    // Simulate random discount notifications (10% chance)
    if (Math.random() < 0.1) {
      const services = ["Spotify Premium", "Netflix", "Disney+", "Amazon Prime"]
      const randomService = services[Math.floor(Math.random() * services.length)]
      const discount = Math.floor(Math.random() * 30) + 10 // 10-40% discount

      const discountNotification = this.generateDiscountNotification(userId, randomService, discount)
      newNotifications.push(discountNotification)
    }

    return newNotifications
  }
}

export const notificationService = NotificationService.getInstance()
