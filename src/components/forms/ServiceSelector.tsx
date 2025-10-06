"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { Services } from "@/fetching/api";
import { getServicesQuery } from "@/fetching/services";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

interface ServiceSelectorProps {
	selectedServiceId?: string;
	onServiceSelect: (service: Services) => void;
	placeholder?: string;
	className?: string;
	excludedServices?: string[];
}

export function ServiceSelector({
	selectedServiceId,
	onServiceSelect,
	placeholder = "Search Service",
	className,
	excludedServices = [],
}: ServiceSelectorProps) {
	const { data: services } = useSuspenseQuery(getServicesQuery);
	const [open, setOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");

	const handleServiceSelect = (serviceId: string) => {
		const service = services?.find((s) => s.serviceId === serviceId);
		if (service) {
			onServiceSelect(service);
			setOpen(false);
			setSearchValue("");
		}
	};

	const availableServices =
		services?.filter(
			(service) => !excludedServices.includes(service.serviceId),
		) || [];

	const selectedService = services?.find(
		(s) => s.serviceId === selectedServiceId,
	);

	const getSearchboxLabel = () => {
		if (selectedService) {
			return selectedService.serviceName;
		}
		if (searchValue) {
			return `Searching for "${searchValue}"`;
		}
		return placeholder;
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-expanded={open}
					className={cn(
						"w-full justify-between bg-gray-800 border-gray-600 text-white hover:bg-gray-700",
						className,
					)}
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
						{getSearchboxLabel()}
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0 bg-gray-800 border-gray-600">
				<Command>
					<CommandInput
						placeholder={`${placeholder}...`}
						className=""
						value={searchValue}
						onValueChange={setSearchValue}
					/>
					<CommandList>
						<CommandEmpty>No service found.</CommandEmpty>
						<CommandGroup>
							{availableServices.map((service) => (
								<CommandItem
									key={service.serviceId}
									value={service.serviceName}
									onSelect={() => handleServiceSelect(service.serviceId)}
									className="text-white hover:bg-gray-700"
								>
									<div className="flex items-center gap-2">
										<span className="text-lg">{service.svgIcon}</span>
										<div>
											<div className="font-medium">{service.serviceName}</div>
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
	);
}
