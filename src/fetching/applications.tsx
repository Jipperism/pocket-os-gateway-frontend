import { USE_DUMMY_DATA } from "@/lib/constants";
import { queryOptions } from "@tanstack/react-query";
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
	{
		portalApplicationId: "550e8400-e29b-41d4-a716-446655440003",
		portalAccountId: "550e8400-e29b-41d4-a716-446655440000",
		portalApplicationName: "Analytics Tracker",
		emoji: "📊",
		portalApplicationUserLimit: 2000,
		portalApplicationUserLimitInterval: "year",
		portalApplicationUserLimitRps: 200,
		portalApplicationDescription:
			"Advanced analytics and metrics tracking for business intelligence",
		favoriteServiceIds: ["analytics-api", "metrics-api", "reporting-api"],
		secretKeyHash: "hashed_analytics_key_456",
		secretKeyRequired: true,
		deletedAt: undefined,
		createdAt: "2024-01-05T08:00:00Z",
		updatedAt: "2024-01-22T11:30:00Z",
	},
	{
		portalApplicationId: "550e8400-e29b-41d4-a716-446655440004",
		portalAccountId: "550e8400-e29b-41d4-a716-446655440000",
		portalApplicationName: "E-commerce API",
		emoji: "🛒",
		portalApplicationUserLimit: 1500,
		portalApplicationUserLimitInterval: "month",
		portalApplicationUserLimitRps: 150,
		portalApplicationDescription:
			"Comprehensive e-commerce API with payment processing and inventory management",
		favoriteServiceIds: ["payment-api", "inventory-api", "shipping-api"],
		secretKeyHash: "hashed_ecommerce_key_789",
		secretKeyRequired: true,
		deletedAt: undefined,
		createdAt: "2024-01-12T14:20:00Z",
		updatedAt: "2024-01-19T09:30:00Z",
	},
	{
		portalApplicationId: "550e8400-e29b-41d4-a716-446655440005",
		portalAccountId: "550e8400-e29b-41d4-a716-446655440000",
		portalApplicationName: "Social Media Aggregator",
		emoji: "📱",
		portalApplicationUserLimit: 300,
		portalApplicationUserLimitInterval: "day",
		portalApplicationUserLimitRps: 30,
		portalApplicationDescription:
			"Social media content aggregation and sentiment analysis platform",
		favoriteServiceIds: ["twitter-api", "instagram-api", "sentiment-api"],
		secretKeyHash: undefined,
		secretKeyRequired: false,
		deletedAt: undefined,
		createdAt: "2024-01-08T11:45:00Z",
		updatedAt: "2024-01-17T13:15:00Z",
	},
	{
		portalApplicationId: "550e8400-e29b-41d4-a716-446655440006",
		portalAccountId: "550e8400-e29b-41d4-a716-446655440000",
		portalApplicationName: "IoT Device Manager",
		emoji: "🏠",
		portalApplicationUserLimit: 5000,
		portalApplicationUserLimitInterval: "year",
		portalApplicationUserLimitRps: 500,
		portalApplicationDescription:
			"Internet of Things device management and monitoring system",
		favoriteServiceIds: ["iot-api", "device-api", "monitoring-api"],
		secretKeyHash: "hashed_iot_key_abc",
		secretKeyRequired: true,
		deletedAt: undefined,
		createdAt: "2024-01-03T07:00:00Z",
		updatedAt: "2024-01-21T16:45:00Z",
	},
	{
		portalApplicationId: "550e8400-e29b-41d4-a716-446655440007",
		portalAccountId: "550e8400-e29b-41d4-a716-446655440000",
		portalApplicationName: "Test App (Deleted)",
		emoji: "🗑️",
		portalApplicationUserLimit: 100,
		portalApplicationUserLimitInterval: "day",
		portalApplicationUserLimitRps: 10,
		portalApplicationDescription:
			"This application was deleted for testing purposes",
		favoriteServiceIds: [],
		secretKeyHash: undefined,
		secretKeyRequired: false,
		deletedAt: "2024-01-25T12:00:00Z",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-25T12:00:00Z",
	},
];

const applicationsFetcher = async (accountId: string) => {
	console.log("USE_DUMMY_DATA", USE_DUMMY_DATA);
	if (USE_DUMMY_DATA) {
		return dummyApplications;
	}
	const api = new PortalApplicationsApi();
	const applications = await api.portalApplicationsGet({
		portalAccountId: accountId,
	});
	return applications;
};

export const getApplicationsQuery = queryOptions({
	queryKey: ["applications"],
	queryFn: (context) => applicationsFetcher(context.meta?.accountId as string),
});
