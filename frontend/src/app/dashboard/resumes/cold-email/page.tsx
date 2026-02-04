"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, Copy, Check, Send } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

export default function ColdEmailPage() {
    const [resumes, setResumes] = useState<any[]>([])
    const [selectedResumeId, setSelectedResumeId] = useState<string>("")

    // Form State
    const [recipientName, setRecipientName] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [jobTitle, setJobTitle] = useState("")

    const [isGenerating, setIsGenerating] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [copiedSubject, setCopiedSubject] = useState(false)
    const [copiedBody, setCopiedBody] = useState(false)

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

    const handleGenerate = async () => {
        if (!selectedResumeId || !recipientName || !companyName || !jobTitle) {
            toast.error("Please fill in all fields")
            return
        }

        setIsGenerating(true)
        setResult(null)
        try {
            const res = await api.post("/resumes/cold-email", {
                resume_id: parseInt(selectedResumeId),
                recipient_name: recipientName,
                company_name: companyName,
                job_title: jobTitle
            })

            if (res.data.error) {
                toast.error(res.data.error)
                return
            }

            setResult(res.data)
            toast.success("Email generated successfully!")
        } catch (error) {
            console.error("Failed to generate email", error)
            toast.error("Failed to generate email")
        } finally {
            setIsGenerating(false)
        }
    }

    const copyToClipboard = (text: string, isSubject: boolean) => {
        navigator.clipboard.writeText(text)
        if (isSubject) {
            setCopiedSubject(true)
            setTimeout(() => setCopiedSubject(false), 2000)
        } else {
            setCopiedBody(true)
            setTimeout(() => setCopiedBody(false), 2000)
        }
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-foreground mb-1">Cold Email Drafter ✉️</h1>
                    <p className="text-sm text-muted-foreground">
                        Generate professional outreach emails tailored to your resume.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                            <CardDescription>Who are you reaching out to?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Your Resume</Label>
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

                            <div className="space-y-2">
                                <Label>Recipient Name</Label>
                                <Input
                                    placeholder="e.g. John Doe"
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input
                                    placeholder="e.g. Acme Corp"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Target Job Title</Label>
                                <Input
                                    placeholder="e.g. Frontend Engineer"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                            </div>

                            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-4 w-4" /> Generate Draft
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Result Display */}
                    <div className="space-y-6">
                        {result ? (
                            <Card className="h-full border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/10">
                                <CardHeader>
                                    <CardTitle className="text-blue-700 dark:text-blue-400">Generated Draft</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-semibold uppercase text-muted-foreground">Subject Line</Label>
                                            <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => copyToClipboard(result.subject, true)}>
                                                {copiedSubject ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                            </Button>
                                        </div>
                                        <div className="p-3 bg-background rounded border text-sm font-medium">
                                            {result.subject}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-semibold uppercase text-muted-foreground">Email Body</Label>
                                            <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => copyToClipboard(result.body, false)}>
                                                {copiedBody ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                            </Button>
                                        </div>
                                        <div className="p-4 bg-background rounded border text-sm whitespace-pre-wrap leading-relaxed h-[300px] overflow-y-auto">
                                            {result.body}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button variant="outline" onClick={() => {
                                            window.location.href = `mailto:?subject=${encodeURIComponent(result.subject)}&body=${encodeURIComponent(result.body)}`
                                        }}>
                                            <Send className="mr-2 h-4 w-4" /> Open in Mail App
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground p-12 text-center bg-muted/20">
                                <Mail className="h-12 w-12 mb-4 opacity-20" />
                                <p className="text-lg font-medium">No Draft Yet</p>
                                <p className="text-sm">Fill in the details to generate your cold email.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
