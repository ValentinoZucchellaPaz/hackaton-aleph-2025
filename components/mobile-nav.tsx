"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, DollarSign, History, Settings, LogOut, Bell, CreditCard } from "lucide-react"
import Link from "next/link"
import { NotificationCenter } from "@/components/notification-center"

interface MobileNavProps {
  userBalance: number
  onAddFunds: () => void
  onLogout: () => void
  unreadCount?: number
}

export function MobileNav({ userBalance, onAddFunds, onLogout, unreadCount = 0 }: MobileNavProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Balance - Always visible */}
      

      {/* Notifications - Always visible */}
      <NotificationCenter />

      {/* Mobile Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/services" className="cursor-pointer">
              <CreditCard className="h-4 w-4 mr-2" />
              Mis Servicios
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/payments" className="cursor-pointer">
              <History className="h-4 w-4 mr-2" />
              Historial de Pagos
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notifications" className="cursor-pointer">
              <Bell className="h-4 w-4 mr-2" />
              Notificaciones
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
