"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"

interface NewApplicationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
    job?: any // Optional job to edit
}

export function NewApplicationDialog({ open, onOpenChange, onSuccess, job }: NewApplicationDialogProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        status: "APPLIED",
        job_url: ""
    })

    // Load job data when opening in edit mode
    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || "",
                company: job.company || "",
                location: job.location || "",
                status: job.status || "APPLIED",
                job_url: job.job_url || ""
            })
        } else {
            // Reset for new application
            setFormData({
                title: "",
                company: "",
                location: "",
                status: "APPLIED",
                job_url: ""
            })
        }
    }, [job, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (job) {
                // Update existing job
                await api.put(`/jobs/${job.id}`, formData)
            } else {
                // Create new job
                await api.post("/jobs/", formData)
            }
            onSuccess()
            onOpenChange(false)
            if (!job) {
                setFormData({
                    title: "",
                    company: "",
                    location: "",
                    status: "APPLIED",
                    job_url: ""
                })
            }
        } catch (error) {
            console.error("Failed to save application", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{job ? "Edit Application" : "New Application"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Software Engineer"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                            id="company"
                            placeholder="e.g. Acme Corp"
                            required
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            placeholder="e.g. Remote"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="SAVED">Saved</option>
                            <option value="APPLIED">Applied</option>
                            <option value="INTERVIEWING">Interviewing</option>
                            <option value="OFFER">Offer</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="job_url">Job URL (Optional)</Label>
                        <Input
                            id="job_url"
                            placeholder="https://..."
                            value={formData.job_url}
                            onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (job ? "Update Application" : "Create Application")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
