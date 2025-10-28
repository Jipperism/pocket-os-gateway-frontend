import { SectionHeader } from "@/components/common/SectionHeader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authed/account/$accountId/$applicationId/insights",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="p-6">
			<SectionHeader
				title="Insights"
				description="View analytics and insights for your application."
			/>
		</div>
	)
}
