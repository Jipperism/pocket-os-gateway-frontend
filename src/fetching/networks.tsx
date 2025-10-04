import { USE_DUMMY_DATA } from "@/lib/constants";
import { queryOptions } from "@tanstack/react-query";
import type { Networks } from "./api";
import { NetworksApi } from "./api/apis/NetworksApi";

const dummyChains: Networks[] = [
	{
		networkId: "1",
	},
	{
		networkId: "137",
	},
	{
		networkId: "56",
	},
];

const networkInfoMap = {
	"1": { label: "Ethereum", value: "ethereum" },
	"137": { label: "Polygon", value: "polygon" },
	"56": { label: "BNB Smart Chain", value: "bsc" },
};

const decorateNetwork = (network: Networks) => {
	const networkInfo =
		networkInfoMap[network.networkId as keyof typeof networkInfoMap];
	if (!networkInfo) {
		console.warn(`Network info not found for network ${network.networkId}`);
		return null;
	}
	return {
		...network,
		...networkInfo,
	};
};

const networksFetcher = async () => {
	const api = new NetworksApi();
	const networks = USE_DUMMY_DATA ? dummyChains : await api.networksGet();
	const decoratedNetworks =
		networks?.map(decorateNetwork).filter((network) => network !== null) ?? [];
	return decoratedNetworks;
};

export const getNetworksQuery = queryOptions({
	queryKey: ["networks"],
	queryFn: networksFetcher,
});
