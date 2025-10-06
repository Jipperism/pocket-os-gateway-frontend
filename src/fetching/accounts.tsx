import { USE_DUMMY_DATA } from "@/lib/constants";
import { queryOptions } from "@tanstack/react-query";
import { type PortalAccounts, PortalAccountsApi } from "./api";

const dummyAccount: PortalAccounts = {
	portalAccountId: "550e8400-e29b-41d4-a716-446655440000",
	organizationId: 1,
	portalPlanType: "enterprise",
	userAccountName: "Pocket Gateway Account",
	internalAccountName: "pocket-gateway-account",
	portalAccountUserLimit: 10000,
	portalAccountUserLimitInterval: "month",
	portalAccountUserLimitRps: 1000,
	billingType: "stripe",
	stripeSubscriptionId: "sub_1234567890",
	gcpAccountId: "gcp-account-123",
	gcpEntitlementId: "entitlement-456",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-20T14:45:00Z",
};

const accountFetcher = async (accountId: string) => {
	if (USE_DUMMY_DATA) {
		return dummyAccount;
	}
	const api = new PortalAccountsApi();
	const accounts = await api.portalAccountsGet({
		portalAccountId: accountId,
	});
	return accounts?.[0] ?? dummyAccount;
};

export const getAccountQuery = queryOptions({
	queryKey: ["account", "accountId"],
	queryFn: ({ queryKey }) => accountFetcher(queryKey[1] as string),
});

export const getAccountByAccountIdQuery = (accountId: string) =>
	queryOptions({
		queryKey: ["account", accountId],
		queryFn: () => accountFetcher(accountId),
	});
