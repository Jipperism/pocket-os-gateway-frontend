import { Separator } from "@/components/ui/separator";
import { useAppForm } from "@/hooks/form";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/applications/create")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<h1 className="text-2xl font-bold">Create your application</h1>
			<div>
				An application is a unified environment that simplifies decentralized
				cloud infrastructure. Within its seamless framework lie preconfigured
				networks, ready for deployment with optimal visualization and
				configuration.
			</div>
			<Separator className="my-4" />
			<ApplicationCreateForm />
		</>
	);
}

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	appmoji: z.string().min(1, "Appmoji is required"),
});

function ApplicationCreateForm() {
	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
			appmoji: "",
		},
		validators: {
			onBlur: schema,
		},
		onSubmit: ({ value }) => {
			console.log(value);
			// Show success message
			alert("Form submitted successfully!");
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			<form.AppField name="name">
				{(field) => <field.TextField label="Name" subLabel="Required" />}
			</form.AppField>

			<form.AppField name="description">
				{(field) => (
					<field.TextArea
						label="Description"
						subLabel="Optional, but it can be helpful to offer additional context about your application."
					/>
				)}
			</form.AppField>

			<form.AppField name="appmoji">
				{(field) => (
					<field.EmojiPicker
						label="Appmoji"
						subLabel="Select an emoji icon for your application - a personal touch for quick recognition in the dashboard, particularly in a collapsed side panel view."
					/>
				)}
			</form.AppField>

			<div className="flex justify-end">
				<form.AppForm>
					<form.SubscribeButton label="Create Application" />
				</form.AppForm>
			</div>
		</form>
	);
}
