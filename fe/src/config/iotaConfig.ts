import { createNetworkConfig } from "@iota/dapp-kit";
import { getFullnodeUrl } from "@iota/iota-sdk/client";

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
	local: {
		url: getFullnodeUrl("localnet"),
	},
	testnet: {
		url: getFullnodeUrl("testnet"),
	},
});

export { networkConfig, useNetworkVariable, useNetworkVariables };
