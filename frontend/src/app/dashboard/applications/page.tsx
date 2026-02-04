"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { useAuthStore } from "@/store/auth"
import { NewApplicationDialog } from "@/components/new-application-dialog"

const STATUSES = [
    { id: "SAVED", label: "Saved" },
    { id: "APPLIED", label: "Applied" },
    { id: "INTERVIEWING", label: "Interview" },
    { id: "OFFER", label: "Offer" },
    { id: "REJECTED", label: "Rejected" },
]

export default function ApplicationsPage() {
    const { isAuthenticated } = useAuthStore()
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false)
    const [editingJob, setEditingJob] = useState<any>(null)

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

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this application?")) return
        try {
            await api.delete(`/jobs/${id}`)
            fetchJobs()
        } catch (error) {
            console.error("Failed to delete job", error)
        }
    }

    const handleEdit = (job: any) => {
        setEditingJob(job)
        setIsNewApplicationOpen(true)
    }

    const jobsByStatus = STATUSES.reduce((acc, status) => {
        acc[status.id] = jobs.filter(job => job.status === status.id)
        return acc
    }, {} as Record<string, any[]>)

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground mb-1">Applications</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage and track your job applications
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingJob(null)
                            setIsNewApplicationOpen(true)
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Application
                    </Button>
                </div>

                <NewApplicationDialog
                    open={isNewApplicationOpen}
                    onOpenChange={setIsNewApplicationOpen}
                    onSuccess={fetchJobs}
                    job={editingJob}
                />

                {/* Search & Filters */}
                <div className="flex gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search applications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background border-border hover:border-ring/50 focus:border-ring transition-colors"
                        />
                    </div>
                    <Button variant="outline" className="border-border hover:border-ring/50 hover:bg-muted transition-all">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-5 gap-4">
                    {STATUSES.map((status) => (
                        <div key={status.id}>
                            <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3 border-b border-border">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-semibold text-foreground">
                                            {status.label}
                                        </CardTitle>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                            {jobsByStatus[status.id]?.length || 0}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 space-y-2">
                                    {loading ? (
                                        <div className="space-y-2">
                                            {[1, 2].map((i) => (
                                                <div key={i} className="h-24 bg-muted rounded animate-pulse" />
                                            ))}
                                        </div>
                                    ) : jobsByStatus[status.id]?.length > 0 ? (
                                        jobsByStatus[status.id].map((job: any) => (
                                            <JobCard
                                                key={job.id}
                                                job={job}
                                                onEdit={() => handleEdit(job)}
                                                onDelete={() => handleDelete(job.id)}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-xs text-muted-foreground">
                                            No applications
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function JobCard({ job, onEdit, onDelete }: { job: any, onEdit: () => void, onDelete: () => void }) {
    return (
        <div className="p-3 rounded-lg bg-card text-card-foreground border border-border hover:border-ring/50 hover:shadow-md transition-all group relative">
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {job.title}
                </h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-card pl-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="hover:bg-muted rounded p-1 text-muted-foreground hover:text-primary transition-colors"
                        title="Edit"
                    >
                        <Pencil className="h-3 w-3" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="hover:bg-red-500/10 rounded p-1 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{job.company}</p>
            {job.location && (
                <p className="text-xs text-muted-foreground">{job.location}</p>
            )}
            <div className="mt-2 pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                    {new Date(job.created_at).toLocaleDateString()}
                </p>
            </div>
        </div>
    )
}
