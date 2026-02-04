"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Settings,
    LogOut,
    Search,
    BarChart3,
    MessageSquare
} from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resumes", href: "/dashboard/resumes", icon: FileText },
    { name: "Applications", href: "/dashboard/applications", icon: Briefcase },
    { name: "Interviews", href: "/dashboard/interviews", icon: MessageSquare },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { logout, user } = useAuthStore()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Top Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
                <div className="flex items-center justify-between px-6 h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="h-8 w-8 bg-black dark:bg-white rounded flex items-center justify-center">
                                <span className="text-white dark:text-black font-bold text-sm">CA</span>
                            </div>
                            <span className="text-lg font-semibold text-foreground">CareerAI</span>
                        </Link>

                        <nav className="flex items-center gap-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link key={item.name} href={item.href}>
                                        <div
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                                                isActive
                                                    ? "bg-secondary text-secondary-foreground"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                        </div>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                            <Search className="h-4 w-4" />
                        </Button>

                        <ThemeToggle />

                        <div className="flex items-center gap-3 pl-3 border-l border-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-foreground">{user?.full_name || "User"}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                            <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-medium text-sm border border-border">
                                {user?.full_name?.charAt(0) || "U"}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-16">
                {children}
            </main>
        </div>
    )
}
