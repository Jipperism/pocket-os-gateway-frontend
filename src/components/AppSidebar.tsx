import { Link } from "@tanstack/react-router";

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
import ClerkHeader from "../integrations/clerk/header-user.tsx";

// Menu items.
const menuItems = [
	{
		label: "Account",
		items: [
			{
				title: "Home",
				url: "/",
			},
			{ title: "Upgrade to Unlimited", url: "/upgrade" },
			{ title: "Insights", url: "/insights" },
			{ title: "Logs", url: "/logs" },
			{ title: "Sandbox", url: "/sandbox" },
			{ title: "Account Settings", url: "/account-settings" },
		],
	},
	{
		label: "Applications",
		items: [{ title: "Home", url: "/" }],
	},
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

export function AppSidebar() {
	return (
		<SidebarComponent>
			<SidebarContent>
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
				<SidebarGroup>
					<SidebarGroupLabel>Applications</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem className="pl-2">
								<SidebarMenuButton asChild>
									<Link to="/applications/create">
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
			</SidebarContent>
		</SidebarComponent>
	);
}
