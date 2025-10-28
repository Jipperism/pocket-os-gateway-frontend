import { SectionHeader } from "@/components/common/SectionHeader";
import { Separator } from "@/components/ui/separator";
import { useAppForm } from "@/hooks/form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authed/account/$accountId/settings/notifications",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useAppForm({
		defaultValues: {
			alert25: false,
			alert50: false,
			alert75: true,
			alert100: true,
		},
		onSubmit: async ({ value }) => {
			console.log("Saving notification preferences:", value);
			// TODO: Implement API call to save preferences
		},
	})

	const alertOptions = [
		{ field: "alert25", label: "25% of 1M relays per month" },
		{ field: "alert50", label: "50% of 1M relays per month" },
		{ field: "alert75", label: "75% of 1M relays per month" },
		{ field: "alert100", label: "100% of 1M relays per month" },
	] as const;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			<SectionHeader
				title="Usage Alerts"
				description="Set up usage alerts to be warned when you are approaching your monthly relay limits. We will send an email when your usage crosses the thresholds specified below."
			/>

			<div className="space-y-0">
				{alertOptions.map((option, index) => (
					<div key={option.field}>
						<div className="flex items-center justify-between py-4">
							<span className="text-sm text-muted-foreground">
								{option.label}
							</span>
							<form.AppField name={option.field}>
								{(field) => <field.Switch label="" />}
							</form.AppField>
						</div>
						{index < alertOptions.length - 1 && (
							<Separator className="bg-border/50" />
						)}
					</div>
				))}
			</div>

			<div className="flex justify-end">
				<form.AppForm>
					<form.SubscribeButton label="Save Preferences" />
				</form.AppForm>
			</div>
		</form>
	)
}
