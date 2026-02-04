"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api"
import { useAuthStore } from "@/store/auth"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function AnalyticsPage() {
    const { isAuthenticated } = useAuthStore()
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated) return
        fetchJobs()
    }, [isAuthenticated])

    const fetchJobs = async () => {
        try {
            const response = await api.get("/jobs/")
            setJobs(response.data)
        } catch (error) {
            console.error("Failed to fetch jobs", error)
        } finally {
            setLoading(false)
        }
    }

    // Calculations
    const totalApplications = jobs.length
    const interviews = jobs.filter(j => j.status === "INTERVIEWING").length
    const offers = jobs.filter(j => j.status === "OFFER").length
    const activeApplications = jobs.filter(j => ["APPLIED", "INTERVIEWING"].includes(j.status)).length

    const statusData = [
        { name: "Saved", value: jobs.filter(j => j.status === "SAVED").length },
        { name: "Applied", value: jobs.filter(j => j.status === "APPLIED").length },
        { name: "Interview", value: jobs.filter(j => j.status === "INTERVIEWING").length },
        { name: "Offer", value: jobs.filter(j => j.status === "OFFER").length },
        { name: "Rejected", value: jobs.filter(j => j.status === "REJECTED").length },
    ]

    const COLORS = ["#94a3b8", "#3b82f6", "#8b5cf6", "#22c55e", "#ef4444"]

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-foreground mb-1">Analytics</h1>
                    <p className="text-sm text-muted-foreground">
                        Insights into your job search progress
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <Card className="border-border">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">{totalApplications}</div>
                                </CardContent>
                            </Card>
                            <Card className="border-border">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Processes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeApplications}</div>
                                </CardContent>
                            </Card>
                            <Card className="border-border">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Interviews</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{interviews}</div>
                                </CardContent>
                            </Card>
                            <Card className="border-border">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Offers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{offers}</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Application Status</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={statusData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                cursor={{ fill: 'currentColor', opacity: 0.1 }}
                                                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-border">
                                <CardHeader>
                                    <CardTitle>Pipeline Distribution</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData.filter(d => d.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {statusData.filter(d => d.value > 0).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[statusData.findIndex(s => s.name === entry.name)]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {totalApplications === 0 && (
                                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm -mt-[200px]">
                                            No data to display
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
