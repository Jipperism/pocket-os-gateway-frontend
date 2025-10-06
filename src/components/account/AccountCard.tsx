import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAccountByAccountIdQuery } from "@/fetching/accounts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Building2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface AccountCardProps {
	accountId: string;
}

export function AccountCard({ accountId }: AccountCardProps) {
	const { data: account } = useSuspenseQuery(
		getAccountByAccountIdQuery(accountId),
	);
	if (!account) {
		return null;
	}

	const handleCopyId = () => {
		navigator.clipboard.writeText(accountId);
		toast("Account ID copied to clipboard");
	};

	const handleEdit = () => {
		console.log("Edit account:", accountId);
	};

	const handleDelete = () => {
		console.log("Delete account:", accountId);
	};

	return (
		<div className="flex items-center justify-between rounded-lg bg-gray-800 p-4 text-white">
			{/* Left section - Account info */}
			<div className="flex items-center gap-4">
				{/* Account icon */}
				<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700">
					<Building2 className="h-6 w-6 text-gray-300" />
				</div>

				{/* Account details */}
				<div className="flex flex-col gap-1">
					<h3 className="text-lg font-medium text-gray-100">
						{account.userAccountName || "Account"}
					</h3>
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-400">Account ID</span>
						<button
							type="button"
							onClick={handleCopyId}
							className="rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-600 transition-colors"
						>
							{accountId}
						</button>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-400">Plan</span>
						<span className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white">
							{account.portalPlanType}
						</span>
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
						Edit account
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={handleDelete}
						className="cursor-pointer text-red-500 focus:text-red-500"
					>
						Delete account
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
