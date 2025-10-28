import { Link, useRouteContext } from "@tanstack/react-router";

import { Plus } from "lucide-react";

import {
	Sidebar as SidebarComponent,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getApplicationsForAccountIdQueryQuery } from "@/fetching/applications.tsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import ClerkHeader from "../integrations/clerk/header-user.tsx";

// Menu items.
const menuItems = [
	{
		label: "Demo",
		items: [
			{
				title: "Home",
				url: "/",
			},
			{
				title: "Start - Server Functions",
				url: "/demo/start/server-funcs",
			},
			{
				title: "Start - API Request",
				url: "/demo/start/api-request",
			},
			{
				title: "Clerk",
				url: "/demo/clerk",
			},
			{
				title: "Address Form",
				url: "/demo/form/address",
			},
			{
				title: "Sentry",
				url: "/demo/sentry/testing",
			},
			{
				title: "TanStack Query",
				url: "/demo/tanstack-query",
			},
			{
				title: "TanStack Table",
				url: "/demo/table",
			},
		],
	},
];

export function AppSidebar({
	portalUserId: accountId,
}: { portalUserId: string }) {
	const { data: applications } = useSuspenseQuery(
		getApplicationsForAccountIdQueryQuery(accountId),
	);
	return (
		<SidebarComponent>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Account</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem className="pl-2">
								<SidebarMenuButton asChild>
									<Link
										to="/account/$accountId/settings/account"
										params={{ accountId }}
									>
										Settings
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem className="pl-2">
								<SidebarMenuButton asChild>
									<Link to="/account/$accountId/sandbox" params={{ accountId }}>
										Sandbox
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Applications</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{applications.map((application) => (
								<SidebarMenuItem
									key={application.portalApplicationId}
									className="pl-2"
								>
									<SidebarMenuButton asChild>
										<Link
											to="/account/$accountId/$applicationId/services"
											params={{
												accountId,
												applicationId: application.portalApplicationId,
											}}
										>
											{application.emoji} {application.portalApplicationName}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
							<SidebarMenuItem className="pl-2">
								<SidebarMenuButton asChild>
									<Link to="/account/$accountId/create" params={{ accountId }}>
										<Plus /> New Application
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>User</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem className="pl-2">
								<SidebarMenuButton asChild>
									<ClerkHeader />
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				{menuItems.map((menu) => (
					<SidebarGroup key={menu.label}>
						<SidebarGroupLabel>{menu.label}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{menu.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<Link to={item.url}>
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
		</SidebarComponent>
	);
}
