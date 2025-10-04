import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/account/$accountId/$applicationId/security",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Security</h2>
			<p className="text-gray-600">
				Manage security settings and access controls.
			</p>
		</div>
	);
}
