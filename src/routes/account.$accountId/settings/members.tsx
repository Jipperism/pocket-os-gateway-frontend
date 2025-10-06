import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";
import { User, UserPlus } from "lucide-react";

import { InviteMemberContent } from "@/components/forms/InviteMember";

// Members settings page
export const Route = createFileRoute("/account/$accountId/settings/members")({
	component: RouteComponent,
});

function RouteComponent() {
	// Mock data for demonstration - in a real app this would come from an API
	const members = [
		{
			id: "1",
			email: "jipstavenuitter@gmail.com",
			role: "Owner",
			status: "-",
			avatar: null, // Will use default avatar
		},
	];

	return (
		<div className="p-6 space-y-6">
			{/* Header with Invite Button */}
			<div className="flex items-center justify-between">
				<SectionHeader
					title="Team Members"
					description="Manage your team members and their roles."
				/>
				<Drawer direction="right">
					<DrawerTrigger asChild>
						<Button className="bg-green-600 hover:bg-green-700 text-white">
							<UserPlus className="h-4 w-4 mr-2" />
							Invite new member
						</Button>
					</DrawerTrigger>
					<DrawerContent className="!w-fit !max-w-fit">
						<InviteMemberContent />
					</DrawerContent>
				</Drawer>
			</div>

			<Separator className="bg-gray-700" />

			{/* Members Table */}
			<div className="space-y-4">
				{/* Table Headers */}
				<div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-400">
					<div>Member</div>
					<div>Roles</div>
					<div>Status</div>
				</div>

				<Separator className="bg-gray-700" />

				{/* Member Rows */}
				<div className="space-y-4">
					{members.map((member) => (
						<div
							key={member.id}
							className="grid grid-cols-3 gap-4 items-center"
						>
							{/* Member Column */}
							<div className="flex items-center gap-3">
								<div className="h-8 w-8 rounded bg-gray-600 flex items-center justify-center">
									<User className="h-4 w-4 text-yellow-400" />
								</div>
								<span className="text-gray-300">{member.email}</span>
							</div>

							{/* Roles Column */}
							<div className="text-gray-300">{member.role}</div>

							{/* Status Column */}
							<div className="text-gray-300">{member.status}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
