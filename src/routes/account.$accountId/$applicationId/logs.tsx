import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/$accountId/$applicationId/logs")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Logs</h2>
			<p className="text-gray-600">
				View application logs and monitoring data.
			</p>
		</div>
	);
}
