import {
	ProgressProvider as BProgressProvider,
	useProgress,
} from "@bprogress/react";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

function ProgressProviderInner({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { start, stop } = useProgress();

	useEffect(() => {
		const unsubscribe = router.subscribe("onBeforeLoad", () => {
			console.log("[BProgress] onBeforeLoad");
			start();
		});

		const unsubscribeLoad = router.subscribe("onLoad", () => {
			console.log("[BProgress] onLoad");
			stop();
		});

		return () => {
			unsubscribe();
			unsubscribeLoad();
		};
	}, [router, start, stop]);

	return children;
}

export const ProgressProvider = ({
	children,
}: { children: React.ReactNode }) => {
	return (
		<BProgressProvider
			options={{
				showSpinner: false,
			}}
		>
			<ProgressProviderInner>{children}</ProgressProviderInner>
		</BProgressProvider>
	);
};
