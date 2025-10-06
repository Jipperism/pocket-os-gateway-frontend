import { cn } from "@/lib/utils";

interface SectionHeaderProps {
	title: string;
	description: string;
	className?: string;
}

export function SectionHeader({
	title,
	description,
	className,
}: SectionHeaderProps) {
	return (
		<div className={cn("mb-3", className)}>
			<h3 className="text-lg font-medium text-white">{title}</h3>
			<p className="text-sm text-gray-400">{description}</p>
		</div>
	);
}
