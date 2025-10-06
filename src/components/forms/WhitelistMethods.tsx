"use client";

import { Check, ChevronsUpDown, Copy, Plus, Trash2 } from "lucide-react";
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
import { getServicesQuery } from "@/fetching/services";
import { useAppForm } from "@/hooks/form";
import { cn } from "@/lib/utils";
import { useStore } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";

interface WhitelistMethodsProps {
	portalApplicationId: string;
}

interface MethodEntry {
	id: string;
	serviceId: string;
	serviceName: string;
	serviceDomains: string[];
	svgIcon: string;
	methodName: string;
}

const schema = z.object({
	methods: z.array(
		z.object({
			id: z.string(),
			serviceId: z.string(),
			serviceName: z.string(),
			serviceDomains: z.array(z.string()),
			svgIcon: z.string(),
			methodName: z.string(),
		}),
	),
	selectedServiceId: z.string(),
	methodName: z.string(),
});

export function WhitelistMethodsContent({
	portalApplicationId: _portalApplicationId,
}: WhitelistMethodsProps) {
	const { data: services } = useSuspenseQuery(getServicesQuery);
	const [open, setOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");

	const form = useAppForm({
		defaultValues: {
			methods: [] as MethodEntry[],
			selectedServiceId: "",
			methodName: "",
		},
		validators: {
			onBlur: schema,
		},
		onSubmit: async ({ value }) => {
			console.log("Saving whitelisted methods:", value.methods);
		},
	});

	const handleServiceSelect = (serviceId: string) => {
		form.setFieldValue("selectedServiceId", serviceId);
		setOpen(false);
		setSearchValue("");
	};

	const handleAddMethod = () => {
		const selectedServiceId = form.getFieldValue("selectedServiceId");
		const methodName = form.getFieldValue("methodName");

		if (selectedServiceId && methodName.trim()) {
			const service = services?.find((s) => s.serviceId === selectedServiceId);
			if (service) {
				const methodEntry: MethodEntry = {
					id: Math.random().toString(36).substr(2, 9),
					serviceId: service.serviceId,
					serviceName: service.serviceName,
					serviceDomains: service.serviceDomains,
					svgIcon: service.svgIcon || "",
					methodName: methodName.trim(),
				};

				const currentMethods = form.getFieldValue("methods");
				form.setFieldValue("methods", [...currentMethods, methodEntry]);
				form.setFieldValue("selectedServiceId", "");
				form.setFieldValue("methodName", "");
			}
		}
	};

	const handleRemoveMethod = (id: string) => {
		const currentMethods = form.getFieldValue("methods");
		const updatedMethods = currentMethods.filter(
			(method: MethodEntry) => method.id !== id,
		);
		form.setFieldValue("methods", updatedMethods);
	};

	const handleCopyMethod = (methodName: string) => {
		navigator.clipboard.writeText(methodName);
	};

	const handleSave = () => {
		form.handleSubmit();
	};

	const handleDiscard = () => {
		form.setFieldValue("methods", []);
		form.setFieldValue("selectedServiceId", "");
		form.setFieldValue("methodName", "");
	};

	const methods = useStore(form.store, (state) => state.values.methods);
	const selectedServiceId = useStore(
		form.store,
		(state) => state.values.selectedServiceId,
	);
	const methodName = useStore(form.store, (state) => state.values.methodName);

	const selectedService = services?.find(
		(s) => s.serviceId === selectedServiceId,
	);

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="mb-6 p-6 border-b border-gray-700">
				<SectionHeader
					title="Whitelist Methods"
					description="Limits requests to use specific RPC methods."
				/>
			</div>

			<div className="flex-1 p-6 overflow-y-auto">
				{/* Add Method Input */}
				<div className="mb-6">
					<div className="flex gap-3">
						{/* Service Selection */}
						<div className="flex-1">
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
											{selectedService
												? selectedService.serviceName
												: "Search Service"}
										</div>
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0 bg-gray-800 border-gray-600">
									<Command>
										<CommandInput
											placeholder="Search Service..."
											value={searchValue}
											onValueChange={setSearchValue}
										/>
										<CommandList>
											<CommandEmpty>No service found.</CommandEmpty>
											<CommandGroup>
												{services?.map((service) => (
													<CommandItem
														key={service.serviceId}
														value={service.serviceName}
														onSelect={() =>
															handleServiceSelect(service.serviceId)
														}
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
																selectedServiceId === service.serviceId
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

						{/* Method Name Input */}
						<div className="flex-1">
							<Input
								value={methodName}
								onChange={(e) =>
									form.setFieldValue("methodName", e.target.value)
								}
								placeholder="Method Name"
								className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
							/>
						</div>

						{/* Add Button */}
						<Button
							onClick={handleAddMethod}
							disabled={!selectedServiceId || !methodName.trim()}
							className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add
						</Button>
					</div>
				</div>

				{/* Methods List */}
				<div className="space-y-4 mb-6">
					{methods.map((method: MethodEntry) => (
						<div
							key={method.id}
							className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
						>
							{/* Service Icon */}
							<div className="flex-shrink-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
								<span className="text-white text-lg">{method.svgIcon}</span>
							</div>

							{/* Service Info */}
							<div className="flex-1 min-w-0">
								<div className="text-white font-medium">
									{method.serviceName}
								</div>
								<div className="text-gray-400 text-sm">
									{method.serviceName}
								</div>
							</div>

							{/* Method Name */}
							<div className="flex-1 min-w-0">
								<div className="text-white font-mono text-sm break-all">
									{method.methodName}
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleCopyMethod(method.methodName)}
									className="text-gray-400 hover:text-white hover:bg-gray-700"
								>
									<Copy className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleRemoveMethod(method.id)}
									className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}

					{/* Empty State */}
					{methods.length === 0 && (
						<div className="text-center py-8 text-gray-400">
							<p>No methods added yet.</p>
							<p className="text-sm mt-1">
								Add a service and method name above to get started.
							</p>
						</div>
					)}
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
						disabled={methods.length === 0}
						className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
}
