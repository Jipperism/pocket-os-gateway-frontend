"use client";

import { z } from "zod";

import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form";

const schema = z.object({
	email: z.string().email("Please enter a valid email address"),
	role: z.enum(["member", "admin"], {
		required_error: "Please select a role",
	}),
});

export function InviteMemberContent() {
	const form = useAppForm({
		defaultValues: {
			email: "",
			role: undefined as "member" | "admin" | undefined,
		},
		validators: {
			onBlur: schema,
		},
		onSubmit: async ({ value }) => {
			console.log("Inviting member:", value);
			// TODO: Implement actual API call
			form.reset();
		},
	});

	const handleDiscard = () => {
		form.reset();
	};

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="mb-6 p-6 border-b border-gray-700">
				<SectionHeader
					title="Invite member"
					description="A member is a unique user who can access to your accounts's apps."
				/>
			</div>

			<div className="flex-1 p-6 overflow-y-auto">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-6"
				>
					{/* Email Field */}
					<form.AppField name="email">
						{(field) => (
							<div className="space-y-2">
								<field.TextField
									label="Email address *"
									subLabel="Required"
									placeholder="new@server.com"
								/>
							</div>
						)}
					</form.AppField>

					{/* Role Field */}
					<form.AppField name="role">
						{(field) => (
							<div className="space-y-2">
								<field.Select
									label="Role *"
									values={[
										{ label: "Member", value: "member" },
										{ label: "Admin", value: "admin" },
									]}
									placeholder="Select a role"
								/>
							</div>
						)}
					</form.AppField>
				</form>
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
					<form.AppForm>
						<form.SubscribeButton label="Invite" />
					</form.AppForm>
				</div>
			</div>
		</div>
	);
}
