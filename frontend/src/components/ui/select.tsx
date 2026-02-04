"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// Simplified Select for internal use, wrapping native select
export const Select = ({ children, onValueChange, value }: any) => {
    return React.cloneElement(children, { onValueChange, value })
}

export const SelectTrigger = ({ children, className }: any) => (
    <div className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}>
        {children}
    </div>
)

export const SelectValue = ({ placeholder }: any) => (
    <span>{placeholder}</span>
)

export const SelectContent = ({ children }: any) => (
    <div className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
        <div className="p-1">{children}</div>
    </div>
)

export const SelectItem = ({ children, value, ...props }: any) => (
    <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" {...props}>
        {children}
    </div>
)
