"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Play, Send } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

export default function InterviewsPage() {
    // State
    const [jobTitle, setJobTitle] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [isStarted, setIsStarted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [questions, setQuestions] = useState<string[]>([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    const [answer, setAnswer] = useState("")
    const [feedback, setFeedback] = useState<any>(null)
    const [isEvaluating, setIsEvaluating] = useState(false)

    // Generate Questions
    const startInterview = async () => {
        if (!jobTitle) {
            toast.error("Please enter a job title")
            return
        }
        setIsLoading(true)
        try {
            const res = await api.post("/interviews/generate", {
                job_title: jobTitle,
                job_description: jobDescription
            })
            setQuestions(res.data)
            setIsStarted(true)
            setCurrentQuestionIndex(0)
        } catch (error) {
            console.error(error)
            toast.error("Failed to generate questions")
        } finally {
            setIsLoading(false)
        }
    }

    // Submit Answer
    const submitAnswer = async () => {
        if (!answer.trim()) return

        setIsEvaluating(true)
        try {
            const res = await api.post("/interviews/evaluate", {
                question: questions[currentQuestionIndex],
                answer: answer
            })
            setFeedback(res.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to evaluate answer")
        } finally {
            setIsEvaluating(false)
        }
    }

    // Next Question
    const nextQuestion = () => {
        setAnswer("")
        setFeedback(null)
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            // End Interview
            setIsStarted(false)
            setQuestions([])
            toast.success("Interview Completed!")
        }
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-foreground mb-1">AI Mock Interviewer 🎤</h1>
                    <p className="text-sm text-muted-foreground">
                        Practice your interview skills with real-time AI feedback.
                    </p>
                </div>

                {!isStarted ? (
                    /* Setup Card */
                    <Card>
                        <CardHeader>
                            <CardTitle>Start a New Session</CardTitle>
                            <CardDescription>
                                Enter the role you want to practice for.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Input
                                    placeholder="e.g. Senior Product Manager"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Job Description (Optional)</Label>
                                <Input
                                    placeholder="e.g. Leading the core product team..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                            </div>
                            <Button onClick={startInterview} disabled={isLoading} className="w-full">
                                {isLoading ? "Generating Questions..." : "Start Interview"}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    /* Interview Interface */
                    <div className="space-y-6">
                        {/* Progress */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                            <Button variant="ghost" size="sm" onClick={() => setIsStarted(false)} className="text-destructive">
                                End Session
                            </Button>
                        </div>

                        {/* Question Card */}
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="pt-6">
                                <h2 className="text-xl font-medium text-foreground">
                                    {questions[currentQuestionIndex]}
                                </h2>
                            </CardContent>
                        </Card>

                        {/* Answer Section */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Your Answer</Label>
                                    <div className="relative">
                                        <textarea
                                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Type your answer here..."
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            disabled={!!feedback}
                                        />
                                    </div>
                                </div>

                                {!feedback ? (
                                    <div className="flex justify-end">
                                        <Button onClick={submitAnswer} disabled={isEvaluating || !answer}>
                                            {isEvaluating ? "Analyzing..." : (
                                                <>
                                                    Submit Answer <Send className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ) : (
                                    /* Feedback Display */
                                    <div className="mt-6 space-y-4 bg-muted/50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-foreground">AI Feedback</h3>
                                            <Badge variant={feedback.score >= 70 ? "default" : "destructive"}>
                                                Score: {feedback.score}/100
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-foreground">{feedback.feedback}</p>

                                        {feedback.suggested_improvement && (
                                            <div className="pt-2 border-t border-border">
                                                <p className="text-xs font-semibold text-muted-foreground mb-1">SUGGESTION</p>
                                                <p className="text-sm text-foreground italic">"{feedback.suggested_improvement}"</p>
                                            </div>
                                        )}

                                        <div className="flex justify-end pt-2">
                                            <Button onClick={nextQuestion}>
                                                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
