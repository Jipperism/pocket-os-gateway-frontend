import { CopyableInput } from "@/components/common/CopyableInput";
import { SandboxForm } from "@/components/forms/sandbox";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getServicesQuery } from "@/fetching/services";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	type FilterFn,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Play, Search, Square, Star } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute(
	"/account/$accountId/$applicationId/services",
)({
	component: RouteComponent,
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(getServicesQuery);
	},
});

// Helper function to get service icon and color based on serviceId
const getServiceIcon = (serviceId: string) => {
	const iconMap: Record<string, { icon: string; color: string }> = {
		"ethereum-mainnet": { icon: "Ξ", color: "bg-gray-600" },
		"polygon-mainnet": { icon: "⬟", color: "bg-purple-500" },
		"avalanche-mainnet": { icon: "A", color: "bg-red-500" },
		"binance-smart-chain": { icon: "B", color: "bg-yellow-500" },
		"arbitrum-mainnet": { icon: "A", color: "bg-blue-500" },
		"optimism-mainnet": { icon: "O", color: "bg-red-400" },
		"base-mainnet": { icon: "—", color: "bg-black" },
		"solana-mainnet": { icon: "S", color: "bg-purple-600" },
		"cosmos-hub": { icon: "⚛", color: "bg-blue-600" },
		"osmosis-mainnet": { icon: "O", color: "bg-pink-500" },
		"near-mainnet": { icon: "N", color: "bg-green-500" },
		"fantom-mainnet": { icon: "F", color: "bg-blue-400" },
		"gnosis-mainnet": { icon: "G", color: "bg-green-600" },
		"celo-mainnet": { icon: "C", color: "bg-yellow-400" },
		"moonbeam-mainnet": { icon: "M", color: "bg-blue-300" },
		"harmony-mainnet": { icon: "H", color: "bg-orange-500" },
		"ethereum-sepolia": { icon: "Ξ", color: "bg-gray-500" },
		"polygon-mumbai": { icon: "⬟", color: "bg-purple-400" },
		"starknet-mainnet": { icon: "S", color: "bg-orange-600" },
	};

	return iconMap[serviceId] || { icon: "?", color: "bg-gray-500" };
};

// Helper function to generate URLs from service data
const generateServiceUrls = (service: { publicEndpointUrl?: string }) => {
	const urls: string[] = [];

	if (service.publicEndpointUrl) {
		urls.push(service.publicEndpointUrl);
	}

	// Add WSS URL if it's a WebSocket service
	if (service.publicEndpointUrl?.includes("wss://")) {
		urls.push(service.publicEndpointUrl);
	} else if (service.publicEndpointUrl) {
		// Generate WSS URL from HTTP URL
		const wssUrl = service.publicEndpointUrl.replace("https://", "wss://");
		urls.push(wssUrl);
	}

	return urls;
};

// Define the service type for the table
type ServiceRow = {
	id: string;
	name: string;
	subName: string;
	icon: string;
	iconColor: string;
	urls: string[];
	isFavorite: boolean;
};

// Create column helper
const columnHelper = createColumnHelper<ServiceRow>();

function RouteComponent() {
	const { applicationId } = Route.useParams();
	const { data: services } = useSuspenseQuery(getServicesQuery);
	const [searchInput, setSearchInput] = useState("");
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [selectedService, setSelectedService] = useState<ServiceRow | null>(
		null,
	);

	// Transform services data to UI format
	const transformedServices = useMemo(() => {
		return (services || []).map((service) => {
			const { icon, color } = getServiceIcon(service.serviceId);
			return {
				id: service.serviceId,
				name: service.serviceName,
				subName: service.serviceId,
				icon,
				iconColor: color,
				urls: generateServiceUrls(service),
				isFavorite: false,
			};
		});
	}, [services]);

	// Filter services based on search input
	const filteredServices = useMemo(() => {
		if (!searchInput.trim()) {
			return transformedServices;
		}

		const searchLower = searchInput.toLowerCase();
		return transformedServices.filter(
			(service) =>
				service.name.toLowerCase().includes(searchLower) ||
				service.subName.toLowerCase().includes(searchLower) ||
				service.urls.some((url) => url.toLowerCase().includes(searchLower)),
		);
	}, [transformedServices, searchInput]);

	const handleMarkAsFavorite = useCallback((serviceId: string) => {
		toast("Service marked as favorite", {
			description: serviceId,
		});
	}, []);

	const toggleFavorite = useCallback(
		(serviceId: string) => {
			handleMarkAsFavorite(serviceId);
		},
		[handleMarkAsFavorite],
	);

	const handleClickTestService = useCallback((service: ServiceRow) => {
		setSelectedService(service);
		setIsDrawerOpen(true);
	}, []);

	// Define table columns
	const columns = useMemo(
		() => [
			columnHelper.display({
				id: "favorite",
				header: "",
				cell: ({ row }) => (
					<Button
						variant="ghost"
						size="icon"
						onClick={() => toggleFavorite(row.original.id)}
						className="text-gray-400 hover:text-yellow-400"
					>
						<Star className={"h-4 w-4"} />
					</Button>
				),
				size: 50,
			}),
			columnHelper.display({
				id: "service",
				header: "Service",
				cell: ({ row }) => (
					<div className="flex items-center space-x-3">
						<div
							className={`w-8 h-8 rounded-full ${row.original.iconColor} flex items-center justify-center text-sm font-bold`}
						>
							{row.original.icon}
						</div>
						<div>
							<div className="text-white font-semibold">
								{row.original.name}
							</div>
							<div className="text-gray-400 text-sm">
								{row.original.subName}
							</div>
						</div>
					</div>
				),
				size: 300,
			}),
			columnHelper.display({
				id: "urls",
				header: "Endpoints",
				cell: ({ row }) => (
					<div className="flex flex-col space-y-2">
						{row.original.urls.map((url) => (
							<div key={url} className="flex items-center space-x-2">
								<CopyableInput
									value={url}
									className="bg-gray-800 border-gray-700 text-white text-sm"
								/>
							</div>
						))}
					</div>
				),
				size: 400,
			}),
			columnHelper.display({
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-400 hover:text-white"
							onClick={() => handleClickTestService(row.original)}
						>
							<Play className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-400 hover:text-white"
						>
							<Square className="h-4 w-4" />
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-gray-400 hover:text-white"
								>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="bg-gray-800 border-gray-700"
							>
								<DropdownMenuItem
									onClick={() => handleMarkAsFavorite(row.original.id)}
									className="text-white hover:bg-gray-700"
								>
									Mark service as favorite
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
				size: 150,
			}),
		],
		[toggleFavorite, handleMarkAsFavorite, handleClickTestService],
	);

	// Create table instance
	const table = useReactTable({
		data: filteredServices,
		columns,
		getCoreRowModel: getCoreRowModel(),
		filterFns: {
			fuzzy: (() => true) as FilterFn<ServiceRow>,
		},
	});

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchInput(e.target.value);
			table.setGlobalFilter(e.target.value);
		},
		[table],
	);

	return (
		<div className="min-h-screen">
			{/* Search Bar */}
			<div className="mb-6">
				<div className="relative max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Search service"
						value={searchInput}
						onChange={handleSearchChange}
						className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
					/>
				</div>
			</div>

			{/* Services Table */}
			<div className="overflow-hidden">
				<table className="w-full border-b border-t border-gray-700">
					<tbody className="divide-y divide-gray-700">
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id} className="hover:bg-gray-750">
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-6 py-4 whitespace-nowrap">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Sandbox Drawer */}
			<Drawer
				open={isDrawerOpen}
				onOpenChange={setIsDrawerOpen}
				direction="right"
			>
				<DrawerContent className="!max-w-fit !w-fit mx-auto">
					<DrawerHeader>
						<DrawerTitle>
							{selectedService
								? `Test ${selectedService.name}`
								: "Service Sandbox"}
						</DrawerTitle>
						<DrawerDescription>
							Test your service endpoint with the sandbox tool
						</DrawerDescription>
					</DrawerHeader>
					{selectedService && (
						<SandboxForm
							application={applicationId}
							chain={selectedService.subName}
						/>
					)}
					<DrawerFooter>
						<DrawerClose asChild>
							<Button variant="outline">Close</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
