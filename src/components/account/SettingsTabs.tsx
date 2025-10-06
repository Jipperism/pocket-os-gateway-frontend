import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "@tanstack/react-router";

interface SettingsTabsProps {
	accountId: string;
}

export function SettingsTabs({ accountId }: SettingsTabsProps) {
	const location = useLocation();

	const tabs = [
		{
			name: "Account",
			path: `/account/${accountId}/settings/account`,
		},
		{
			name: "Members",
			path: `/account/${accountId}/settings/members`,
		},
		{
			name: "Plan",
			path: `/account/${accountId}/settings/plan`,
		},
		{
			name: "Notifications",
			path: `/account/${accountId}/settings/notifications`,
		},
	];

	// Find the current active tab
	const activeTab =
		tabs.find((tab) => location.pathname === tab.path)?.name || "Account";

	return (
		<Tabs value={activeTab} className="w-full">
			<TabsList className="grid w-full grid-cols-4">
				{tabs.map((tab) => (
					<TabsTrigger key={tab.name} value={tab.name} asChild>
						<Link to={tab.path}>{tab.name}</Link>
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
