import { useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import Button from '@/components/ui/button';
import DashboardLayout from '@/layouts/_dashboard';
import Trade from '@/components/ui/trade';
import { useContext } from 'react';
import { WalletContext } from '@/lib/hooks/use-connect';
import { Contract, BigNumber, utils, ContractFactory } from 'ethers';
import LSP11ABI from '@/abis/LSP11BasicSocialRecovery.json'
import CarouselMenu from '@/components/ui/carousel-menu';
import { setupRecoveryAtom } from '@/store/store';
import { useAtom } from 'jotai';
import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import Web3 from 'web3'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GuardianName from '@/components/ui/GuardianName'
import { lsp11Bytecode } from '@/abis/LSP11Bytecode'
import {
  ERC725YKeys
  // @ts-ignore
} from '@lukso/lsp-smart-contracts/constants.js'
import UniversalProfile from '@lukso/universalprofile-smart-contracts/artifacts/UniversalProfile.json'

let deployContractMenu = [
  {
    name: 'Deploy LSP11 Contract',
    visibility: true,
    selected: true,
    path: '/deploy-contract',
  }
];

const DeployLSP11Page = () => {
  const [setupRecoveryState, setSetupRecoveryState] = useAtom(setupRecoveryAtom);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(-1);
  const { address, provider, contract, setLsp11Contract } = useContext(WalletContext);

  const handleDeployContract = async () => {

    if (!!address && !!provider) {
      setLoading(true);
      setStep(0);

      // First step - deploy contract
      // const factory = new ContractFactory(LSP11ABI, lsp11Bytecode, provider.getSigner(address))
      // const contract = await factory.deploy(address);
      // console.log(contract.address)
      // await contract.deployTransaction.wait();

      // 0x6D2059c6C5A85FD956242776992FeE988AA062ca
      const contract_address = "0x6D2059c6C5A85FD956242776992FeE988AA062ca";
      setStep(1);
      const permissionKey =
        ERC725YKeys['LSP6']['AddressPermissions:Permissions'] +
        contract_address.slice(2)
      console.log("key: ", permissionKey);
      // ADD_PERMISSION + CHANGE_PERMISSION
      const permissionValue = "0x0000000000000000000000000000000000000000000000000000000000000006"

      const addressContract = new Contract(address, UniversalProfile.abi, provider.getSigner(address));
      console.log(await addressContract.owner());
      console.log(await addressContract.getData(["0xdf30dba06db6a30e65354d9a64c609861f089545ca58c6b4dbe31a5f338cb0e3"]));
      console.log(addressContract);
      console.log(provider.getSigner(address))
      const tx = await addressContract.setData([permissionKey], [permissionValue]);
      console.log(tx);
      await tx.wait();

      setStep(2)

      setLoading(false);
    } else {
      toast("Please connect to your wallet!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <div className="text-sm leading-6 tracking-tighter text-gray-600 dark:text-gray-400">
          <p> Click below button to attach LSP 11 contract to your account, a required step to setup social recovery. Please do not close your browser and approve the transactions.</p>
          <br />
          <p> The process will do the following: </p>
          <br />
          <p> ==> Deploy LSP contract. {step == 0 && "[processing...]"} {step > 0 && "[Done]"}</p>
          <p> ==> Setting permissions. {step == 1 && "[processing...]"} {step > 1 && "[Done]"}</p>
          <p> ==> Linking contract to account (part 1). {step == 2 && "[processing...]"} {step > 2 && "[Done]"}</p>
          <p> ==> Linking contract to account (part 2). {step == 3 && "[processing...]"} {step > 3 && "[Done]"}</p>
        </div>
        <Button
          isLoading={loading}
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleDeployContract}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Deploy LSP 11 Contract
        </Button>
        <ToastContainer autoClose={6000} />
      </div>
    </>
  )
}

const DeployContractPage: NextPageWithLayout = () => {

  return (
    <>
      <CarouselMenu carouselMenu={deployContractMenu}>
        <DeployLSP11Page />
      </CarouselMenu>
    </>
  );
};

DeployContractPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DeployContractPage;
