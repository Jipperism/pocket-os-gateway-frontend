import { Spinner } from "@/components/common/Spinner";
import { SignIn, useAuth } from "@clerk/clerk-react";
import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center p-12 w-full h-full">
				<Spinner />
			</div>
		);
	}

	if (!isSignedIn) {
		return (
			<div className="flex items-center justify-center p-12">
				<SignIn routing="hash" forceRedirectUrl={window.location.href} />
			</div>
		);
	}

	if (isSignedIn) {
		return (
			<Navigate
				to="/account/$accountId/settings/account"
				params={{ accountId: "a3bd0616" }}
			/>
		);
	}
}
