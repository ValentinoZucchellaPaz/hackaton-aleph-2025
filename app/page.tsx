import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  CreditCard,
  Bell,
  BarChart3,
  LogIn,
  Bot,
  Brain,
  ScanLine,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">PayHub</h1>
            </div>
            <Link href="/login">
              <Button className="gap-2 cursor-pointer">
                <LogIn className="h-4 w-4" />
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto text-center">
          <Badge variant="default" className="mb-6 bg-primary text-primary-foreground">
            ✨ La solución definitiva para tus pagos
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Organiza tus Suscripciones.
            <br />
            <span className="text-primary">Ahorra Dinero.</span>
            <br />
            Evita Recargos.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Centraliza todos tus servicios y suscripciones en un solo lugar. Nunca más te olvides de un pago o pierdas
            dinero en suscripciones fantasma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="gap-2 cursor-pointer">
                Comenzar Gratis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2 cursor-pointer bg-transparent">
              Ver Demo
              <BarChart3 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿Te suena familiar?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Millones de personas enfrentan estos problemas todos los días
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Servicios Desparramados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tienes suscripciones en diferentes plataformas y no sabes cuánto gastas realmente cada mes.
                </p>
              </CardContent>
            </Card>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Suscripciones Fantasma</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pagas por servicios que ya no usas o que ni siquiera recordabas que tenías activos.
                </p>
              </CardContent>
            </Card>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Recargos y Multas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Te olvidas de pagar a tiempo y terminas pagando intereses y recargos innecesarios.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nuestra Solución</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Centralizamos el pago de servicios, brindando una experiencia de usuario amigable para una mejor gestión
              de tus billeteras virtuales
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Centralización Total</h3>
                    <p className="text-muted-foreground">
                      Conecta todas tus billeteras virtuales y gestiona todos tus servicios desde un solo dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Bell className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Alertas Inteligentes</h3>
                    <p className="text-muted-foreground">
                      Recibe notificaciones antes de cada vencimiento y descubre descuentos exclusivos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Control Total</h3>
                    <p className="text-muted-foreground">
                      Visualiza tus gastos, identifica suscripciones innecesarias y optimiza tu presupuesto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        N
                      </div>
                      <div>
                        <p className="font-medium">Netflix</p>
                        <p className="text-sm text-muted-foreground">Próximo pago: 15 Ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">$2.990</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        S
                      </div>
                      <div>
                        <p className="font-medium">Spotify</p>
                        <p className="text-sm text-muted-foreground">Próximo pago: 20 Ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">$1.590</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        G
                      </div>
                      <div>
                        <p className="font-medium">Gimnasio</p>
                        <p className="text-sm text-muted-foreground">Próximo pago: 25 Ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">$8.500</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Garantizamos que...</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-primary">Usuarios Finales</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Eviten recargos y multas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Se organicen mejor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Ahorren dinero real</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-secondary/5">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-secondary">Billeteras Virtuales</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Fidelicen a sus clientes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Más actividad en la app</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Mayor retención</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-accent">Proveedores de Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Reduzcan la morosidad</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Cobren más rápido</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Mejor flujo de caja</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent/10 via-background to-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4 bg-accent text-accent-foreground">
              <Sparkles className="h-4 w-4 mr-2" />
              Premium Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Potencia tu experiencia con <span className="text-accent">Inteligencia Artificial</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Por solo <span className="font-bold text-accent">$3 USD al mes</span>, desbloquea funcionalidades
              avanzadas que revolucionarán la forma en que gestionas tus pagos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-accent">Chatbot IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Asistente virtual 24/7 que responde preguntas sobre tus servicios, pagos y te ayuda a optimizar tus
                  gastos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">Avisos Inteligentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Notificaciones predictivas que aprenden de tus hábitos y te alertan sobre patrones de gasto inusuales.
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ScanLine className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-secondary">Escaneo de Facturas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Reconocimiento automático de servicios escaneando tus facturas de tarjeta de crédito y débito.
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-accent">Análisis de Descuentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  IA que analiza y encuentra descuentos especiales personalizados para tus servicios favoritos.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 p-6 bg-card rounded-2xl border shadow-sm">
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">$3 USD/mes</p>
                <p className="text-sm text-muted-foreground">Facturado mensualmente</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Prueba gratuita de 7 días</p>
                <p className="text-sm text-muted-foreground">Cancela cuando quieras</p>
              </div>
              <Link href="/login">
                <Button className="gap-2 cursor-pointer">
                  Probar Premium
                  <Sparkles className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            ¿Listo para tomar el control de tus pagos?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya organizaron sus finanzas y ahorran dinero cada mes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="gap-2 cursor-pointer">
                Comenzar Ahora
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">PayHub</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-muted-foreground hover:text-foreground cursor-pointer">
                Iniciar Sesión
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground cursor-pointer">
                Soporte
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground cursor-pointer">
                Privacidad
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2025 PayHub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
