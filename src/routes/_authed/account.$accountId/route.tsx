import { AppContainer } from "@/components/AppContainer";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/account/$accountId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { portalUserId } = Route.useRouteContext();
	return (
		<>
			<AppSidebar portalUserId={portalUserId} />
			<AppContainer>
				<Outlet />
			</AppContainer>
		</>
	);
}
