import { AccountCard } from "@/components/account/AccountCard";
import { SettingsTabs } from "@/components/account/SettingsTabs";
import { getAccountByAccountIdQuery } from "@/fetching/accounts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/$accountId/settings")({
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
		<div className="flex flex-col gap-4">
			<AccountCard accountId={accountId} />
			<SettingsTabs accountId={accountId} />
			<Outlet />
		</div>
	);
}
