import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyableInputProps {
	value: string;
	placeholder?: string;
	className?: string;
	id?: string;
}

export function CopyableInput({
	value,
	placeholder,
	className,
	id,
}: CopyableInputProps) {
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast("Copied to clipboard");
	};

	return (
		<div className="relative">
			<Input
				id={id}
				value={value}
				placeholder={placeholder}
				readOnly
				className={cn("pr-10", className)}
			/>
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-0 top-0 h-full px-3"
				onClick={() => copyToClipboard(value)}
				type="button"
			>
				<Copy className="h-4 w-4" />
			</Button>
		</div>
	);
}
