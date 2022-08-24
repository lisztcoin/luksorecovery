export const MAX_NUM_GOALS = 3;
export const CHECK_IN_INTERVALS_IN_SECONDS = 15;

// rinkeby
// export const GOAL_CONTRACT = "0xd5A85F51b9B4E94Ed27383e896896440Fa3b58E4";
// export const MILESTONE_CONTRACT = "0xd8E4Be8eeBB82Ff117A0537723a15Bb291CF5C01";
// export const SPECIAL_CONTRACT = "0x8d29fE4A6f9B4302fc2dDC551c029dC33156af19";

// mumbai
export const GOAL_CONTRACT = "0xaa255BaC86793b7C02d7E890530e85eE48D02786";
export const MILESTONE_CONTRACT = "0x37AAa8F287739492ba3e9596B594AEf116Da2827";
export const SPECIAL_CONTRACT = "0x9A5E15B2B214B10075a1Cfb1a572de233bdbF3Ff";

export type NetworkType = 'l16'

export type NetworkInfo = {
    name: string
    rpc: { url: string }
    cache: { url: string }
    ipfs: { url: string }
    blockscout: { url: string }
    chainId: number
}

export const UP_CONNECTED_ADDRESS = 'up:connected-address'

export const DEFAULT_GAS = 5_000_000
export const DEFAULT_GAS_PRICE = '10000000000'

export const MAGICVALUE = '0x1626ba7e'

export const DEFAULT_NETWORK: NetworkType = 'l16'

export const NETWORKS: { [K in NetworkType]: NetworkInfo } = {
    l16: {
        name: 'l16',
        rpc: {
            url: 'https://rpc.l16.lukso.network',
        },
        cache: {
            url: 'https://erc725cache.l16.lukso.network/graphql',
        },
        ipfs: {
            url: 'https://2eff.lukso.dev/ipfs/',
        },
        blockscout: {
            url: 'https://explorer.execution.l16.lukso.network/tx',
        },
        chainId: 2828,
    },
}

export const GUARDIAN_CONTRACT =
    '0xe5E7144A7E73D56ae1D1CE81409b88188680BCe8'

export const DEFAULT_NETWORK_CONFIG = NETWORKS[DEFAULT_NETWORK]
