"use client"

import { useEffect, useState } from "react"
import { Upload, FileText, Download, Trash2, Eye, MoreVertical, Wand2, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { useAuthStore } from "@/store/auth"
import { ResumeUpload } from "@/components/resume-upload"

export default function ResumesPage() {
    const { isAuthenticated } = useAuthStore()
    const [resumes, setResumes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showUpload, setShowUpload] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) return
        fetchResumes()
    }, [isAuthenticated])

    const fetchResumes = async () => {
        try {
            console.log("Fetching resumes...")
            const response = await api.get("/resumes/")
            console.log("Resumes fetched successfully:", response.data)
            setResumes(response.data)
        } catch (error: any) {
            console.error("Failed to fetch resumes:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            })

            // Show user-friendly error
            if (error.response?.status === 403 || error.response?.status === 401) {
                console.error("Authentication error - please login again")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleUploadSuccess = () => {
        setShowUpload(false)
        fetchResumes()
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground mb-1">Resumes</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your resumes and get AI-powered analysis
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => window.location.href = '/dashboard/resumes/tailor'}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            <Wand2 className="h-4 w-4 mr-2" />
                            Resume Tailor
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/dashboard/resumes/cold-email'}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            Cold Email
                        </Button>
                        <Button
                            onClick={() => setShowUpload(true)}
                            className="bg-gray-900 hover:bg-gray-800 text-white"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Resume
                        </Button>
                    </div>
                </div>

                {/* Upload Modal */}
                {showUpload && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
                        <div className="bg-card text-card-foreground border border-border rounded-lg shadow-2xl max-w-2xl w-full p-6 transform transition-all hover:scale-[1.01]">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-foreground">Upload Resume</h2>
                                <button
                                    onClick={() => setShowUpload(false)}
                                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-2 transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                            <ResumeUpload onSuccess={handleUploadSuccess} />
                        </div>
                    </div>
                )}

                {/* Resumes Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="border border-border shadow-sm">
                                <CardContent className="p-6">
                                    <div className="h-32 bg-muted rounded animate-pulse" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : resumes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <ResumeCard key={resume.id} resume={resume} onDelete={fetchResumes} />
                        ))}
                    </div>
                ) : (
                    <Card className="border border-border shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 hover:bg-muted/80 transition-colors">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">No resumes yet</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Upload your first resume to get started with AI-powered analysis
                            </p>
                            <Button
                                onClick={() => setShowUpload(true)}
                                className="bg-gray-900 hover:bg-gray-800 text-white transition-all hover:shadow-md hover:scale-105"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Resume
                            </Button>
                        </CardContent>
                    </Card >
                )
                }
            </div >
        </div >
    )
}

function ResumeCard({ resume, onDelete }: { resume: any; onDelete: () => void }) {
    const [showMenu, setShowMenu] = useState(false)
    const [showAnalysis, setShowAnalysis] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this resume?")) return

        try {
            await api.delete(`/resumes/${resume.id}`)
            onDelete()
        } catch (error) {
            console.error("Failed to delete resume", error)
        }
    }

    // Debug: Log resume data
    console.log("Resume data:", resume)

    // Handle different possible structures for parsed_content
    const parsedContent = typeof resume.parsed_content === 'string'
        ? JSON.parse(resume.parsed_content)
        : (resume.parsed_content || {})

    console.log("Parsed content:", parsedContent)
    console.log("Raw text available:", !!resume.raw_text)

    return (
        <>
            <Card className="border border-border shadow-sm hover:shadow-lg hover:border-ring/50 transition-all group cursor-pointer">
                <CardHeader className="border-b border-border pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                {resume.filename}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                Uploaded {new Date(resume.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="opacity-0 group-hover:opacity-100 transition-all hover:bg-muted rounded p-1.5"
                            >
                                <MoreVertical className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-xl border border-border py-1 z-10 transform transition-all">
                                    <button
                                        onClick={() => { setShowAnalysis(true); setShowMenu(false); }}
                                        className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View Details
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        Download
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-3">
                        {parsedContent.personal_info?.name && (
                            <>
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                    <span className="text-xs font-medium text-muted-foreground">Name</span>
                                    <span className="text-sm font-semibold text-foreground">{parsedContent.personal_info.name}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                    <span className="text-xs font-medium text-muted-foreground">Skills Found</span>
                                    <span className="text-sm font-semibold text-foreground">
                                        {parsedContent.skills?.technical?.length || 0}
                                    </span>
                                </div>
                            </>
                        )}
                        <Button
                            onClick={() => setShowAnalysis(true)}
                            variant="outline"
                            className="w-full border-border hover:bg-muted transition-all hover:shadow-sm"
                        >
                            View Analysis
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Analysis Modal */}
            {showAnalysis && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border">
                        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-semibold text-foreground">Resume Analysis</h2>
                            <button
                                onClick={() => setShowAnalysis(false)}
                                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-2 transition-all"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Debug Info - Remove after fixing */}
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-foreground">
                                <p className="font-mono">Debug Info:</p>
                                <p className="font-mono">- Resume ID: {resume.id}</p>
                                <p className="font-mono">- Filename: {resume.filename}</p>
                                <p className="font-mono">- Has raw_text: {resume.raw_text ? 'Yes' : 'No'}</p>
                                <p className="font-mono">- Has parsed_content: {resume.parsed_content ? 'Yes' : 'No'}</p>
                                <p className="font-mono">- Parsed content type: {typeof resume.parsed_content}</p>
                            </div>

                            {/* Note if AI analysis unavailable - show first */}
                            {/* Note if AI analysis unavailable - show first */}
                            {parsedContent.note && (
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-500 mb-1">ℹ️ Note</p>
                                    <p className="text-sm text-yellow-600 dark:text-yellow-400">{parsedContent.note}</p>
                                </div>
                            )}

                            {/* Personal Info */}
                            {parsedContent.personal_info && Object.keys(parsedContent.personal_info).some(key => parsedContent.personal_info[key]) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {parsedContent.personal_info.name && (
                                            <div className="p-3 bg-muted/50 rounded-lg">
                                                <p className="text-xs text-muted-foreground mb-1">Name</p>
                                                <p className="text-sm font-medium text-foreground">{parsedContent.personal_info.name}</p>
                                            </div>
                                        )}
                                        {parsedContent.personal_info.email && (
                                            <div className="p-3 bg-muted/50 rounded-lg">
                                                <p className="text-xs text-muted-foreground mb-1">Email</p>
                                                <p className="text-sm font-medium text-foreground">{parsedContent.personal_info.email}</p>
                                            </div>
                                        )}
                                        {parsedContent.personal_info.phone && (
                                            <div className="p-3 bg-muted/50 rounded-lg">
                                                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                                                <p className="text-sm font-medium text-foreground">{parsedContent.personal_info.phone}</p>
                                            </div>
                                        )}
                                        {parsedContent.personal_info.location && (
                                            <div className="p-3 bg-muted/50 rounded-lg">
                                                <p className="text-xs text-muted-foreground mb-1">Location</p>
                                                <p className="text-sm font-medium text-foreground">{parsedContent.personal_info.location}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {parsedContent.skills && (parsedContent.skills.technical?.length > 0 || parsedContent.skills.soft?.length > 0) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">Skills</h3>
                                    {parsedContent.skills.technical?.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-muted-foreground mb-2">Technical Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {parsedContent.skills.technical.map((skill: string, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {parsedContent.skills.soft?.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-muted-foreground mb-2">Soft Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {parsedContent.skills.soft.map((skill: string, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Education */}
                            {parsedContent.education?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">Education</h3>
                                    <div className="space-y-3">
                                        {parsedContent.education.map((edu: any, idx: number) => (
                                            <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                                                <p className="font-medium text-foreground">{edu.degree}</p>
                                                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {edu.start_date} - {edu.end_date}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience */}
                            {parsedContent.experience?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">Experience</h3>
                                    <div className="space-y-3">
                                        {parsedContent.experience.map((exp: any, idx: number) => (
                                            <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                                                <p className="font-medium text-foreground">{exp.title}</p>
                                                <p className="text-sm text-muted-foreground">{exp.company}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {exp.start_date} - {exp.end_date}
                                                </p>
                                                {exp.description && (
                                                    <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Raw text - always show if available */}
                            {resume.raw_text && resume.raw_text.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">Extracted Text</h3>
                                    <div className="p-4 bg-muted/50 rounded-lg max-h-96 overflow-y-auto border border-border">
                                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                                            {resume.raw_text}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Show raw JSON if nothing else works */}
                            {!resume.raw_text && resume.parsed_content && (
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">Resume Data (JSON)</h3>
                                    <div className="p-4 bg-muted/50 rounded-lg max-h-96 overflow-y-auto border border-border">
                                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                                            {JSON.stringify(parsedContent, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Fallback if truly no data */}
                            {!resume.raw_text && !resume.parsed_content && (
                                <div className="p-8 text-center">
                                    <p className="text-muted-foreground mb-2">No resume data available</p>
                                    <p className="text-xs text-muted-foreground">The resume may not have been processed correctly.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
