import { TanstackDevtools } from "@tanstack/react-devtools";
import {
	HeadContent,
	RouterProvider,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { ProgressProvider } from "../integrations/bprogress/progress-provider";
import ClerkProvider from "../integrations/clerk/provider";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import { fetchPortalUser } from "@/api/getPortalUser";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
	portalUserId: string | null;
	token: string | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "OS Gateway",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	beforeLoad: async () => {
		const { portalUserId, token } = await fetchPortalUser();

		return {
			portalUserId,
			token,
		};
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body>
				<ProgressProvider>
					<ClerkProvider>
						<SidebarProvider>
							{/* <Header /> */}
							{children}
							<TanstackDevtools
								config={{
									position: "bottom-left",
								}}
								plugins={[
									{
										name: "Tanstack Router",
										render: <TanStackRouterDevtoolsPanel />,
									},
									TanStackQueryDevtools,
								]}
							/>
						</SidebarProvider>
					</ClerkProvider>
				</ProgressProvider>
				<Toaster />
				<Scripts />
			</body>
		</html>
	);
}
