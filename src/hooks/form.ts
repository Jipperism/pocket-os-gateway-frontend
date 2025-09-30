import { createFormHook } from "@tanstack/react-form";

import {
	EmojiPicker,
	Select,
	SubscribeButton,
	TextArea,
	TextField,
} from "../components/FormComponents";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
		Select,
		TextArea,
		EmojiPicker,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});
