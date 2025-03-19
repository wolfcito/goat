import { Address } from "viem";

const EVM_USDC_ADDRESSES: Record<number, Address> = {
    1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    10: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
    8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    5000: "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
    1329: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
    43114: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    11155111: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    421614: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    11155420: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
    84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    5003: "0xAcab8129E2cE587fD203FD770ec9ECAFA2C88080",
    713715: "0xd5164A5a83c64E59F842bC091E06614b84D95fF5",
    43113: "0x5425890298aed601595a70ab815c96711a31bc65",
};

export function getEvmUSDCAddress(chain: number): Address {
    return EVM_USDC_ADDRESSES[chain];
}

const EVM_VAULT_ADDRESSES: Record<number, Address> = {
    1: "0x816f722424b49cf1275cc86da9840fbd5a6167e9",
    42161: "0x816f722424B49Cf1275cc86DA9840Fbd5a6167e9",
    10: "0x816f722424b49cf1275cc86da9840fbd5a6167e9",
    8453: "0x816f722424b49cf1275cc86da9840fbd5a6167e9",
    5000: "0x816f722424b49cf1275cc86da9840fbd5a6167e9",
    1329: "0x816f722424B49Cf1275cc86DA9840Fbd5a6167e9",
    43114: "0x816f722424b49cf1275cc86da9840fbd5a6167e9",
    11155111: "0x0EaC556c0C2321BA25b9DC01e4e3c95aD5CDCd2f",
    421614: "0x0EaC556c0C2321BA25b9DC01e4e3c95aD5CDCd2f",
    11155420: "0xEfF2896077B6ff95379EfA89Ff903598190805EC",
    84532: "0xdc7348975aE9334DbdcB944DDa9163Ba8406a0ec",
    5003: "0xfb0E5f3D16758984E668A3d76f0963710E775503",
    713715: "0xA603f6e124259d37e43dd5008cB7613164D6a6e3",
    43113: "0xAB6c8F6245B67421302AAe30AcEB10E00c30F463",
};

export function getEvmVaultAddress(chain: number): Address {
    return EVM_VAULT_ADDRESSES[chain];
}

export const ORDERLY_VAULT_ABI = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "AccountIdInvalid",
        type: "error",
    },
    {
        inputs: [],
        name: "AddressZero",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
            },
            {
                internalType: "uint128",
                name: "amount",
                type: "uint128",
            },
        ],
        name: "BalanceNotEnough",
        type: "error",
    },
    {
        inputs: [],
        name: "BrokerNotAllowed",
        type: "error",
    },
    {
        inputs: [],
        name: "EnumerableSetError",
        type: "error",
    },
    {
        inputs: [],
        name: "OnlyCrossChainManagerCanCall",
        type: "error",
    },
    {
        inputs: [],
        name: "TokenNotAllowed",
        type: "error",
    },
    {
        inputs: [],
        name: "ZeroDepositFee",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "accountId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "userAddress",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint64",
                name: "depositNonce",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "tokenHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "tokenAmount",
                type: "uint128",
            },
        ],
        name: "AccountDeposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "accountId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "userAddress",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint64",
                name: "depositNonce",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "tokenHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "tokenAmount",
                type: "uint128",
            },
        ],
        name: "AccountDepositTo",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "accountId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "uint64",
                name: "withdrawNonce",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "brokerHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "receiver",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "tokenHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "tokenAmount",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "fee",
                type: "uint128",
            },
        ],
        name: "AccountWithdraw",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "oldAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "newAddress",
                type: "address",
            },
        ],
        name: "ChangeCrossChainManager",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "_tokenHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_tokenAddress",
                type: "address",
            },
        ],
        name: "ChangeTokenAddressAndAllow",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint8",
                name: "version",
                type: "uint8",
            },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "Paused",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "_brokerHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "_allowed",
                type: "bool",
            },
        ],
        name: "SetAllowedBroker",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "_tokenHash",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "_allowed",
                type: "bool",
            },
        ],
        name: "SetAllowedToken",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "Unpaused",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        name: "allowedToken",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "_tokenHash",
                type: "bytes32",
            },
            {
                internalType: "address",
                name: "_tokenAddress",
                type: "address",
            },
        ],
        name: "changeTokenAddressAndAllow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "crossChainManagerAddress",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "bytes32",
                        name: "accountId",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "brokerHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "tokenHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "uint128",
                        name: "tokenAmount",
                        type: "uint128",
                    },
                ],
                internalType: "struct VaultTypes.VaultDepositFE",
                name: "data",
                type: "tuple",
            },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "depositFeeEnabled",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "depositId",
        outputs: [
            {
                internalType: "uint64",
                name: "",
                type: "uint64",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "receiver",
                type: "address",
            },
            {
                components: [
                    {
                        internalType: "bytes32",
                        name: "accountId",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "brokerHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "tokenHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "uint128",
                        name: "tokenAmount",
                        type: "uint128",
                    },
                ],
                internalType: "struct VaultTypes.VaultDepositFE",
                name: "data",
                type: "tuple",
            },
        ],
        name: "depositTo",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "emergencyPause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "emergencyUnpause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bool",
                name: "_enabled",
                type: "bool",
            },
        ],
        name: "enableDepositFee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllAllowedBroker",
        outputs: [
            {
                internalType: "bytes32[]",
                name: "",
                type: "bytes32[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllAllowedToken",
        outputs: [
            {
                internalType: "bytes32[]",
                name: "",
                type: "bytes32[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "_brokerHash",
                type: "bytes32",
            },
        ],
        name: "getAllowedBroker",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "_tokenHash",
                type: "bytes32",
            },
        ],
        name: "getAllowedToken",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "receiver",
                type: "address",
            },
            {
                components: [
                    {
                        internalType: "bytes32",
                        name: "accountId",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "brokerHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "tokenHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "uint128",
                        name: "tokenAmount",
                        type: "uint128",
                    },
                ],
                internalType: "struct VaultTypes.VaultDepositFE",
                name: "data",
                type: "tuple",
            },
        ],
        name: "getDepositFee",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "messageTransmitterContract",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "paused",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint32",
                        name: "dstDomain",
                        type: "uint32",
                    },
                    {
                        internalType: "uint64",
                        name: "rebalanceId",
                        type: "uint64",
                    },
                    {
                        internalType: "uint128",
                        name: "amount",
                        type: "uint128",
                    },
                    {
                        internalType: "bytes32",
                        name: "tokenHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "uint256",
                        name: "srcChainId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "dstChainId",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "dstVaultAddress",
                        type: "address",
                    },
                ],
                internalType: "struct RebalanceTypes.RebalanceBurnCCData",
                name: "data",
                type: "tuple",
            },
        ],
        name: "rebalanceBurn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint64",
                        name: "rebalanceId",
                        type: "uint64",
                    },
                    {
                        internalType: "uint128",
                        name: "amount",
                        type: "uint128",
                    },
                    {
                        internalType: "bytes32",
                        name: "tokenHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "uint256",
                        name: "srcChainId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "dstChainId",
                        type: "uint256",
                    },
                    {
                        internalType: "bytes",
                        name: "messageBytes",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "messageSignature",
                        type: "bytes",
                    },
                ],
                internalType: "struct RebalanceTypes.RebalanceMintCCData",
                name: "data",
                type: "tuple",
            },
        ],
        name: "rebalanceMint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "_brokerHash",
                type: "bytes32",
            },
            {
                internalType: "bool",
                name: "_allowed",
                type: "bool",
            },
        ],
        name: "setAllowedBroker",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "_tokenHash",
                type: "bytes32",
            },
            {
                internalType: "bool",
                name: "_allowed",
                type: "bool",
            },
        ],
        name: "setAllowedToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_crossChainManagerAddress",
                type: "address",
            },
        ],
        name: "setCrossChainManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_rebalanceMessengerContract",
                type: "address",
            },
        ],
        name: "setRebalanceMessengerContract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_tokenMessengerContract",
                type: "address",
            },
        ],
        name: "setTokenMessengerContract",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "tokenMessengerContract",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "bytes32",
                        name: "accountId",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "brokerHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "tokenHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "uint128",
                        name: "tokenAmount",
                        type: "uint128",
                    },
                    {
                        internalType: "uint128",
                        name: "fee",
                        type: "uint128",
                    },
                    {
                        internalType: "address",
                        name: "sender",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "receiver",
                        type: "address",
                    },
                    {
                        internalType: "uint64",
                        name: "withdrawNonce",
                        type: "uint64",
                    },
                ],
                internalType: "struct VaultTypes.VaultWithdraw",
                name: "data",
                type: "tuple",
            },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;
