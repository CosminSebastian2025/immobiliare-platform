'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard, Users, Home, CreditCard, FileText, Settings,
    Bell, BarChart3, Shield, LogOut, ChevronLeft
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Utenti', icon: Users },
    { href: '/admin/listings', label: 'Annunci', icon: Home },
    { href: '/admin/moderation', label: 'Moderazione', icon: Shield, badge: true },
    { href: '/admin/subscriptions', label: 'Abbonamenti', icon: CreditCard },
    { href: '/admin/plans', label: 'Piani', icon: FileText },
    { href: '/admin/payments', label: 'Pagamenti', icon: BarChart3 },
    { href: '/admin/notifications', label: 'Notifiche', icon: Bell },
    { href: '/admin/settings', label: 'Impostazioni', icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-white border-r flex flex-col">
            {/* Logo */}
            <div className="h-16 border-b flex items-center justify-between px-4">
                <Link href="/admin" className="font-bold text-lg">
                    Admin Panel
                </Link>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-4 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 mx-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                                <span className="w-2 h-2 bg-red-500 rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="border-t p-4 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Torna al sito
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 w-full"
                >
                    <LogOut className="h-4 w-4" />
                    Esci
                </button>
            </div>
        </aside>
    )
}