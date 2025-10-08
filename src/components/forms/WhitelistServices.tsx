"use client";

import { Trash2 } from "lucide-react";
import { z } from "zod";

import { CopyableInput } from "@/components/common/CopyableInput";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ServiceSelector } from "@/components/forms/ServiceSelector";
import { Button } from "@/components/ui/button";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import type { Services } from "@/fetching/api";
import { getApplicationsByApplicationIdQuery } from "@/fetching/applications";
import { useAppForm } from "@/hooks/form";
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
	const { data: portalApplication } = useSuspenseQuery(
		getApplicationsByApplicationIdQuery(portalApplicationId),
	);

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

	const handleServiceSelect = (service: Services) => {
		const currentServices = form.getFieldValue("whitelistedServices");
		const isAlreadyAdded = currentServices.find(
			(ws) => ws.serviceId === service.serviceId,
		);
		if (!isAlreadyAdded) {
			form.setFieldValue("whitelistedServices", [...currentServices, service]);
		}
	};

	const handleRemoveService = (serviceId: string) => {
		const currentServices = form.getFieldValue("whitelistedServices");
		const updatedServices = currentServices.filter(
			(service) => service.serviceId !== serviceId,
		);
		form.setFieldValue("whitelistedServices", updatedServices);
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

	const excludedServices = whitelistedServices.map(
		(service) => service.serviceId,
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
				{/* Service Selector */}
				<div className="mb-6">
					<ServiceSelector
						excludedServices={excludedServices}
						onServiceSelect={handleServiceSelect}
						placeholder="Search Service"
					/>
				</div>

				{/* Services List */}
				<div className="space-y-4 mb-6">
					{whitelistedServices.map((service) => (
						<Item key={service.serviceId} variant="outline">
							<ItemMedia variant="icon">
								<div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
									<span className="text-white text-lg">{service.svgIcon}</span>
								</div>
							</ItemMedia>

							<ItemContent>
								<ItemTitle className="text-white">
									{service.serviceName}
								</ItemTitle>
								<ItemDescription className="text-gray-400">
									{service.serviceName}
								</ItemDescription>
							</ItemContent>

							<div className="flex-1 min-w-0">
								<CopyableInput
									value={service.publicEndpointUrl || ""}
									className="text-white text-sm"
								/>
							</div>

							<ItemActions>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleRemoveService(service.serviceId)}
									className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</ItemActions>
						</Item>
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
