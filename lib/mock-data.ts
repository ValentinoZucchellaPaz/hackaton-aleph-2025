import mockData from "../data/mock-data.json"

export interface User {
  id: string
  email: string
  name: string
  mercadoPagoConnected: boolean
  mercadoPagoAccount?: {
    userId: string
    accessToken: string
    refreshToken: string
    accountType: string
    balance: number
  }
  createdAt: string
}

export interface Service {
  id: string
  userId: string
  name: string
  category: string
  amount: number
  currency: string
  paymentDate: string
  nextPaymentDate: string
  status: "active" | "pending" | "cancelled"
  paymentStatus?: "paid" | "pending" | "overdue"
  autopay: boolean // Updated field name to match mock data
  description: string
  icon: string
  color: string
  createdAt: string
  serviceType: "entertainment" | "government" | "non_recurring" | "other"
  lastBillAmount?: number // Para servicios de autopago
  accountDetails?: {
    // Para servicios de entretenimiento
    email?: string
    username?: string
    // Para servicios gubernamentales
    clientNumber?: string
    contractNumber?: string
    billCode?: string
    providerCBU?: string
    // Para pagos no recurrentes
    recipientCBU?: string
  }
  frequency?: "monthly" | "quarterly" | "yearly" | "custom"
  isRecurring: boolean
}

export interface Payment {
  id: string
  serviceId: string
  userId: string
  amount: number
  currency: string
  status: "completed" | "pending" | "failed"
  paymentDate: string
  mercadoPagoTransactionId?: string
  description: string
}

export interface Notification {
  id: string
  userId: string
  type: "payment_reminder" | "payment_failed" | "payment_success" | "new_service"
  title: string
  message: string
  serviceId?: string
  isRead: boolean
  createdAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface MonthlyExpense {
  month: string
  monthName: string
  totalAmount: number
  categories: Record<string, number>
}

export interface Discount {
  id: string
  title: string
  description: string
  serviceCategory: string
  relatedServiceId?: string
  discountPercentage: number
  originalPrice: number
  discountedPrice: number
  validUntil: string
  redirectUrl: string
  provider: string
  badge: string
  color: string
  isActive: boolean
}

// Mock API functions
export const mockApi = {
  // Users
  getUser: (userId: string): User | undefined => {
    return mockData.users.find((user) => user.id === userId)
  },

  // Services
  getUserServices: (userId: string): Service[] => {
    return mockData.services.filter((service) => service.userId === userId)
  },

  getService: (serviceId: string): Service | undefined => {
    return mockData.services.find((service) => service.id === serviceId)
  },

  // Payments
  getUserPayments: (userId: string): Payment[] => {
    return mockData.payments.filter((payment) => payment.userId === userId)
  },

  getServicePayments: (serviceId: string): Payment[] => {
    return mockData.payments.filter((payment) => payment.serviceId === serviceId)
  },

  // Notifications
  getUserNotifications: (userId: string): Notification[] => {
    return mockData.notifications.filter((notification) => notification.userId === userId)
  },

  getUnreadNotifications: (userId: string): Notification[] => {
    return mockData.notifications.filter((notification) => notification.userId === userId && !notification.isRead)
  },

  // Categories
  getCategories: (): Category[] => {
    return mockData.categories
  },

  getAvailableDiscounts: (userId: string): Discount[] => {
    const userServices = mockApi.getUserServices(userId)
    const userCategories = userServices.map((service) => service.category)

    return ((mockData as any).discounts || []).filter(
      (discount: Discount) => discount.isActive && userCategories.includes(discount.serviceCategory),
    )
  },

  // Utility functions
  formatCurrency: (amount: number, currency = "ARS"): string => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency,
    }).format(amount)
  },

  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  },

  getDaysUntilPayment: (nextPaymentDate: string): number => {
    const today = new Date()
    const paymentDate = new Date(nextPaymentDate)
    const diffTime = paymentDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  updateServicePaymentStatus: (serviceId: string, status: "paid" | "pending" | "overdue"): boolean => {
    const serviceIndex = mockData.services.findIndex((service) => service.id === serviceId)
    if (serviceIndex !== -1) {
      ;(mockData.services[serviceIndex] as any).paymentStatus = status
      return true
    }
    return false
  },

  addPayment: (payment: Payment): void => {
    ;(mockData.payments as any).push(payment)
  },

  getMonthlyExpenses: (): MonthlyExpense[] => {
    return (mockData as any).monthlyExpenses || []
  },
}
