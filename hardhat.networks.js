const networks = {};
const etherscan = { apiKey: {} };

function register (name, chainId, url, privateKey, etherscanNetworkName, etherscanKey) {
    if (url && privateKey && etherscanKey) {
        networks[name] = {
            url,
            chainId,
            accounts: [privateKey],
        };
        etherscan.apiKey[etherscanNetworkName] = etherscanKey;
        console.log(`Network '${name}' registered`);
    } else {
        console.log(`Network '${name}' not registered`);
    }
}

// register('mainnet', 1, process.env.MAINNET_RPC_URL, process.env.MAINNET_PRIVATE_KEY, 'mainnet', process.env.MAINNET_ETHERSCAN_KEY);
// register('bsc', 56, process.env.BSC_RPC_URL, process.env.BSC_PRIVATE_KEY, 'bsc', process.env.BSC_ETHERSCAN_KEY);
// register('kovan', 42, process.env.KOVAN_RPC_URL, process.env.KOVAN_PRIVATE_KEY, 'kovan', process.env.KOVAN_ETHERSCAN_KEY);
// register('optimistic', 10, process.env.OPTIMISTIC_RPC_URL, process.env.OPTIMISTIC_PRIVATE_KEY, 'optimisticEthereum', process.env.OPTIMISTIC_ETHERSCAN_KEY);
// register('matic', 137, process.env.MATIC_RPC_URL, process.env.MATIC_PRIVATE_KEY, 'polygon', process.env.MATIC_ETHERSCAN_KEY);
// register('arbitrum', 42161, process.env.ARBITRUM_RPC_URL, process.env.ARBITRUM_PRIVATE_KEY, 'arbitrumOne', process.env.ARBITRUM_ETHERSCAN_KEY);
// register('xdai', 100, process.env.XDAI_RPC_URL, process.env.XDAI_PRIVATE_KEY, 'xdai', process.env.XDAI_ETHERSCAN_KEY);
// register('avax', 43114, process.env.AVAX_RPC_URL, process.env.AVAX_PRIVATE_KEY, 'avalanche', process.env.AVAX_ETHERSCAN_KEY);
// register('fantom', 250, process.env.FANTOM_RPC_URL, process.env.FANTOM_PRIVATE_KEY, 'opera', process.env.FANTOM_ETHERSCAN_KEY);
// register('ropsten', 3, process.env.ROPSTEN_RPC_URL, process.env.ROPSTEN_PRIVATE_KEY);
// register('kovan-optimistic', 69, process.env.KOVAN_OPTIMISTIC_RPC_URL, process.env.KOVAN_OPTIMISTIC_PRIVATE_KEY);
register('goerli', 31337, "http://localhost:8545", "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d", 'goerli', process.env.GOERLI_ETHERSCAN_KEY);

module.exports = {
    networks,
    etherscan,
};
