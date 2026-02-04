"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import api from "@/lib/api"

export default function TestAuthPage() {
    const router = useRouter()
    const { token, user, isAuthenticated, logout } = useAuthStore()

    useEffect(() => {
        console.log("Auth State:", {
            isAuthenticated,
            hasToken: !!token,
            tokenLength: token?.length,
            user,
        })
    }, [isAuthenticated, token, user])

    const testToken = async () => {
        if (!token) {
            alert("No token found! Please login first.")
            return
        }

        console.log("Testing token:", token.substring(0, 50) + "...")

        try {
            const response = await api.get("/users/me")
            console.log("✓ Token is valid:", response.data)
            alert(`✓ Token valid! User: ${response.data.email}`)
        } catch (error: any) {
            console.error("✗ Token invalid:", error)
            alert(`✗ Token invalid: ${error.response?.data?.detail || error.message}`)

            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("Token expired or invalid. Logging out...")
                logout()
                router.push("/login")
            }
        }
    }

    const refreshPage = () => {
        window.location.reload()
    }

    const clearAuth = () => {
        logout()
        alert("Cleared auth. Please login again.")
        router.push("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Authentication Test</h1>

                <div className="bg-white p-6 rounded-lg border space-y-4">
                    <h2 className="font-semibold">Current Auth State:</h2>
                    <div className="space-y-2 text-sm font-mono">
                        <div>Authenticated: {isAuthenticated ? "✓ Yes" : "✗ No"}</div>
                        <div>Has Token: {token ? "✓ Yes" : "✗ No"}</div>
                        <div>Token Length: {token?.length || 0}</div>
                        <div>User: {user?.email || "None"}</div>
                        {token && (
                            <div className="break-all">
                                Token Preview: {token.substring(0, 100)}...
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={testToken}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Test Token Validity
                    </button>

                    <button
                        onClick={refreshPage}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Refresh Page
                    </button>

                    <button
                        onClick={clearAuth}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Clear Auth & Re-login
                    </button>

                    <button
                        onClick={() => router.push("/dashboard/resumes")}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Go to Resumes Page
                    </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                    <h3 className="font-semibold mb-2">Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Click "Test Token Validity" to check if your token works</li>
                        <li>If token is invalid, click "Clear Auth & Re-login"</li>
                        <li>Login again at /login</li>
                        <li>Come back here and test again</li>
                        <li>Once token is valid, try uploading a resume</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
