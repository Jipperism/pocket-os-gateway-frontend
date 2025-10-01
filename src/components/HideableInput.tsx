import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface HideableInputProps {
	value: string;
	className?: string;
}

export function HideableInput({ value, className }: HideableInputProps) {
	const [isVisible, setIsVisible] = React.useState(false);

	const placeholder = "•••••••••••••";
	const displayValue = isVisible ? value : placeholder;

	return (
		<div className={cn("relative flex items-center", className)}>
			<Input value={displayValue} readOnly className="pr-10" />
			<Button
				type="button"
				variant="ghost"
				size="icon"
				onClick={() => setIsVisible((x) => !x)}
				className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-foreground"
				aria-label={isVisible ? "Hide value" : "Show value"}
			>
				{isVisible ? (
					<EyeOff className="h-4 w-4" />
				) : (
					<Eye className="h-4 w-4" />
				)}
			</Button>
		</div>
	);
}
