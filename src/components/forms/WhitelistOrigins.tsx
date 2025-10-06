"use client";

import { Copy, Plus, Trash2 } from "lucide-react";
import type { KeyboardEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApplicationsByApplicationIdQuery } from "@/fetching/applications";
import { useAppForm } from "@/hooks/form";
import { useStore } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";

interface WhitelistOriginsProps {
	portalApplicationId: string;
}

interface Origin {
	id: string;
	value: string;
}

const schema = z.object({
	origins: z.array(
		z.object({
			id: z.string(),
			value: z.string(),
		}),
	),
	newOrigin: z.string(),
});

export function WhitelistOriginsContent({
	portalApplicationId,
}: WhitelistOriginsProps) {
	const { data: portalApplication } = useSuspenseQuery(
		getApplicationsByApplicationIdQuery(portalApplicationId),
	);
	const form = useAppForm({
		defaultValues: {
			origins: [] as Origin[],
			newOrigin: "",
		},
		validators: {
			onBlur: schema,
		},
		onSubmit: async ({ value }) => {
			console.log("Saving origins:", value.origins);
		},
	});

	const handleAddOrigin = () => {
		const currentNewOrigin = form.getFieldValue("newOrigin");
		if (currentNewOrigin.trim()) {
			const origin: Origin = {
				id: Math.random().toString(36).substr(2, 9),
				value: currentNewOrigin.trim(),
			};
			const currentOrigins = form.getFieldValue("origins");
			form.setFieldValue("origins", [...currentOrigins, origin]);
			form.setFieldValue("newOrigin", "");
		}
	};

	const handleRemoveOrigin = (id: string) => {
		const currentOrigins = form.getFieldValue("origins");
		const updatedOrigins = currentOrigins.filter(
			(origin: Origin) => origin.id !== id,
		);
		form.setFieldValue("origins", updatedOrigins);
	};

	const handleCopyOrigin = (origin: string) => {
		navigator.clipboard.writeText(origin);
	};

	const handleSave = () => {
		form.handleSubmit();
	};

	const handleDiscard = () => {
		form.setFieldValue("origins", []);
		form.setFieldValue("newOrigin", "");
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			handleAddOrigin();
		}
	};

	const origins = useStore(form.store, (state) => state.values.origins);

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between mb-6 p-6 border-b border-gray-700">
				<div>
					<h2 className="text-2xl font-bold text-white">
						Whitelist Origins for {portalApplication?.portalApplicationName}
					</h2>
					<p className="text-gray-300 text-sm mt-1">
						Limits requests to only the HTTP Origins specified.
					</p>
				</div>
			</div>

			<div className="flex-1 p-6 overflow-y-auto">
				{/* Add Origin Input */}
				<div className="mb-6">
					<form.AppField name="newOrigin">
						{(field) => (
							<div className="flex gap-3">
								<Input
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onKeyDown={handleKeyDown}
									onBlur={field.handleBlur}
									placeholder="Type the origin here, then click 'Add+'"
									className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
								/>
								<Button
									onClick={handleAddOrigin}
									disabled={!field.state.value.trim()}
									className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
								>
									<Plus className="h-4 w-4 mr-2" />
									Add
								</Button>
							</div>
						)}
					</form.AppField>
				</div>

				{/* Origins List */}
				<div className="space-y-4 mb-6">
					{origins.map((origin: Origin) => (
						<div
							key={origin.id}
							className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
						>
							{/* Origin Icon */}
							<div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
								<span className="text-white text-lg font-bold">O</span>
							</div>

							{/* Origin Value */}
							<div className="flex-1 min-w-0">
								<div className="text-white font-medium break-all">
									{origin.value}
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleCopyOrigin(origin.value)}
									className="text-gray-400 hover:text-white hover:bg-gray-700"
								>
									<Copy className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleRemoveOrigin(origin.id)}
									className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}

					{/* Empty State */}
					{form.getFieldValue("origins").length === 0 && (
						<div className="text-center py-8 text-gray-400">
							<p>No origins added yet.</p>
							<p className="text-sm mt-1">
								Add an origin above to get started.
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
						disabled={form.getFieldValue("origins").length === 0}
						className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
}
