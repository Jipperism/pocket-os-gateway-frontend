import { ApplicationCard } from "@/components/application/ApplicationCard";
import { ApplicationTabs } from "@/components/application/ApplicationTabs";
import { getApplicationsByApplicationIdQuery } from "@/fetching/applications";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/$accountId/$applicationId")({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		await context.queryClient.ensureQueryData(
			getApplicationsByApplicationIdQuery(params.applicationId),
		);
	},
});

function RouteComponent() {
	const { accountId, applicationId } = Route.useParams();
	const { data: application } = useSuspenseQuery(
		getApplicationsByApplicationIdQuery(applicationId),
	);

	if (!application) {
		return <div>Application not found</div>;
	}

	return (
		<div className="flex flex-col gap-4">
			<ApplicationCard applicationId={application.portalApplicationId} />
			<ApplicationTabs accountId={accountId} applicationId={applicationId} />
			<Outlet />
		</div>
	);
}
