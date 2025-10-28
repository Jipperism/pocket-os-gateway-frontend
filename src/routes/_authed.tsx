import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
	beforeLoad: ({ context }) => {
		console.log("context", context);
		if (!context.portalUserId) {
			console.log("not authenticated");
			throw new Error("Not authenticated");
		}
	},
	errorComponent: ({ error }) => {
		if (error.message === "Not authenticated") {
			return (
				<div className="flex items-center justify-center p-12">
					<SignIn routing="hash" forceRedirectUrl={window.location.href} />
				</div>
			);
		}

		throw error;
	},
});
