import { useEffect, useState, createContext, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { BigNumber, ethers } from 'ethers';
import { sequence } from '0xsequence'
import WalletConnect from '@walletconnect/web3-provider'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import LSP11ABI from '@/abis/LSP11BasicSocialRecovery.json'
import { Contract } from 'ethers';
import Web3 from 'web3'
import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';

const web3modalStorageKey = 'WEB3_CONNECT_CACHED_PROVIDER';

export const WalletContext = createContext<any>({});

let providerOptions: any = {
}

const web3Modal = typeof window !== 'undefined' && new Web3Modal({
  providerOptions,
  cacheProvider: true
})

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  // LSP 11 address.
  const [contract, setContract] = useState<Contract>();
  const [connectWalletCalled, setConnectWalletCalled] = useState(false);
  const [web3, setWeb3] = useState<any>(null)

  useEffect(() => {
    if (connectWalletCalled && window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts: any) => {
        setAddress(accounts[0])
        let w3 = new Web3(window.ethereum)
        setWeb3(w3)

      }).catch((err: any) => console.log(err))
    }
  }, [connectWalletCalled])

  useEffect(() => {
    if (window.ethereum && web3 && address) {
      web3.eth.getBalance(address).then(
        (result: BigNumber) => {
          const balanceInEth = ethers.utils.formatEther(result);
          setBalance(balanceInEth);
        }
      )
    }
  }, [web3])

  const setLsp11Contract = async (targetAddress: string) => {
    let isContractSet = false;
    if (provider) {
      let schema: ERC725JSONSchema[] = []

      schema = [{
        "name": "AddressPermissions[]",
        "key": "0xdf30dba06db6a30e65354d9a64c609861f089545ca58c6b4dbe31a5f338cb0e3",
        "keyType": "Array",
        "valueType": "address",
        "valueContent": "Address"
      } as ERC725JSONSchema]

      const httpProvider = new Web3.providers.HttpProvider(
        'https://rpc.l16.lukso.network',
      );
      const erc725 = new ERC725(schema, targetAddress, httpProvider);
      // get contracts
      const result = await erc725.getData(schema[0].name);
      if (Array.isArray(result.value)) {
        for (let addressPermissionsValue of result.value) {
          // We can still use LSP11ABI as we will only call supportInterface which is supported by all contracts
          try {
            const address_permission_contract = new Contract(addressPermissionsValue, LSP11ABI, provider.getSigner(address));
            // console.log(addressPermissionsValue);
            if (await address_permission_contract.supportsInterface('0xcb81043b')) {
              await setContract(address_permission_contract);
              isContractSet = true;
            }
          } catch (error) {
            // console.log(error);
          }
        }
      }
    }
    return isContractSet;
  }

  const disconnectWallet = () => {
    setAddress(undefined);
    setConnectWalletCalled(false);
    setWeb3(null);
  };

  const connectToWallet = async () => {
    setConnectWalletCalled(true);
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        contract,
        loading,
        provider,
        web3,
        error,
        setLsp11Contract,
        connectToWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
