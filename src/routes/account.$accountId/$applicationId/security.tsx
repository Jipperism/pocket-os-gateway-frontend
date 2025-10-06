import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { WhitelistContractsContent } from "@/components/forms/WhitelistContracts";
import { WhitelistMethodsContent } from "@/components/forms/WhitelistMethods";
import { WhitelistOriginsContent } from "@/components/forms/WhitelistOrigins";
import { WhitelistServicesContent } from "@/components/forms/WhitelistServices";
import { WhitelistUserAgentsContent } from "@/components/forms/WhitelistUserAgents";

export const Route = createFileRoute(
	"/account/$accountId/$applicationId/security",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const [secretKeyRequired, setSecretKeyRequired] = useState(false);
	const { applicationId } = Route.useParams();

	return (
		<div className="p-6 space-y-6">
			{/* Secret Key Required Section */}
			<div className="space-y-3">
				<h3 className="text-lg font-semibold">Secret Key Required</h3>
				<p className="text-gray-400 text-sm">
					To maximize the security of your application, you should activate the
					private secret key for all requests and enable the use of whitelisted
					user-agents and origins.
				</p>
				<Switch
					checked={secretKeyRequired}
					onCheckedChange={setSecretKeyRequired}
				/>
			</div>

			<Separator />

			{/* Whitelist Services Section */}
			<div className="space-y-3">
				<h3 className="text-lg font-semibold">Whitelist Services</h3>
				<p className="text-gray-400 text-sm">
					Limit the services that can be used for this application.
				</p>
				<Drawer direction="right">
					<DrawerTrigger asChild>
						<Button type="button" variant="outline">
							Add +
						</Button>
					</DrawerTrigger>
					<DrawerContent className="!w-fit !max-w-fit">
						<WhitelistServicesContent portalApplicationId={applicationId} />
					</DrawerContent>
				</Drawer>
			</div>

			<Separator />

			{/* Whitelist User-Agents Section */}
			<div className="space-y-3">
				<h3 className="text-lg font-semibold">Whitelist User-Agents</h3>
				<p className="text-gray-400 text-sm">
					Limits requests to only the HTTP User-Agents specified. If nothing is
					specified, all User-Agents will be accepted.
				</p>
				<Drawer direction="right">
					<DrawerTrigger asChild>
						<Button type="button" variant="outline">
							Add +
						</Button>
					</DrawerTrigger>
					<DrawerContent className="!w-fit !max-w-fit">
						<WhitelistUserAgentsContent portalApplicationId={applicationId} />
					</DrawerContent>
				</Drawer>
			</div>

			<Separator />

			{/* Whitelist Origins Section */}
			<div className="space-y-3">
				<h3 className="text-lg font-semibold">Whitelist Origins</h3>
				<p className="text-gray-400 text-sm">
					Limits requests to only the HTTP Origins specified.
				</p>
				<Drawer direction="right">
					<DrawerTrigger asChild>
						<Button type="button" variant="outline">
							Add +
						</Button>
					</DrawerTrigger>
					<DrawerContent className="!w-fit !max-w-fit">
						<WhitelistOriginsContent portalApplicationId={applicationId} />
					</DrawerContent>
				</Drawer>
			</div>

			<Separator />

			{/* Whitelist Contracts Section */}
			<div className="space-y-3">
				<h3 className="text-lg font-semibold">Whitelist Contracts</h3>
				<p className="text-gray-400 text-sm">
					Limits requests to the smart contract addresses specified.
				</p>
				<Drawer direction="right">
					<DrawerTrigger asChild>
						<Button type="button" variant="outline">
							Add +
						</Button>
					</DrawerTrigger>
					<DrawerContent className="!w-fit !max-w-fit">
						<WhitelistContractsContent portalApplicationId={applicationId} />
					</DrawerContent>
				</Drawer>
			</div>

			<Separator />

			{/* Whitelist Methods Section */}
			<div className="space-y-3">
				<h3 className="text-lg font-semibold">Whitelist Methods</h3>
				<p className="text-gray-400 text-sm">
					Limits requests to use specific RPC methods.
				</p>
				<Drawer direction="right">
					<DrawerTrigger asChild>
						<Button type="button" variant="outline">
							Add +
						</Button>
					</DrawerTrigger>
					<DrawerContent className="!w-fit !max-w-fit">
						<WhitelistMethodsContent portalApplicationId={applicationId} />
					</DrawerContent>
				</Drawer>
			</div>
		</div>
	);
}
