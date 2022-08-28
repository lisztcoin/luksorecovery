import { useEffect, useState, createContext, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
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
  const [contract, setContract] = useState<Contract>();

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
            console.log(addressPermissionsValue);
            if (await address_permission_contract.supportsInterface('0xcb81043b')) {
              await setContract(address_permission_contract);
              isContractSet = true;
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    return isContractSet;
  }

  const setWalletAddress = async (provider: any) => {
    try {
      const signer = provider.getSigner();
      if (signer) {
        const web3Address = await signer.getAddress();
        setAddress(web3Address);
        getBalance(provider, web3Address);
      }
    } catch (error) {
      console.log(
        'Account not connected; logged from setWalletAddress function'
      );
    }
  };

  const getBalance = async (provider: any, walletAddress: string) => {
    const walletBalance = await provider.getBalance(walletAddress);
    const balanceInEth = ethers.utils.formatEther(walletBalance);
    setBalance(balanceInEth);
  };

  const disconnectWallet = () => {
    setAddress(undefined);
    web3Modal && web3Modal.clearCachedProvider();
  };

  const checkIfExtensionIsAvailable = () => {
    if (
      (window && window.web3 === undefined) ||
      (window && window.ethereum === undefined)
    ) {
      setError(true);
      web3Modal && web3Modal.toggleModal();
    }
  };

  const connectToWallet = async () => {
    if (web3Modal && web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider()
    }
    await connectToWalletInternal()
  }

  const connectToWalletInternal = async () => {
    try {
      console.log('inside wallet internal')
      setLoading(true);
      // checkIfExtensionIsAvailable();
      const wallet = web3Modal && await web3Modal.connect();
      console.log('connect');
      const provider = new ethers.providers.Web3Provider(wallet);
      // await subscribeProvider(wallet);
      setProvider(provider);
      setWalletAddress(provider);
      console.log("wallet: ", wallet);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(
        error,
        'got this error on connectToWallet catch block while connecting the wallet'
      );
    }
  };

  const subscribeProvider = async (connection: any) => {
    connection.on('close', () => {
      disconnectWallet();
    });
    connection.on('accountsChanged', async (accounts: string[]) => {
      if (accounts?.length) {
        setAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(connection);
        getBalance(provider, accounts[0]);
      } else {
        disconnectWallet();
      }
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        contract,
        loading,
        provider,
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
