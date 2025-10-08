"use client";

import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";

import { SectionHeader } from "@/components/common/SectionHeader";
import { ServiceSelector } from "@/components/forms/ServiceSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import type { Services } from "@/fetching/api";
import { getServicesQuery } from "@/fetching/services";
import { useAppForm } from "@/hooks/form";
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

	const handleServiceSelect = (service: Services) => {
		form.setFieldValue("selectedServiceId", service.serviceId);
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
							<ServiceSelector
								selectedServiceId={selectedServiceId}
								onServiceSelect={handleServiceSelect}
								placeholder="Search Service"
							/>
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
						<Item key={method.id} variant="outline">
							<ItemMedia variant="icon">
								<div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
									<span className="text-white text-lg">{method.svgIcon}</span>
								</div>
							</ItemMedia>

							<ItemContent>
								<ItemTitle className="text-white">
									{method.serviceName}
								</ItemTitle>
								<ItemDescription className="text-gray-400">
									{method.serviceName}
								</ItemDescription>
							</ItemContent>

							<div className="flex-1 min-w-0">
								<div className="text-white font-mono text-sm break-all">
									{method.methodName}
								</div>
							</div>

							<ItemActions>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleRemoveMethod(method.id)}
									className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</ItemActions>
						</Item>
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
