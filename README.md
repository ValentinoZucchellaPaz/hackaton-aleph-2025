<details>
<summary>🇦🇷 Leer en español 🇪🇸</summary>

# PayHub - Plataforma de Gestión Centralizada de Pagos

## 👥 Sobre Nosotros

Somos un equipo de estudiantes de Ingeniería en Computación de la Universidad Nacional de Córdoba - Facultad de Ciencias Exactas, Físicas y Naturales (UNC - FCEFyN). Nos apasiona aplicar la tecnología para resolver problemas cotidianos y crear herramientas que faciliten la vida de las personas.

Ve la demo de nuestro proyecto [aquí](https://hackaton-aleph-2025.vercel.app/)

## 💡 Lo Que Proponemos

Desarrollamos una plataforma web que te permite gestionar y analizar tus suscripciones y servicios. Con ella puedes:

- Ver y organizar fechas de pago
- Controlar los montos que pagas cada mes
- Comparar promociones y encontrar mejores opciones
- Vincular métodos de pago como MercadoPago, Lemon y otras billeteras digitales

## 🚩 Problema Que Abordamos

Muchos usuarios tienen gastos recurrentes en diferentes momentos del mes:
- Pagan suscripciones y servicios en fechas desorganizadas.
- Tienden a procrastinar el control de gastos.
- Aparecen cargos inesperados que generan frustración.

**Ejemplo:** Un usuario descubre un gasto inesperado de un servicio que ya no usa. Esto lo impulsa a buscar una solución.

## ✅ Nuestra Solución

Con nuestra plataforma, los usuarios pueden:
- Centralizar todas sus suscripciones y pagos en un solo lugar.
- Identificar servicios no utilizados y cancelarlos fácilmente.
- Ser más conscientes de sus finanzas personales, sin sorpresas innecesarias.

## 🔍 El Problema en Detalle

Hoy en día, la mayoría de nosotros usamos billeteras digitales como MercadoPago, Lemon, Naranja X o Brubank para pagar servicios como Netflix, Spotify, Internet, electricidad o agua. El problema es:

- Cada billetera solo muestra lo que pasa dentro de ella
- Si tenemos varias, la información permanece dispersa en diferentes apps, dentro de largos resúmenes de tarjeta.
- Lo más común: olvidamos fechas de vencimiento, pagamos con recargos, o no sabemos exactamente cuánto gastamos en suscripciones mes a mes (y a veces ni siquiera **qué** estamos pagando)

👉 **En resumen:** Los usuarios no tienen una vista unificada de sus servicios ni alertas claras que los ayuden a organizarse.

## 🛠️ La Solución: PayHub

Nuestra plataforma se conecta con las billeteras digitales de los usuarios y centraliza toda la información en un solo dashboard:

- Los usuarios inician sesión y ven todas sus suscripciones y servicios en un lugar
- Se generan alertas automáticas cuando un pago está por vencer
- Los reportes mensuales muestran el gasto total, desglose de servicios, e incluso detección de aumentos de precios
- Se sugieren descuentos o beneficios basados en la billetera usada para el pago

✅ De esta manera, los usuarios dejan de preocuparse por recordar fechas y pueden tomar mejores decisiones sobre sus finanzas personales.

## 💰 Modelo de Monetización

PayHub opera con un modelo freemium para asegurar accesibilidad mientras proporciona características avanzadas para usuarios avanzados:

### Nivel Gratuito
- Gestión y organización de servicios
- Calendario de pagos y recordatorios
- Adición manual de servicios
- Notificaciones básicas vía app (en el futuro también por mail y WhatsApp)

### Nivel Premium ($3 USD/mes)
- **Chatbot IA:** Obtén consejos financieros personalizados y asistencia
- **Notificaciones Inteligentes:** Alertas inteligentes basadas en patrones de gasto y comportamiento
- **Escaneo de Facturas:** Reconoce automáticamente servicios escaneando resúmenes de tarjetas de crédito
- **Análisis Inteligente de Descuentos:** Recomendaciones impulsadas por IA para mejores ofertas y promociones
- **Análisis Avanzado:** Información detallada de gastos y análisis predictivo

Este modelo de precios nos permite:
- Mantener la funcionalidad principal accesible para todos los usuarios
- Generar ingresos sostenibles para mantener y mejorar la plataforma
- Invertir en desarrollo de IA y características avanzadas
- Proporcionar valor excepcional a un precio accesible

## ⚙️ Cómo Funciona Técnicamente

1. Los usuarios se registran en nuestra app y conectan sus billeteras digitales
2. Los servicios se cargan manualmente o se sincronizan automáticamente desde emails y movimientos de pago de billeteras
3. Nuestra app organiza fechas de vencimiento, genera alertas y muestra reportes
4. Cuando los usuarios deciden pagar, los redirigimos a su billetera digital (no procesamos dinero directamente)

👉 **En resumen:** No reemplazamos las billeteras, las integramos y organizamos la experiencia del usuario.

## 🌎 Impacto

Con PayHub logramos:
- **Usuarios:** Evitan recargos, se organizan mejor y ahorran dinero
- **Billeteras digitales:** Retienen clientes con más actividad dentro de la app
- **Proveedores de servicios:** Reducen la morosidad y cobran más rápido

## ✨ Características Clave

- **Gestión Centralizada:** Los usuarios ven todas sus suscripciones y servicios en un lugar
- **Alertas Inteligentes:** Notificaciones para fechas de vencimiento y montos de pagos próximos
- **Análisis Automático:** Detecta suscripciones no utilizadas o promociones más convenientes
- **Integración de Métodos de Pago:** Se conecta con MercadoPago (solo uno para la demo), Lemon u otras billeteras para pagos sin complicaciones
- **Detección de Emails:** La app analiza emails y movimientos de tarjeta para reconocer automáticamente suscripciones
- **Características Premium de IA ($3/mes):**
  - Chatbot IA para asistencia financiera
  - Notificaciones inteligentes
  - Escaneo de facturas y reconocimiento de servicios
  - Análisis inteligente de descuentos

## 🚀 Comenzando

Es open source, por lo que puedes descargarlo y correrlo localmente, pero recomendamos que pruebes nuestra [demo](https://hackaton-aleph-2025.vercel.app/)

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

1. Clona el repositorio
```bash
git clone https://github.com/your-username/payhub.git
cd payhub
```

2. Instala las dependencias
```bash
npm install pnpm -- si no tienes pnpm
pnpm i
```

3. Inicia el servidor de desarrollo
```bash
pnpm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 🏗️ Stack Tecnológico
Esta demo del proyecto fue codificada usando el agente [v0 de Vercel](https://v0.app/), que tiene el siguiente stack:
- **Frontend:** Next.js 15, React, TypeScript
- **Estilos:** Tailwind CSS v4, shadcn/ui
- **Gráficos:** Recharts
- **Autenticación:** Integración OAuth con billeteras digitales
- **Datos:** Datos JSON mock (simulando base de datos)

## 📱 Características

### Características Principales
- Dashboard con vista general de servicios
- Vista de calendario y lista para pagos
- Gestión de servicios (agregar, editar, ver detalles)
- Simulación de procesamiento de pagos
- Sistema de notificaciones y alertas
- Análisis y reportes de gastos

### Características Premium
- Chatbot impulsado por IA
- Escaneo inteligente de facturas
- Recomendaciones inteligentes de descuentos
- Análisis avanzado

## 🎯 Conclusión

La idea de PayHub es devolverte el control de tus gastos automatizados. Centraliza todas tus suscripciones, detecta y detiene cargos no deseados, y te muestra de manera simple las fechas de pago, vencimientos, montos exactos y razón de cada gasto.

**El resultado:** Menos sorpresas, menos gastos innecesarios y más ahorro consciente.

## 👨‍💻 Equipo de Desarrollo

Estudiantes de Ingeniería en Computación - Universidad Nacional de Córdoba - Facultad de Ciencias Exactas, Físicas y Naturales (UNC-FCEFyN)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

</details>

<details open>
<summary>🇺🇸 Read in english 🇬🇧</summary>

# PayHub - Centralized Payment Management Platform

## 👥 About Us

We are a team of Computer Engineering students from the National University of Córdoba - Faculty of Physical and Natural Sciences (UNC - FCEFyN). We are passionate about applying technology to solve everyday problems and create tools that make people's lives easier.

See our project demo [here](https://hackaton-aleph-2025.vercel.app/)

## 💡 What We Propose

We developed a web platform that allows you to manage and analyze your subscriptions and services. With it, you can:

- View and organize payment dates
- Control the amounts you pay each month
- Compare promotions and find better options
- Link payment methods like MercadoPago, Lemon, and other digital wallets

## 🚩 Problem We Address

Many users have recurring expenses at different times of the month:
- They pay subscriptions and services on disorganized dates.
- They tend to procrastinate expense control.
- Unexpected charges appear that generate frustration.

**Example:** A user discovers an unexpected expense from a service they no longer use. This drives them to seek a solution.

## ✅ Our Solution

With our platform, users can:
- Centralize all their subscriptions and payments in one place.
- Identify unused services and cancel them easily.
- Become more aware of their personal finances, unnecessary surprises.

## 🔍 The Problem in Detail

Today, most of us use digital wallets like MercadoPago, Lemon, Naranja X, or Brubank to pay for services like Netflix, Spotify, Internet, electricity, or water. The problem is:

- Each wallet only shows what happens within it
- If we have several, information remains scattered across different apps, inside long card statements.
- Most commonly: we forget due dates, pay with surcharges, or don't know exactly how much we spend on subscriptions month to month (and sometimes not even **what** we are paying)

👉 **In short:** Users don't have a unified view of their services or clear alerts to help them organize.

## 🛠️ The Solution: PayHub

Our platform connects with users' digital wallets and centralizes all information in a single dashboard:

- Users log in and see all their subscriptions and services in one place
- Automatic alerts are generated when a payment is about to expire
- Monthly reports show total spending, service breakdown, and even price increase detection
- Discounts or benefits are suggested based on the wallet used for payment

✅ This way, users stop worrying about remembering dates and can make better decisions about their personal finances.

## 💰 Monetization Model

PayHub operates on a freemium model to ensure accessibility while providing advanced features for power users:

### Free Tier
- Service management and organization
- Payment calendar and reminders
- Manual service addition
- Basic notifications via app (in the future via mail and whatsapp too)

### Premium Tier ($3 USD/month)
- **AI Chatbot:** Get personalized financial advice and assistance
- **Intelligent Notifications:** Smart alerts based on spending patterns and behavior
- **Bill Scanning:** Automatically recognize services by scanning credit card statements
- **Smart Discount Analysis:** AI-powered recommendations for better deals and promotions
- **Advanced Analytics:** Detailed spending insights and predictive analysis

This pricing model allows us to:
- Keep the core functionality accessible to all users
- Generate sustainable revenue to maintain and improve the platform
- Invest in AI development and advanced features
- Provide exceptional value at an affordable price point

## ⚙️ How It Works Technically

1. Users register in our app and connect their digital wallets
2. Services are loaded manually or automatically synchronized from emails and wallet payment movements
3. Our app organizes due dates, generates alerts, and displays reports
4. When users decide to pay, we redirect them to their digital wallet (we don't process money directly)

👉 **In summary:** We don't replace wallets, we integrate them and organize the user experience.

## 🌎 Impact

With PayHub we achieve:
- **Users:** Avoid surcharges, organize better, and save money
- **Digital wallets:** Retain customers and with more activity within the app
- **Service providers:** Reduce delinquency and collect faster

## ✨ Key Features

- **Centralized Management:** Users see all their subscriptions and services in one place
- **Smart Alerts:** Notifications for due dates and upcoming payment amounts
- **Automatic Analysis:** Detects unused subscriptions or more convenient promotions
- **Payment Method Integration:** Connects with MercadoPago (only one for the demo), Lemon, or other wallets for hassle-free payments
- **Email Detection:** The app analyzes emails and card movements to automatically recognize subscriptions
- **Premium AI Features ($3/month):**
  - AI Chatbot for financial assistance
  - Intelligent notifications
  - Bill scanning and service recognition
  - Smart discount analysis

## 🚀 Getting Started

It's open source, so you can downloaded and run it locally, but we recomend you try out our [demo](https://hackaton-aleph-2025.vercel.app/)

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/payhub.git
cd payhub
```

2. Install dependencies
```bash
npm install pnpm -- if doesn't have pnpm
pnpm i
```

3. Start the development server
```bash
pnpm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Tech Stack
This project demo was coded using [Vercel's v0](https://v0.app/) agent, which has the folling stack:
- **Frontend:** Next.js 15, React, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Charts:** Recharts
- **Authentication:** OAuth integration with digital wallets
- **Data:** Mock JSON data (simulating database)

## 📱 Features

### Core Features
- Dashboard with service overview
- Calendar and list view for payments
- Service management (add, edit, view details)
- Payment processing simulation
- Notifications and alerts system
- Analytics and spending reports

### Premium Features
- AI-powered chatbot
- Intelligent bill scanning
- Smart discount recommendations
- Advanced analytics

## 🎯 Conclusion

PayHub's idea is to give you back control of your automated expenses. It centralizes all your subscriptions, detects and stops unintended charges, and shows you in a simple way the payment dates, due dates, exact amounts, and reason for each expense.

**The result:** Fewer surprises, fewer unnecessary expenses, and more conscious savings.

## 👨‍💻 Development Team

Computer Engineering Students - National University of Córdoba - Faculty of Physical and Natural Sciences (UNC-FCEFyN)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

</details>
