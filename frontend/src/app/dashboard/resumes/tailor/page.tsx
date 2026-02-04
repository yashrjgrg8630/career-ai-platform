"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wand2, Copy, Check } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

export default function ResumeTailorPage() {
    const [resumes, setResumes] = useState<any[]>([])
    const [selectedResumeId, setSelectedResumeId] = useState<string>("")
    const [jobDescription, setJobDescription] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetchResumes()
    }, [])

    const fetchResumes = async () => {
        try {
            const res = await api.get("/resumes/")
            setResumes(res.data)
        } catch (error) {
            console.error("Failed to fetch resumes", error)
        }
    }

    const handleTailor = async () => {
        if (!selectedResumeId || !jobDescription) {
            toast.error("Please select a resume and enter a job description")
            return
        }

        setIsGenerating(true)
        setResult(null)
        try {
            const res = await api.post("/resumes/tailor", {
                resume_id: parseInt(selectedResumeId),
                job_description: jobDescription
            })
            setResult(res.data)
            toast.success("Resume tailored successfully!")
        } catch (error) {
            console.error("Failed to tailor resume", error)
            toast.error("Failed to tailor resume")
        } finally {
            setIsGenerating(false)
        }
    }

    const copyToClipboard = () => {
        if (!result?.tailored_content_preview) return
        navigator.clipboard.writeText(result.tailored_content_preview)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-foreground mb-1">Resume Tailor 🪄</h1>
                    <p className="text-sm text-muted-foreground">
                        Customize your resume for specific job descriptions using AI.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>1. Select Source Material</CardTitle>
                                <CardDescription>Choose an existing resume to optimize.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Your Resume</Label>
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={selectedResumeId}
                                        onChange={(e) => setSelectedResumeId(e.target.value)}
                                    >
                                        <option value="" disabled>Select a resume...</option>
                                        {resumes.map((resume) => (
                                            <option key={resume.id} value={resume.id.toString()}>
                                                {resume.filename}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>2. Enter Job Description</CardTitle>
                                <CardDescription>Paste the JD you are applying for.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    className="min-h-[300px]"
                                    placeholder="Paste job description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                                <Button onClick={handleTailor} disabled={isGenerating || !selectedResumeId || !jobDescription} className="w-full">
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Tailoring...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="mr-2 h-4 w-4" /> Tailor Resume
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Result Section */}
                    <div className="space-y-6">
                        {result ? (
                            <Card className="h-full border-green-500/20 bg-green-50/50 dark:bg-green-950/10">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-green-700 dark:text-green-400">Tailored Result</CardTitle>
                                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">New Summary</h3>
                                        <div className="p-4 bg-background rounded-md border text-sm leading-relaxed">
                                            {result.tailored_summary}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Key Improvements</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                                            {result.key_improvements?.map((imp: string, i: number) => (
                                                <li key={i}>{imp}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Full Preview</h3>
                                        <div className="p-4 bg-background rounded-md border text-xs font-mono whitespace-pre-wrap h-[300px] overflow-y-auto">
                                            {result.tailored_content_preview}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground p-12 text-center">
                                <Wand2 className="h-12 w-12 mb-4 opacity-20" />
                                <p className="text-lg font-medium">Ready to Optimize</p>
                                <p className="text-sm">Select a resume and paste a JD to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
