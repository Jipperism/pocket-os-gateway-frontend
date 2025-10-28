import { SectionHeader } from "@/components/common/SectionHeader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/account/$accountId/$applicationId/logs")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	return (
		<div className="p-6">
			<SectionHeader
				title="Logs"
				description="View application logs and monitoring data."
			/>
		</div>
	)
}
