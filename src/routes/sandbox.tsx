import { CopyableInput } from "@/components/CopyableInput";
import { HideableInput } from "@/components/HideableInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getApplicationsQuery } from "@/fetching/applications";
import { getNetworksQuery } from "@/fetching/networks";
import { useAppForm } from "@/hooks/form";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { useStore } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import CodeMirror from "@uiw/react-codemirror";
import { Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/sandbox")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const { queryClient } = context;
		const [applications, networks] = await Promise.all([
			queryClient.ensureQueryData(getApplicationsQuery),
			queryClient.ensureQueryData(getNetworksQuery),
		]);
		return { applications, networks };
	},
});

const schema = z.object({
	application: z.string().min(1, "Application is required"),
	chain: z.string().min(1, "Chain is required"),
	method: z.string().min(1, "Method is required"),
	path: z.string().min(1, "Path is required"),
	includeSecretKey: z.boolean(),
	endpointUrl: z.string().min(1, "Endpoint URL is required"),
	headers: z
		.object({
			"Content-Type": z.string().min(1, "Content-Type is required"),
			Authorization: z.string().optional(),
		})
		.passthrough(),
	body: z.string(),
	bodyContentType: z.string().min(1, "Body content type is required"),
});

type Headers = z.infer<typeof schema>["headers"];

function RouteComponent() {
	return (
		<>
			<h1 className="text-2xl font-bold mb-6">Sandbox</h1>
			<FormComponent />
		</>
	);
}

const getEndpointUrl = (chain: string, application: string) => {
	return `https://${chain}.rpc.grove.city/v1/${application}`;
};

const FormComponent = () => {
	const { data: applications } = useSuspenseQuery(getApplicationsQuery);
	const { data: networks } = useSuspenseQuery(getNetworksQuery);
	const [response, setResponse] = useState(null);
	const form = useAppForm({
		listeners: {
			onChange: (value) => {
				if (
					value.fieldApi.name === "chain" ||
					value.fieldApi.name === "application"
				) {
					const chain = form.getFieldValue("chain");
					const application = form.getFieldValue("application");
					form.setFieldValue("endpointUrl", getEndpointUrl(chain, application));
				}
			},
		},
		defaultValues: {
			application: applications?.[0]?.portalApplicationId ?? "",
			chain: networks?.[0]?.value ?? "",
			endpointUrl: getEndpointUrl(
				networks?.[0]?.value ?? "",
				applications?.[0]?.portalApplicationId ?? "",
			),
			method: "POST",
			path: "/",
			includeSecretKey: false,
			headers: {
				"Content-Type": "application/json",
			} as Headers,
			body: `{
 "method": "eth_blockNumber",
 "params": [],
 "id": 1,
 "jsonrpc": "2.0"
}`,
			bodyContentType: "JSON",
		},
		validators: {
			onBlur: schema,
		},
		onSubmit: async ({ value }) => {
			// perform request
			const response = await fetch(endpointUrl, {
				method: value.method,
				body: value.body,
				headers: value.headers as HeadersInit,
			});
			const data = await response.json();
			setResponse(data);
			// show success toast
			toast.success("Request sent successfully!");
		},
	});

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const secretKey = useMemo(() => "abcdefghijklmnopqrstuvwxyz", []);

	const endpointUrl = useStore(form.store, (state) => state.values.endpointUrl);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="max-w-4xl mx-auto p-6 space-y-6"
		>
			{/* Top Row */}
			<div className="flex items-center gap-4">
				<form.AppField name="application">
					{(field) => (
						<field.Select
							label="Application"
							values={
								applications?.map((application) => ({
									label: application.portalApplicationName ?? "",
									value: application.portalApplicationId,
								})) ?? []
							}
							placeholder="Application"
						/>
					)}
				</form.AppField>

				<form.AppField name="chain">
					{(field) => (
						<field.Select
							label="Chain"
							values={
								networks?.map((network) => ({
									label: network.label,
									value: network.value,
								})) ?? []
							}
							placeholder="Chain"
						/>
					)}
				</form.AppField>

				<form.AppField name="method">
					{(field) => (
						<field.Select
							label="Method"
							values={[
								{ label: "GET", value: "GET" },
								{ label: "POST", value: "POST" },
							]}
							placeholder="Method"
						/>
					)}
				</form.AppField>

				<form.AppForm>
					<form.SubscribeButton label="Send Request" />
				</form.AppForm>
			</div>

			{/* Endpoint URL Section */}
			<div className="space-y-2">
				<Label htmlFor="endpoint-url">Endpoint URL</Label>
				<CopyableInput id="endpoint-url" value={endpointUrl} />
			</div>

			{/* Path Section */}
			<form.AppField name="path">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor="path">Path</Label>
						<Input
							id="path"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
						/>
					</div>
				)}
			</form.AppField>

			{/* Header Section */}
			<div className="space-y-4">
				<Label>Header</Label>

				<form.AppField name="includeSecretKey">
					{(field) => (
						<div className="flex items-center space-x-2">
							<Switch
								id="include-secret"
								checked={field.state.value}
								onCheckedChange={(checked) => {
									field.handleChange(checked);
									if (checked) {
										form.setFieldValue("headers", {
											"Content-Type": "application/json",
											Authorization: secretKey,
										});
									} else {
										form.setFieldValue("headers", {
											"Content-Type": "application/json",
										});
									}
								}}
								onBlur={field.handleBlur}
							/>
							<Label htmlFor="include-secret" className="whitespace-nowrap">
								Include secret key
							</Label>
							<HideableInput className="ml-8 w-full" value={secretKey} />
						</div>
					)}
				</form.AppField>

				<form.AppField name="headers">
					{(field) => (
						<div className="relative">
							<CodeMirror
								value={JSON.stringify(field.state.value, null, 2)}
								extensions={[json()]}
								theme={oneDark}
								className="rounded-md border"
								readOnly
							/>
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-2 right-2 h-8 w-8"
								type="button"
								onClick={() =>
									copyToClipboard(JSON.stringify(field.state.value, null, 2))
								}
							>
								<Copy className="h-4 w-4" />
							</Button>
						</div>
					)}
				</form.AppField>
			</div>

			{/* Body Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label>Body</Label>
				</div>

				<form.AppField name="body">
					{(field) => (
						<div className="relative">
							<CodeMirror
								value={field.state.value}
								onChange={(value) => field.handleChange(value)}
								extensions={[json()]}
								theme={oneDark}
								minHeight="60px"
								className="rounded-md border"
							/>
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-2 right-2 h-8 w-8"
								onClick={() => copyToClipboard(field.state.value)}
								type="button"
							>
								<Copy className="h-4 w-4" />
							</Button>
						</div>
					)}
				</form.AppField>
			</div>

			{/* Response Section */}
			{response && (
				<div className="space-y-4">
					<Label>Response</Label>
					<CodeMirror
						value={JSON.stringify(response, null, 2)}
						extensions={[json()]}
						theme={oneDark}
						className="rounded-md border"
						readOnly
					/>
				</div>
			)}
		</form>
	);
};
