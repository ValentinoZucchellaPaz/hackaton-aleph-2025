"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, CreditCard, Smartphone, Building2, Loader2 } from "lucide-react"

const walletProviders = [
  {
    id: "mercadopago",
    name: "MercadoPago",
    description: "Conecta tu cuenta de MercadoPago",
    icon: CreditCard,
    color: "bg-blue-500",
    available: true,
  },
  {
    id: "naranjax",
    name: "Naranja X",
    description: "Próximamente disponible",
    icon: Smartphone,
    color: "bg-orange-500",
    available: false,
  },
  {
    id: "brubank",
    name: "Brubank",
    description: "Próximamente disponible",
    icon: Building2,
    color: "bg-purple-500",
    available: false,
  },
]

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (providerId: string) => {
    if (!walletProviders.find((p) => p.id === providerId)?.available) return

    setIsLoading(providerId)
    try {
      await login(providerId)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">PayHub</h1>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Conecta tu billetera</h2>
          <p className="text-muted-foreground">
            Inicia sesión con tu billetera virtual para gestionar todos tus servicios
          </p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          {walletProviders.map((provider) => {
            const Icon = provider.icon
            const isCurrentlyLoading = isLoading === provider.id

            return (
              <Card
                key={provider.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !provider.available ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-6 justify-start"
                    onClick={() => handleLogin(provider.id)}
                    disabled={!provider.available || isCurrentlyLoading}
                  >
                    <div className="flex items-center gap-4 w-full min-w-0">
                      <div className={`p-3 rounded-lg ${provider.color} text-white shrink-0`}>
                        {isCurrentlyLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{provider.description}</p>
                      </div>
                      {provider.available && !isCurrentlyLoading && <div className="text-primary shrink-0">→</div>}
                    </div>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-primary">¿Por qué conectar tu billetera?</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Gestiona todos tus servicios desde un lugar</li>
              <li>• Recibe alertas antes de cada vencimiento</li>
              <li>• Paga de forma segura y automática</li>
              <li>• Mantén un historial completo de pagos</li>
            </ul>
          </CardContent>
        </Card>

        {/* Security Note */}
        <p className="text-xs text-center text-muted-foreground">
          PayHub utiliza OAuth 2.0 para conectar de forma segura con tu billetera.
          <br />
          No almacenamos tus credenciales de acceso.
        </p>
      </div>
    </div>
  )
}
