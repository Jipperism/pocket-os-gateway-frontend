import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/account/$accountId/$applicationId/insights",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Insights</h2>
			<p className="text-gray-600">
				View analytics and insights for your application.
			</p>
		</div>
	);
}
