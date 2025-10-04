import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getApplicationsByApplicationIdQuery } from "@/fetching/applications";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreHorizontal, TreePine } from "lucide-react";
import { toast } from "sonner";

interface ApplicationCardProps {
	applicationId: string;
}

export function ApplicationCard({ applicationId }: ApplicationCardProps) {
	const { data: application } = useSuspenseQuery(
		getApplicationsByApplicationIdQuery(applicationId),
	);
	if (!application) {
		return null;
	}
	const handleCopyId = () => {
		navigator.clipboard.writeText(applicationId);
		toast("App ID copied to clipboard");
	};

	const handleEdit = () => {
		console.log("Edit application:", applicationId);
	};

	const handleDelete = () => {
		console.log("Delete application:", applicationId);
	};

	return (
		<div className="flex items-center justify-between rounded-lg bg-gray-800 p-4 text-white">
			{/* Left section - Application info */}
			<div className="flex items-center gap-4">
				{/* Application icon */}
				<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700">
					{application.emoji}
				</div>

				{/* Application details */}
				<div className="flex flex-col gap-1">
					<h3 className="text-lg font-medium text-gray-100">
						{application.portalApplicationName}
					</h3>
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-400">App ID</span>
						<button
							type="button"
							onClick={handleCopyId}
							className="rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-600 transition-colors"
						>
							{applicationId}
						</button>
					</div>
				</div>
			</div>

			{/* Right section - Actions dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
					>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
						Edit information
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={handleDelete}
						className="cursor-pointer text-red-500 focus:text-red-500"
					>
						Delete application
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
