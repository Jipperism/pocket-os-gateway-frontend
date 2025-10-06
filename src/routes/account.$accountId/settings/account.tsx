import { CopyableInput } from "@/components/common/CopyableInput";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAccountByAccountIdQuery } from "@/fetching/accounts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";

export const Route = createFileRoute("/account/$accountId/settings/account")({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		context.queryClient.ensureQueryData(
			getAccountByAccountIdQuery(params.accountId),
		);
	},
});

function RouteComponent() {
	const { accountId } = Route.useParams();
	const { data: account } = useSuspenseQuery(
		getAccountByAccountIdQuery(accountId),
	);

	if (!account) {
		return <div>Account not found</div>;
	}

	return (
		<div className="space-y-6">
			{/* Account Avatar Section */}
			<div className="flex items-center gap-4">
				<div className="h-16 w-16 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
					<User className="h-8 w-8 text-white" />
				</div>
				<SectionHeader
					title="Account Avatar"
					description="A unique image representing your account."
				/>
			</div>

			<Separator />

			{/* Account Settings Section */}
			<SectionHeader
				title="Account Settings"
				description="Modify your account settings here."
			/>
			<Button
				variant="outline"
				className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
			>
				Change settings
			</Button>

			<Separator />

			{/* Account ID Section */}
			<SectionHeader
				title="Account ID"
				description="This is your unique organization ID."
			/>
			<CopyableInput value={accountId} />
		</div>
	);
}
