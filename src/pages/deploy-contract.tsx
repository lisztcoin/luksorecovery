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
      const factory = new ContractFactory(LSP11ABI, lsp11Bytecode, provider.getSigner(address))
      const contract = await factory.deploy(address);
      console.log(contract.address)
      await contract.deployTransaction.wait();

      // 0x6D2059c6C5A85FD956242776992FeE988AA062ca
      const contract_address = "0x6D2059c6C5A85FD956242776992FeE988AA062ca";





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
          <p> ==> Linking contract to account. {step == 2 && "[processing...]"}</p>
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
