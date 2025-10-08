import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

interface LoadingErrorProps {
	/** Error message to display */
	error?: string | Error;
	/** Custom error content */
	errorContent?: ReactNode;
	/** Additional className for styling */
	className?: string;
}

export function LoadError({
	error,
	errorContent,
	className,
}: LoadingErrorProps) {
	const errorMessage =
		error instanceof Error ? error.message : error || "Something went wrong";

	console.error(error);

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center space-y-4 p-8",
				className,
			)}
		>
			{errorContent || (
				<>
					<div className="flex items-center space-x-2">
						<AlertCircle className="h-5 w-5 text-muted-foreground" />
						<span className="text-lg text-muted-foreground font-medium">
							Sorry, something went wrong
						</span>
					</div>
					<p className="text-center text-sm text-destructive max-w-md">
						{errorMessage}
					</p>
				</>
			)}
		</div>
	);
}
