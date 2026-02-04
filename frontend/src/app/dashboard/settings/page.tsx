"use client"

import { useAuthStore } from "@/store/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"

export default function SettingsPage() {
    const { user, logout } = useAuthStore()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-foreground mb-1">Settings</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Profile Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your account's profile information and email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
                                    {user.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">{user.full_name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue={user.full_name} disabled />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" defaultValue={user.email} disabled />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Actions</CardTitle>
                            <CardDescription>
                                Manage your session and account security.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
