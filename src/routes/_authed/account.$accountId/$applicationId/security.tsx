import { SectionHeader } from "@/components/common/SectionHeader";
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
	"/_authed/account/$accountId/$applicationId/security",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const [secretKeyRequired, setSecretKeyRequired] = useState(false);
	const { applicationId } = Route.useParams();

	return (
		<div className="p-6 space-y-6">
			{/* Secret Key Required Section */}
			<SectionHeader
				title="Secret Key Required"
				description="To maximize the security of your application, you should activate the private secret key for all requests and enable the use of whitelisted user-agents and origins."
			/>
			<Switch
				checked={secretKeyRequired}
				onCheckedChange={setSecretKeyRequired}
			/>

			<Separator />

			{/* Whitelist Services Section */}
			<SectionHeader
				title="Whitelist Services"
				description="Limit the services that can be used for this application."
			/>
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

			<Separator />

			{/* Whitelist User-Agents Section */}
			<SectionHeader
				title="Whitelist User-Agents"
				description="Limits requests to only the HTTP User-Agents specified. If nothing is specified, all User-Agents will be accepted."
			/>
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

			<Separator />

			{/* Whitelist Origins Section */}
			<SectionHeader
				title="Whitelist Origins"
				description="Limits requests to only the HTTP Origins specified."
			/>
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

			<Separator />

			{/* Whitelist Contracts Section */}
			<SectionHeader
				title="Whitelist Contracts"
				description="Limits requests to the smart contract addresses specified."
			/>
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

			<Separator />

			{/* Whitelist Methods Section */}
			<SectionHeader
				title="Whitelist Methods"
				description="Limits requests to use specific RPC methods."
			/>
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
	)
}
