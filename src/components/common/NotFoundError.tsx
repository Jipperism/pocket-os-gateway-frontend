import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";

export function NotFoundError({
	entityDescription,
}: { entityDescription?: string }) {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyTitle className="capitalize">
					{entityDescription || 404} - Not Found
				</EmptyTitle>
				<EmptyDescription>
					The {entityDescription || "page"} you're looking for doesn't exist.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<EmptyDescription>
					Need help? {/* TODO: Add support email */}
					{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
					<a href="#" className="text-primary hover:underline">
						Contact support
					</a>
				</EmptyDescription>
			</EmptyContent>
		</Empty>
	);
}
