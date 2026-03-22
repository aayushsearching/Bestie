import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => (
    <Textarea
      autoComplete="off"
      ref={ref}
      name="message"
      className={cn(
        "max-h-12 px-4 py-3 bg-neutral-900 border-neutral-800 text-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-xl flex items-center h-16 resize-none transition-all duration-200",
        className,
      )}
      {...props}
    />
  ),
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
