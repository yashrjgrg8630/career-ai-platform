"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [fullName, setFullName] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await api.post("/users/", {
                email,
                password,
                full_name: fullName,
            })

            router.push("/login")
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.detail || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full border-gray-200 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-gray-900">
                    Create an account
                </CardTitle>
                <CardDescription className="text-gray-600">
                    Enter your information to get started
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-md hover:bg-red-100 transition-colors">
                            {error}
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="border-gray-200 hover:border-gray-300 focus:border-gray-400 transition-all"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border-gray-200 hover:border-gray-300 focus:border-gray-400 transition-all"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border-gray-200 hover:border-gray-300 focus:border-gray-400 transition-all"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all hover:shadow-md"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                    <p className="text-xs text-center text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-all">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
