import { CopyableInput } from "@/components/common/CopyableInput";
import { HideableInput } from "@/components/common/HideableInput";
import { getApplicationsByApplicationIdQuery } from "@/fetching/applications";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/$accountId/$applicationId/keys")(
	{
		component: RouteComponent,
		loader: async ({ params, context }) => {
			context.queryClient.ensureQueryData(
				getApplicationsByApplicationIdQuery(params.applicationId),
			);
		},
	},
);

function RouteComponent() {
	const { applicationId } = Route.useParams();
	const { data: application } = useSuspenseQuery({
		...getApplicationsByApplicationIdQuery(applicationId),
	});

	// Placeholder values - these would come from the API in a real implementation
	const appId = application?.portalApplicationId ?? "";
	const secretKey = application?.secretKeyHash ?? "";

	return (
		<div className="p-6 space-y-8">
			{/* App ID Section */}
			<div className="space-y-3">
				<div>
					<h3 className="text-lg font-semibold">App ID</h3>
					<p className="text-sm text-gray-600">
						Unique identifier for the app. This string is included as part of
						the URL for each endpoint.
					</p>
				</div>
				<CopyableInput value={appId} />
			</div>

			{/* Secret Key Section */}
			<div className="space-y-3">
				<div>
					<h3 className="text-lg font-semibold">Secret Key</h3>
					<p className="text-sm text-gray-600">
						Security feature for apps. If "Private Secret Key Required" is
						selected in the security settings, the secret key will need to be
						sent along with the request using HTTP Basic Authentication.
					</p>
				</div>
				<HideableInput value={secretKey} />
			</div>
		</div>
	);
}
