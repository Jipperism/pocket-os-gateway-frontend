import { USE_DUMMY_DATA } from "@/lib/constants";
import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { type PortalApplications, PortalApplicationsApi } from "./api";

const dummyApplications: PortalApplications[] = [
	{
		portalApplicationId: "550e8400-e29b-41d4-a716-446655440001",
		portalAccountId: "550e8400-e29b-41d4-a716-446655440000",
		portalApplicationName: "Pokemon API Gateway",
		emoji: "⚡",
		portalApplicationUserLimit: 1000,
		portalApplicationUserLimitInterval: "month",
		portalApplicationUserLimitRps: 100,
		portalApplicationDescription:
			"High-performance API gateway for Pokemon data with rate limiting and caching",
		favoriteServiceIds: ["pokemon-api", "weather-api", "location-api"],
		secretKeyHash: "hashed_secret_key_123",
		secretKeyRequired: true,
		deletedAt: undefined,
		createdAt: "2024-01-15T10:30:00Z",
		updatedAt: "2024-01-20T14:45:00Z",
	},
	{
		portalApplicationId: "550e8400-e29b-41d4-a716-446655440002",
		portalAccountId: "550e8400-e29b-41d4-a716-446655440000",
		portalApplicationName: "Weather Dashboard",
		emoji: "🌤️",
		portalApplicationUserLimit: 500,
		portalApplicationUserLimitInterval: "day",
		portalApplicationUserLimitRps: 50,
		portalApplicationDescription:
			"Real-time weather data aggregation service with advanced forecasting",
		favoriteServiceIds: ["weather-api", "forecast-api"],
		secretKeyHash: undefined,
		secretKeyRequired: false,
		deletedAt: undefined,
		createdAt: "2024-01-10T09:15:00Z",
		updatedAt: "2024-01-18T16:20:00Z",
	},
];

const applicationsForaccountIdFetcher = async (accountId: string) => {
	if (USE_DUMMY_DATA) {
		return dummyApplications;
	}
	const api = new PortalApplicationsApi();
	const applications = await api.portalApplicationsGet({
		portalAccountId: accountId,
	});
	return applications ?? [];
};

export const getApplicationsForAccountIdQueryQuery = (accountId: string) =>
	queryOptions({
		queryKey: ["applications", accountId],
		queryFn: () => applicationsForaccountIdFetcher(accountId),
	});

export const applicationsByApplicationIdFetcher = async (
	applicationId: string,
) => {
	let result: PortalApplications | undefined;
	if (USE_DUMMY_DATA) {
		result = dummyApplications.find(
			(application) => application.portalApplicationId === applicationId,
		);
	} else {
		const api = new PortalApplicationsApi();
		const application = await api.portalApplicationsGet({
			portalApplicationId: applicationId,
		});
		result = application?.[0];
	}

	if (!result) {
		throw notFound({ data: { entityDescription: "application" } });
	}
	return result;
};

export const getApplicationsByApplicationIdQuery = (applicationId: string) =>
	queryOptions({
		queryKey: ["applications", applicationId],
		queryFn: () => applicationsByApplicationIdFetcher(applicationId),
	});
