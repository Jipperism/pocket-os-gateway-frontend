import { Link } from "@tanstack/react-router";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

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
import { useAuth } from "@clerk/clerk-react";
import ClerkHeader from "../integrations/clerk/header-user.tsx";

// Menu items.
const menuItems = [
	{
		label: "Application",
		items: [
			{
				title: "Home",
				url: "/",
				icon: Home,
			},
		],
	},
	{
		label: "Demo",
		items: [
			{
				title: "Home",
				url: "/",
				icon: Home,
			},
			{
				title: "Start - Server Functions",
				url: "/demo/start/server-funcs",
				icon: Inbox,
			},
			{
				title: "Start - API Request",
				url: "/demo/start/api-request",
				icon: Calendar,
			},
			{
				title: "Clerk",
				url: "/demo/clerk",
				icon: Search,
			},
			{
				title: "Simple Form",
				url: "/demo/form/simple",
				icon: Settings,
			},
			{
				title: "Address Form",
				url: "/demo/form/address",
				icon: Home,
			},
			{
				title: "Sentry",
				url: "/demo/sentry/testing",
				icon: Inbox,
			},
			{
				title: "TanStack Query",
				url: "/demo/tanstack-query",
				icon: Calendar,
			},
			{
				title: "TanStack Table",
				url: "/demo/table",
				icon: Search,
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
												<item.icon />
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
					<SidebarGroupLabel>Account</SidebarGroupLabel>
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
