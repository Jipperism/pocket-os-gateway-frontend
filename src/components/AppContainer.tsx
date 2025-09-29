export function AppContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen w-full">
			<main className="flex-1 p-4">{children}</main>
		</div>
	);
}
