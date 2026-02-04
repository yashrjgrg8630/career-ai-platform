"use client"

import React, { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import api from "@/lib/api"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className="text-3xl font-bold text-center">Sign In</h2>
                </div>
                <React.Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </React.Suspense>
            </div>
        </div>
    )
}

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { isAuthenticated, login } = useAuthStore()
    const error = searchParams.get("error")

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard")
        }
    }, [isAuthenticated, router])

    useEffect(() => {
        if (error === "session_expired") {
            alert("Your session has expired. Please login again.")
        }
    }, [error])

    return (
        <>
            {error === "session_expired" && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    Your session has expired. Please login again.
                </div>
            )}
            <form className="mt-8 space-y-6" onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const email = formData.get("email") as string
                const password = formData.get("password") as string

                try {
                    // Use the centralized api instance for consistent base URL/headers
                    const response = await api.post("/login/access-token",
                        new URLSearchParams({ username: email, password }),
                        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
                    )

                    const data = response.data

                    // Fetch user data
                    const userResponse = await api.get("/users/me", {
                        headers: { "Authorization": `Bearer ${data.access_token}` }
                    })

                    const userData = userResponse.data

                    // Store in Zustand
                    login(data.access_token, userData)

                    console.log("✓ Login successful, redirecting to dashboard...")
                    router.push("/dashboard")
                } catch (error: any) {
                    console.error("Login error:", error)
                    const errorMessage = error.response?.data?.detail || "Login failed. Please try again."
                    alert(errorMessage)
                }
            }}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Sign In
                </button>

                <div className="text-center">
                    <a href="/register" className="text-sm text-blue-600 hover:text-blue-500">
                        Don't have an account? Register
                    </a>
                </div>
            </form>
        </>
    )
}
