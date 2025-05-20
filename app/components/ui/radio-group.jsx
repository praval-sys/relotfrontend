import * as React from "react"
import { cn } from "../../lib/utils"
import { Check } from "lucide-react"

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("grid gap-3", className)} {...props} />
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <label className="relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:bg-muted/50 transition-all">
      <input ref={ref} type="radio" className="sr-only" {...props} />
      <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary/30 bg-white mr-4">
        <span
          className={cn(
            "h-3 w-3 rounded-full bg-primary transition-all",
            props.checked ? "opacity-100 scale-100" : "opacity-0 scale-0",
          )}
        />
      </span>
      <div className="flex-1">{children}</div>
      {props.checked && (
        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-4 w-4" />
        </div>
      )}
    </label>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
