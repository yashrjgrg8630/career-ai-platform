"use client"

import { Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, DollarSign } from "lucide-react"

interface JobCardProps {
    job: any
    index: number
}

export function JobCard({ job, index }: JobCardProps) {
    return (
        <Draggable draggableId={job.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3"
                    style={{ ...provided.draggableProps.style }}
                >
                    <Card
                        className={`cursor-grab hover:shadow-md transition-shadow ${snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20 rotate-1" : ""
                            }`}
                    >
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-semibold">{job.title}</CardTitle>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                {job.company}
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                                {job.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {job.location}
                                    </div>
                                )}
                                {job.salary_range && (
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {job.salary_range}
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 flex gap-2">
                                <span className="rounded bg-secondary px-2 py-0.5 text-[10px] uppercase font-medium">
                                    {job.status}
                                </span>
                                <span className="text-[10px] text-muted-foreground ml-auto">
                                    {new Date(job.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Draggable>
    )
}
