import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "@tanstack/react-router";

interface ApplicationTabsProps {
	accountId: string;
	applicationId: string;
}

export function ApplicationTabs({
	accountId,
	applicationId,
}: ApplicationTabsProps) {
	const location = useLocation();

	const tabs = [
		{
			name: "Services",
			path: `/account/${accountId}/${applicationId}/services`,
		},
		{
			name: "Insights",
			path: `/account/${accountId}/${applicationId}/insights`,
		},
		{ name: "Logs", path: `/account/${accountId}/${applicationId}/logs` },
		{
			name: "Security",
			path: `/account/${accountId}/${applicationId}/security`,
		},
		{ name: "Keys", path: `/account/${accountId}/${applicationId}/keys` },
	];

	// Find the current active tab
	const activeTab =
		tabs.find((tab) => location.pathname === tab.path)?.name || "Services";

	return (
		<Tabs value={activeTab} className="w-full">
			<TabsList className="grid w-full grid-cols-5">
				{tabs.map((tab) => (
					<TabsTrigger key={tab.name} value={tab.name} asChild>
						<Link to={tab.path}>{tab.name}</Link>
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
