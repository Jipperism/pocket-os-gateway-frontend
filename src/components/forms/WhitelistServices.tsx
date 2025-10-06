"use client";

import { Check, ChevronsUpDown, Copy, Trash2 } from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { Services } from "@/fetching/api";
import { getApplicationsByApplicationIdQuery } from "@/fetching/applications";
import { getServicesQuery } from "@/fetching/services";
import { useAppForm } from "@/hooks/form";
import { cn } from "@/lib/utils";
import { useStore } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";

interface WhitelistServicesProps {
	portalApplicationId: string;
}

const schema = z.object({
	whitelistedServices: z.array(
		z.object({
			serviceId: z.string(),
			serviceName: z.string(),
			serviceDomains: z.array(z.string()),
			svgIcon: z.string().optional(),
			publicEndpointUrl: z.string().optional(),
		}),
	),
});

export function WhitelistServicesContent({
	portalApplicationId,
}: WhitelistServicesProps) {
	const { data: services } = useSuspenseQuery(getServicesQuery);
	const { data: portalApplication } = useSuspenseQuery(
		getApplicationsByApplicationIdQuery(portalApplicationId),
	);
	const [open, setOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");

	const form = useAppForm({
		defaultValues: {
			whitelistedServices: [] as Services[],
		},
		validators: {
			onBlur: schema,
		},
		onSubmit: async ({ value }) => {
			console.log("Saving whitelisted services:", value.whitelistedServices);
		},
	});

	const handleServiceSelect = (serviceId: string) => {
		const service = services?.find((s) => s.serviceId === serviceId);
		if (service) {
			const currentServices = form.getFieldValue("whitelistedServices");
			const isAlreadyAdded = currentServices.find(
				(ws) => ws.serviceId === serviceId,
			);
			if (!isAlreadyAdded) {
				form.setFieldValue("whitelistedServices", [
					...currentServices,
					service,
				]);
			}
		}
		setOpen(false);
		setSearchValue("");
	};

	const handleRemoveService = (serviceId: string) => {
		const currentServices = form.getFieldValue("whitelistedServices");
		const updatedServices = currentServices.filter(
			(service) => service.serviceId !== serviceId,
		);
		form.setFieldValue("whitelistedServices", updatedServices);
	};

	const handleCopyEndpoint = (endpoint: string) => {
		navigator.clipboard.writeText(endpoint);
	};

	const handleSave = () => {
		form.handleSubmit();
	};

	const handleDiscard = () => {
		form.setFieldValue("whitelistedServices", []);
	};

	const whitelistedServices = useStore(
		form.store,
		(state) => state.values.whitelistedServices,
	);

	const servicesWithoutWhitelistedServices = services?.filter(
		(service) =>
			!whitelistedServices.find((ws) => ws.serviceId === service.serviceId),
	);

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="mb-6 p-6 border-b border-gray-700">
				<SectionHeader
					title={`Whitelist Services for ${portalApplication?.portalApplicationName}`}
					description="Limits the Endpoints to be used only with specific services."
				/>
			</div>

			<div className="flex-1 p-6 overflow-y-auto">
				{/* Search Combobox */}
				<div className="mb-6">
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								aria-expanded={open}
								className="w-full justify-between bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
							>
								<div className="flex items-center gap-2">
									<svg
										className="h-4 w-4 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-label="Search icon"
									>
										<title>Search</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
									{searchValue
										? `Searching for "${searchValue}"`
										: "Search Service"}
								</div>
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-full p-0 bg-gray-800 border-gray-600">
							<Command>
								<CommandInput
									placeholder="Search Service..."
									className=""
									value={searchValue}
									onValueChange={setSearchValue}
								/>
								<CommandList>
									<CommandEmpty>No service found.</CommandEmpty>
									<CommandGroup>
										{servicesWithoutWhitelistedServices?.map((service) => (
											<CommandItem
												key={service.serviceId}
												value={service.serviceName}
												onSelect={() => handleServiceSelect(service.serviceId)}
												className="text-white hover:bg-gray-700"
											>
												<div className="flex items-center gap-2">
													<span className="text-lg">{service.svgIcon}</span>
													<div>
														<div className="font-medium">
															{service.serviceName}
														</div>
														<div className="text-sm text-gray-400">
															{service.serviceName}
														</div>
													</div>
												</div>
												<Check
													className={cn(
														"ml-auto h-4 w-4",
														searchValue === service.serviceName
															? "opacity-100"
															: "opacity-0",
													)}
												/>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>

				{/* Services List */}
				<div className="space-y-4 mb-6">
					{whitelistedServices.map((service) => (
						<div
							key={service.serviceId}
							className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
						>
							{/* Service Icon */}
							<div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
								<span className="text-white text-lg">{service.svgIcon}</span>
							</div>

							{/* Service Info */}
							<div className="flex-1 min-w-0">
								<div className="text-white font-medium">
									{service.serviceName}
								</div>
								<div className="text-gray-400 text-sm">
									{service.serviceName}
								</div>
							</div>

							{/* Endpoint URL */}
							<div className="flex-1 min-w-0">
								<Input
									value={service.publicEndpointUrl}
									readOnly
									className="bg-gray-700 border-gray-600 text-white text-sm"
								/>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="icon"
									onClick={() =>
										handleCopyEndpoint(service.publicEndpointUrl || "")
									}
									className="text-gray-400 hover:text-white hover:bg-gray-700"
								>
									<Copy className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleRemoveService(service.serviceId)}
									className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="p-6 border-t border-gray-700">
				<div className="flex justify-end gap-3">
					<Button
						variant="outline"
						onClick={handleDiscard}
						className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
					>
						Discard
					</Button>
					<Button
						onClick={handleSave}
						disabled={form.getFieldValue("whitelistedServices").length === 0}
						className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
}
