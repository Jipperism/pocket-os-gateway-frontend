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
import { getApplicationsByApplicationIdQuery } from "@/fetching/applications";
import { getServicesQuery } from "@/fetching/services";
import { useAppForm } from "@/hooks/form";
import { useStore } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";

interface WhitelistContractsProps {
	portalApplicationId: string;
}

interface ContractEntry {
	id: string;
	serviceId: string;
	serviceName: string;
	serviceDomains: string[];
	svgIcon: string;
	contractAddress: string;
}

const schema = z.object({
	contracts: z.array(
		z.object({
			id: z.string(),
			serviceId: z.string(),
			serviceName: z.string(),
			serviceDomains: z.array(z.string()),
			svgIcon: z.string(),
			contractAddress: z.string(),
		}),
	),
	selectedServiceId: z.string(),
	contractAddress: z.string(),
});

export function WhitelistContractsContent({
	portalApplicationId,
}: WhitelistContractsProps) {
	const { data: services } = useSuspenseQuery(getServicesQuery);
	const { data: portalApplication } = useSuspenseQuery(
		getApplicationsByApplicationIdQuery(portalApplicationId),
	);

	const form = useAppForm({
		defaultValues: {
			contracts: [] as ContractEntry[],
			selectedServiceId: "",
			contractAddress: "",
		},
		validators: {
			onBlur: schema,
		},
		onSubmit: async ({ value }) => {
			console.log("Saving whitelisted contracts:", value.contracts);
		},
	});

	const handleServiceSelect = (service: Services) => {
		form.setFieldValue("selectedServiceId", service.serviceId);
	};

	const handleAddContract = () => {
		const selectedServiceId = form.getFieldValue("selectedServiceId");
		const contractAddress = form.getFieldValue("contractAddress");

		if (selectedServiceId && contractAddress.trim()) {
			const service = services?.find((s) => s.serviceId === selectedServiceId);
			if (service) {
				const contractEntry: ContractEntry = {
					id: Math.random().toString(36).substr(2, 9),
					serviceId: service.serviceId,
					serviceName: service.serviceName,
					serviceDomains: service.serviceDomains,
					svgIcon: service.svgIcon || "",
					contractAddress: contractAddress.trim(),
				};

				const currentContracts = form.getFieldValue("contracts");
				form.setFieldValue("contracts", [...currentContracts, contractEntry]);
				form.setFieldValue("selectedServiceId", "");
				form.setFieldValue("contractAddress", "");
			}
		}
	};

	const handleRemoveContract = (id: string) => {
		const currentContracts = form.getFieldValue("contracts");
		const updatedContracts = currentContracts.filter(
			(contract: ContractEntry) => contract.id !== id,
		);
		form.setFieldValue("contracts", updatedContracts);
	};

	const handleSave = () => {
		form.handleSubmit();
	};

	const handleDiscard = () => {
		form.setFieldValue("contracts", []);
		form.setFieldValue("selectedServiceId", "");
		form.setFieldValue("contractAddress", "");
	};

	const contracts = useStore(form.store, (state) => state.values.contracts);
	const selectedServiceId = useStore(
		form.store,
		(state) => state.values.selectedServiceId,
	);
	const contractAddress = useStore(
		form.store,
		(state) => state.values.contractAddress,
	);

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="mb-6 p-6 border-b border-gray-700">
				<SectionHeader
					title={`Whitelist Contracts for ${portalApplication?.portalApplicationName}`}
					description="Limits requests to the smart contract addresses specified."
				/>
			</div>

			<div className="flex-1 p-6 overflow-y-auto">
				{/* Add Contract Input */}
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

						{/* Contract Address Input */}
						<div className="flex-1">
							<Input
								value={contractAddress}
								onChange={(e) =>
									form.setFieldValue("contractAddress", e.target.value)
								}
								placeholder="Contract Address"
								className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
							/>
						</div>

						{/* Add Button */}
						<Button
							onClick={handleAddContract}
							disabled={!selectedServiceId || !contractAddress.trim()}
							className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add
						</Button>
					</div>
				</div>

				{/* Contracts List */}
				<div className="space-y-4 mb-6">
					{contracts.map((contract: ContractEntry) => (
						<Item key={contract.id} variant="outline">
							<ItemMedia variant="icon">
								<div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
									<span className="text-white text-lg">{contract.svgIcon}</span>
								</div>
							</ItemMedia>

							<ItemContent>
								<ItemTitle className="text-white">
									{contract.serviceName}
								</ItemTitle>
								<ItemDescription className="text-gray-400">
									{contract.serviceName}
								</ItemDescription>
							</ItemContent>

							<div className="flex-1 min-w-0">
								<div className="text-white font-mono text-sm break-all">
									{contract.contractAddress}
								</div>
							</div>

							<ItemActions>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleRemoveContract(contract.id)}
									className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</ItemActions>
						</Item>
					))}

					{/* Empty State */}
					{contracts.length === 0 && (
						<div className="text-center py-8 text-gray-400">
							<p>No contracts added yet.</p>
							<p className="text-sm mt-1">
								Add a service and contract address above to get started.
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
						disabled={contracts.length === 0}
						className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
}
