"use client"

import { Droppable } from "@hello-pangea/dnd"
import { JobCard } from "./job-card"
import { MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KanbanColumnProps {
    id: string
    title: string
    jobs: any[]
    color?: string
}

export function KanbanColumn({ id, title, jobs, color = "bg-gray-100 dark:bg-gray-800" }: KanbanColumnProps) {
    return (
        <div className="flex h-full w-[300px] flex-col rounded-lg bg-gray-50/50 dark:bg-gray-900/50 border">
            <div className="flex items-center justify-between p-3 border-b bg-background/50 backdrop-blur">
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${color}`} />
                    <h3 className="text-sm font-medium">{title}</h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {jobs.length}
                    </span>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Plus className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto p-2 transition-colors ${snapshot.isDraggingOver ? "bg-primary/5" : ""
                            }`}
                    >
                        {jobs.map((job, index) => (
                            <JobCard key={job.id} job={job} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
