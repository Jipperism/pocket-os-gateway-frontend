import { auth, clerkClient } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import jwt from "jsonwebtoken";

export const fetchPortalUser = createServerFn({ method: "POST" }).handler(
	async () => {
		const DB_JWT_AUD = process.env.DB_JWT_AUD || "postgrest";
		if (!DB_JWT_AUD) {
			throw new Error("DB_JWT_AUD is not set");
		}

		const DB_JWT_SECRET = process.env.DB_JWT_SECRET;
		if (!DB_JWT_SECRET) {
			throw new Error("DB_JWT_SECRET is not set");
		}

		const PORTAL_API_ENDPOINT = process.env.PORTAL_API_ENDPOINT;
		if (!PORTAL_API_ENDPOINT) {
			throw new Error("PORTAL_API_ENDPOINT is not set");
		}

		try {
			// 1) Verify Clerk session
			const { userId, sessionId, sessionClaims } = await auth();
			if (!userId || !sessionId) {
				// throw new Error("Unauthorized");
				return { token: null, portalUserId: null };
			}

			// Try to get email from claims first; if missing, fetch user
			let email = (sessionClaims?.email as string) || "";
			if (!email) {
				const user = await clerkClient().users.getUser(userId);
				email = user?.primaryEmailAddress?.emailAddress || "";
			}

			// 2) Create admin token to call the RPC endpoint
			const adminToken = jwt.sign(
				{
					role: "portal_db_admin",
					aud: DB_JWT_AUD,
				},
				DB_JWT_SECRET,
				{ algorithm: "HS256", expiresIn: "5m" },
			);

			// 3) Call ensure_portal_user RPC endpoint
			const rpcResponse = await fetch(
				`${process.env.PORTAL_API_ENDPOINT}/rpc/ensure_portal_user`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Accept-Profile": "api",
						Authorization: `Bearer ${adminToken}`,
					},
					body: JSON.stringify({
						p_email: email,
						p_auth_provider: "clerk",
						p_auth_type: "clerk_google",
						p_auth_provider_user_id: userId,
						p_federated: false,
					}),
				},
			);

			if (!rpcResponse.ok) {
				throw new Error(
					`RPC call failed: ${rpcResponse.status} ${rpcResponse.statusText}`,
				);
			}

			const rpcData = await rpcResponse.json();
			if (
				!Array.isArray(rpcData) ||
				rpcData.length === 0 ||
				!rpcData[0]?.portal_user_id
			) {
				throw new Error("RPC did not return a valid portal_user_id");
			}
			const { portal_user_id } = rpcData[0]; // The RPC returns the portal_user_id
			// 4) Mint JWT for authenticated user with portal_user_id
			const token = jwt.sign(
				{
					role: "authenticated_user",
					email,
					sub: userId, // Clerk user id; DB maps sub -> portal_user_id via portal_user_auth
					aud: DB_JWT_AUD,
				},
				DB_JWT_SECRET,
				{ algorithm: "HS256", expiresIn: "1h" },
			);

			return { token, portalUserId: portal_user_id };
		} catch (err) {
			console.error(err);
			throw new Error(
				(err as { message?: string })?.message ?? "internal_error",
			);
		}
	},
);
