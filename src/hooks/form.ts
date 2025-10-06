import { createFormHook } from "@tanstack/react-form";

import {
	EmojiPicker,
	Select,
	SubscribeButton,
	Switch,
	TextArea,
	TextField,
} from "@/components/forms/FormComponents";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
		Select,
		TextArea,
		Switch,
		EmojiPicker,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});
