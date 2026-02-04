"use client"

import * as React from "react"
import { Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { useAuthStore } from "@/store/auth"

interface ResumeUploadProps {
    onSuccess?: () => void
    onUploadComplete?: () => void
}

export function ResumeUpload({ onSuccess, onUploadComplete }: ResumeUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const { token, isAuthenticated } = useAuthStore()

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        // Check authentication
        if (!isAuthenticated || !token) {
            setError("You must be logged in to upload resumes. Please login and try again.")
            return
        }

        setUploading(true)
        setProgress(10)
        setError(null)
        setSuccess(false)

        const formData = new FormData()
        formData.append("file", file)

        try {
            console.log("Uploading to:", "/resumes/upload")
            console.log("File:", file.name, file.type, file.size)
            console.log("Token present:", !!token)

            const response = await api.post("/resumes/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    )
                    setProgress(percentCompleted)
                },
            })

            console.log("Upload successful:", response.data)
            setSuccess(true)
            setTimeout(() => {
                if (onSuccess) onSuccess()
                if (onUploadComplete) onUploadComplete()
            }, 1000)
        } catch (error: any) {
            console.error("Upload failed:", error)
            console.error("Error response:", error.response)
            console.error("Error message:", error.message)

            let errorMessage = "Failed to upload resume. Please try again."

            if (error.response) {
                // Server responded with error
                errorMessage = error.response.data?.detail || `Server error: ${error.response.status}`
            } else if (error.request) {
                // Request made but no response
                errorMessage = "Cannot connect to server. Please check if the backend is running."
            } else {
                // Something else happened
                errorMessage = error.message || "Unknown error occurred"
            }

            setError(errorMessage)
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }, [onSuccess, onUploadComplete, token, isAuthenticated])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        multiple: false,
        disabled: uploading || success
    })

    return (
        <div>
            <div
                {...getRootProps()}
                className={cn(
                    "relative rounded-lg border-2 border-dashed p-12 transition-all cursor-pointer",
                    isDragActive && "border-blue-500 bg-blue-50",
                    uploading && "pointer-events-none opacity-50",
                    success && "border-green-500 bg-green-50",
                    error && "border-red-500 bg-red-50",
                    !isDragActive && !uploading && !success && !error && "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className={cn(
                        "rounded-full p-4 transition-all",
                        success ? "bg-green-100" : error ? "bg-red-100" : "bg-gray-100 group-hover:bg-gray-200"
                    )}>
                        {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        ) : success ? (
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        ) : error ? (
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        ) : (
                            <Upload className="h-8 w-8 text-gray-600" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {uploading
                                ? "Analyzing Resume..."
                                : success
                                    ? "Upload Successful!"
                                    : error
                                        ? "Upload Failed"
                                        : "Upload your resume"}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {uploading
                                ? `${progress}% complete`
                                : success
                                    ? "Your resume has been analyzed"
                                    : error
                                        ? error
                                        : "Drag and drop your PDF here, or click to select"}
                        </p>
                    </div>
                    {!uploading && !success && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-all"
                        >
                            Select PDF
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
