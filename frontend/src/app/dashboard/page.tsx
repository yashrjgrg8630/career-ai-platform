"use client"

import { useEffect, useState } from "react"
import {
    FileText,
    Briefcase,
    Calendar,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { useAuthStore } from "@/store/auth"

export default function DashboardPage() {
    const { isAuthenticated } = useAuthStore()
    const [stats, setStats] = useState({
        resumes: 0,
        applications: 0,
        interviews: 0,
        offers: 0,
        loading: true
    })

    const [recentApplications, setRecentApplications] = useState<any[]>([])

    useEffect(() => {
        if (!isAuthenticated) return

        const fetchData = async () => {
            try {
                const [resumesRes, jobsRes] = await Promise.all([
                    api.get("/resumes/"),
                    api.get("/jobs/"),
                ])

                const jobs = jobsRes.data
                setStats({
                    resumes: resumesRes.data.length,
                    applications: jobs.length,
                    interviews: jobs.filter((j: any) => j.status === "INTERVIEWING").length,
                    offers: jobs.filter((j: any) => j.status === "OFFER").length,
                    loading: false
                })
                setRecentApplications(jobs.slice(0, 5))
            } catch (error) {
                console.error("Failed to fetch data", error)
                setStats(prev => ({ ...prev, loading: false }))
            }
        }

        fetchData()
    }, [isAuthenticated])

    const responseRate = stats.applications > 0
        ? Math.round((stats.interviews / stats.applications) * 100)
        : 0

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-foreground mb-1">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of your job search activity
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <MetricCard
                        title="Total Applications"
                        value={stats.applications}
                        change={12}
                        trend="up"
                        loading={stats.loading}
                    />
                    <MetricCard
                        title="Interviews Scheduled"
                        value={stats.interviews}
                        change={8}
                        trend="up"
                        loading={stats.loading}
                    />
                    <MetricCard
                        title="Offers Received"
                        value={stats.offers}
                        change={0}
                        trend="neutral"
                        loading={stats.loading}
                    />
                    <MetricCard
                        title="Response Rate"
                        value={`${responseRate}%`}
                        change={-3}
                        trend={responseRate > 20 ? "up" : "down"}
                        loading={stats.loading}
                    />
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Application Funnel */}
                    <div className="col-span-2">
                        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-semibold text-foreground">
                                        Application Pipeline
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground hover:bg-muted">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <FunnelStage title="Saved" count={24} total={24} percentage={100} />
                                    <FunnelStage title="Applied" count={18} total={24} percentage={75} />
                                    <FunnelStage title="Screening" count={12} total={24} percentage={50} />
                                    <FunnelStage title="Interview" count={6} total={24} percentage={25} />
                                    <FunnelStage title="Offer" count={2} total={24} percentage={8} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Stats */}
                    <div>
                        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="border-b border-border pb-4">
                                <CardTitle className="text-base font-semibold text-foreground">
                                    This Week
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <StatRow label="Applications submitted" value="3" />
                                    <StatRow label="Interviews completed" value="1" />
                                    <StatRow label="Follow-ups sent" value="5" />
                                    <StatRow label="Offers received" value="0" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Applications Table */}
                <div className="mt-6">
                    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="border-b border-border pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold text-foreground">
                                    Recent Applications
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted">
                                    View all
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-b border-border">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Company
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Position
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Applied
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Last Updated
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-card divide-y divide-border">
                                        {recentApplications.length > 0 ? (
                                            recentApplications.map((app, index) => (
                                                <tr key={index} className="hover:bg-muted/50 cursor-pointer transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                        {app.company}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                        {app.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <StatusBadge status={app.status} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                        {new Date(app.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                        {new Date(app.updated_at || app.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                                                    No applications yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}

function MetricCard({ title, value, change, trend, loading }: any) {
    return (
        <Card className="border border-border shadow-sm hover:shadow-md hover:border-ring/50 transition-all cursor-pointer">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    {trend !== "neutral" && (
                        <div className={`flex items-center text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"
                            }`}>
                            {trend === "up" ? (
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            ) : (
                                <ArrowDownRight className="h-3 w-3 mr-0.5" />
                            )}
                            {Math.abs(change)}%
                        </div>
                    )}
                </div>
                {loading ? (
                    <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                ) : (
                    <p className="text-3xl font-semibold text-foreground">{value}</p>
                )}
            </CardContent>
        </Card>
    )
}

function FunnelStage({ title, count, total, percentage }: any) {
    return (
        <div className="group hover:bg-gray-50 p-2 -mx-2 rounded transition-colors">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{title}</span>
                <span className="text-sm text-muted-foreground">{count} ({percentage}%)</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                    className="bg-primary h-2 rounded-full transition-all duration-500 group-hover:bg-primary/90"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

function StatRow({ label, value }: any) {
    return (
        <div className="flex items-center justify-between hover:bg-muted/50 p-2 -mx-2 rounded transition-colors">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-semibold text-foreground">{value}</span>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, { label: string; color: string }> = {
        SAVED: { label: "Saved", color: "bg-muted text-muted-foreground hover:bg-muted/80" },
        APPLIED: { label: "Applied", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50" },
        INTERVIEWING: { label: "Interview", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50" },
        OFFER: { label: "Offer", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50" },
        REJECTED: { label: "Rejected", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50" },
    }

    const config = statusConfig[status] || statusConfig.SAVED

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${config.color}`}>
            {config.label}
        </span>
    )
}
