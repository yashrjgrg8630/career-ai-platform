"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"

export default function TestPage() {
    const [result, setResult] = useState<string>("")
    const [loading, setLoading] = useState(false)

    const testConnection = async () => {
        setLoading(true)
        setResult("Testing...")

        try {
            const response = await fetch("http://127.0.0.1:8000/health")
            const data = await response.json()
            setResult(`✓ Backend reachable: ${JSON.stringify(data)}`)
        } catch (error: any) {
            setResult(`✗ Backend error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const testAPI = async () => {
        setLoading(true)
        setResult("Testing API client...")

        try {
            const response = await api.get("/")
            setResult(`✓ API client works: ${JSON.stringify(response.data)}`)
        } catch (error: any) {
            setResult(`✗ API client error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Connection Test</h1>

                <div className="space-y-4">
                    <Button onClick={testConnection} disabled={loading}>
                        Test Backend Connection
                    </Button>

                    <Button onClick={testAPI} disabled={loading}>
                        Test API Client
                    </Button>

                    {result && (
                        <div className="p-4 bg-white border rounded-lg">
                            <pre className="text-sm">{result}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
