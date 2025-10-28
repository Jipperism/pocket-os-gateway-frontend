import { SandboxForm } from "@/components/forms/sandbox";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/account/$accountId/sandbox")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<h1 className="text-2xl font-bold mb-6">Sandbox</h1>
			<SandboxForm />
		</>
	)
}
