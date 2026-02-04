"use client"

import { useState } from "react"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { KanbanColumn } from "./column"
import api from "@/lib/api"
import { toast } from "sonner"

const COLUMNS = [
    { id: "SAVED", title: "Saved", color: "bg-gray-400" },
    { id: "APPLIED", title: "Applied", color: "bg-blue-400" },
    { id: "INTERVIEWING", title: "Interviewing", color: "bg-purple-400" },
    { id: "OFFER", title: "Offer", color: "bg-emerald-400" },
    { id: "REJECTED", title: "Rejected", color: "bg-red-400" },
]

export function KanbanBoard({ initialJobs }: { initialJobs: any[] }) {
    const [jobs, setJobs] = useState(initialJobs)

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) return

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        const newStatus = destination.droppableId

        // Optimistic Update
        const updatedJobs = jobs.map(job =>
            job.id.toString() === draggableId
                ? { ...job, status: newStatus }
                : job
        )
        setJobs(updatedJobs)

        try {
            await api.put(`/jobs/${draggableId}`, { status: newStatus })
        } catch (error) {
            console.error("Failed to update job status", error)
            toast.error("Failed to update status")
            // Rollback
            setJobs(initialJobs)
        }
    }

    const getJobsByStatus = (status: string) => {
        return jobs.filter(job => job.status === status)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-[calc(100vh-140px)] gap-4 overflow-x-auto pb-4">
                {COLUMNS.map(column => (
                    <KanbanColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        color={column.color}
                        jobs={getJobsByStatus(column.id)}
                    />
                ))}
            </div>
        </DragDropContext>
    )
}
