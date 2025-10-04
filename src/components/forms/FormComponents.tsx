import { useStore } from "@tanstack/react-form";

import { useFieldContext, useFormContext } from "@/hooks/form-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as ShadcnSelect from "@/components/ui/select";
import { Slider as ShadcnSlider } from "@/components/ui/slider";
import { Switch as ShadcnSwitch } from "@/components/ui/switch";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import EmojiPickerReact from "emoji-picker-react";
import type React from "react";
import { useState } from "react";

export function SubscribeButton({ label }: { label: string }) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button type="submit" disabled={isSubmitting}>
					{label}
				</Button>
			)}
		</form.Subscribe>
	);
}

function ErrorMessages({
	errors,
}: {
	errors: Array<string | { message: string }>;
}) {
	return (
		<>
			{errors.map((error) => (
				<div
					key={typeof error === "string" ? error : error.message}
					className="text-red-500 mt-1 font-bold"
				>
					{typeof error === "string" ? error : error.message}
				</div>
			))}
		</>
	);
}

export function TextField({
	label,
	subLabel,
	placeholder,
}: {
	label: string;
	subLabel?: string;
	placeholder?: string;
}) {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<div className="flex flex-col gap-2">
			<div>
				<Label htmlFor={label} className="text-lg font-bold">
					{label}
				</Label>
				{subLabel && <SubLabel htmlFor={label}>{subLabel}</SubLabel>}
			</div>
			<Input
				value={field.state.value}
				placeholder={placeholder}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function TextArea({
	label,
	subLabel,
	rows = 3,
}: {
	label: string;
	subLabel?: string;
	rows?: number;
}) {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<div className="flex flex-col gap-2">
			<div>
				<Label htmlFor={label} className="text-lg font-bold">
					{label}
				</Label>
				{subLabel && <SubLabel htmlFor={label}>{subLabel}</SubLabel>}
			</div>
			<ShadcnTextarea
				id={label}
				value={field.state.value}
				onBlur={field.handleBlur}
				rows={rows}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function Select({
	label,
	values,
	placeholder,
	disabled,
}: {
	label: string;
	values: Array<{ label: string; value: string }>;
	placeholder?: string;
	disabled?: boolean;
}) {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<div>
			<ShadcnSelect.Select
				name={field.name}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
				disabled={disabled}
			>
				<ShadcnSelect.SelectTrigger className="w-full">
					<ShadcnSelect.SelectValue placeholder={placeholder} />
				</ShadcnSelect.SelectTrigger>
				<ShadcnSelect.SelectContent>
					<ShadcnSelect.SelectGroup>
						<ShadcnSelect.SelectLabel>{label}</ShadcnSelect.SelectLabel>
						{values.map((value) => (
							<ShadcnSelect.SelectItem key={value.value} value={value.value}>
								{value.label}
							</ShadcnSelect.SelectItem>
						))}
					</ShadcnSelect.SelectGroup>
				</ShadcnSelect.SelectContent>
			</ShadcnSelect.Select>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function Slider({ label }: { label: string }) {
	const field = useFieldContext<number>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<div>
			<Label htmlFor={label} className="mb-2 text-xl font-bold">
				{label}
			</Label>
			<ShadcnSlider
				id={label}
				onBlur={field.handleBlur}
				value={[field.state.value]}
				onValueChange={(value) => field.handleChange(value[0])}
			/>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function Switch({ label }: { label: string }) {
	const field = useFieldContext<boolean>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<div>
			<div className="flex items-center gap-2">
				<ShadcnSwitch
					id={label}
					onBlur={field.handleBlur}
					checked={field.state.value}
					onCheckedChange={(checked) => field.handleChange(checked)}
				/>
				<Label htmlFor={label}>{label}</Label>
			</div>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function EmojiPicker({
	label,
	subLabel,
}: { label: string; subLabel?: string }) {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, (state) => state.meta.errors);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex flex-col gap-2">
			<div>
				<Label htmlFor={label} className="text-lg font-bold">
					{label}
				</Label>
				{subLabel && <SubLabel htmlFor={label}>{subLabel}</SubLabel>}
			</div>
			{isOpen ? (
				<EmojiPickerReact
					onEmojiClick={(value) => {
						console.log("value", value);
						field.handleChange(value.emoji);
						// field.setValue(value.emoji);
						setIsOpen(false);
					}}
				/>
			) : (
				<Button
					className="w-fit"
					variant="outline"
					onClick={() => setIsOpen(true)}
				>
					{field.state.value || "Select Emoji"}
				</Button>
			)}
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
}

const SubLabel = ({
	htmlFor,
	children,
}: React.PropsWithChildren<{ htmlFor: string }>) => {
	return (
		<Label htmlFor={htmlFor} className="text-sm text-gray-500">
			{children}
		</Label>
	);
};
