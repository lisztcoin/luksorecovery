import { useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import { SwapIcon } from '@/components/icons/swap-icon';
import DashboardLayout from '@/layouts/_dashboard';
import Trade from '@/components/ui/trade';
import { useContext } from 'react';
import { WalletContext } from '@/lib/hooks/use-connect';
import { Contract, BigNumber, utils } from 'ethers';
import { GUARDIAN_CONTRACT } from '@/config/constants';
import LSP11ABI from '@/abis/LSP11BasicSocialRecovery.json'
import CarouselMenu from '@/components/ui/carousel-menu';
import { setupRecoveryAtom } from '@/store/store';
import { useAtom } from 'jotai';

const setupRecoveryMenu = [
  {
    name: 'Initialize',
    visibility: true,
    selected: true,
  },
  {
    name: 'Guardians',
    visibility: false,
    selected: false,
  },
  {
    name: 'Threshold',
    visibility: false,
    selected: false,
  },
  {
    name: 'Secret',
    visibility: false,
    selected: false,
  }
];

const InitializePage = () => {
  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <TransactionInfo label={'Min. Received'} />
        <TransactionInfo label={'Rate'} />
        <TransactionInfo label={'Offered by'} />
        <TransactionInfo label={'Price Slippage'} value={'1%'} />
        <TransactionInfo label={'Network Fee'} />
        <TransactionInfo label={'Criptic Fee'} />
      </div>
    </>
  )
}

const SetThresholdPage = () => {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const getThreshold = () => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));

      goal_contract.getGuardiansThreshold().then(
        (result: any) => {
          console.log(result);
          alert(result);
        }
      ).catch(
        (reason: any) => {
          console.log(reason.message);
        }
      );
    }
  }

  const handleSetThreshold = () => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));

      goal_contract.setThreshold(1).then(
        () => {
        }
      ).catch(
        (reason: any) => {
          console.log("reason:", reason.message);
        }
      );
    }
  }
  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        Current Threshold: 0
        New Threshold:
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="0x..."
          autoComplete="off"
        />
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleSetThreshold}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Set Threshold
        </Button>
      </div>
    </>
  )
}

const AddGuardianPage = () => {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const getGuardians = () => {
    console.log('here');
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));

      goal_contract.getGuardians().then(
        (result: any[]) => {
          console.log(result);
          alert(result);
        }
      ).catch(
        (reason: any) => {
          console.log(reason.message);
        }
      );
    }
  }

  const addGuardians = () => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));

      goal_contract.addGuardian("0xCE20c1ED8f4a8143184b68bAEb54BBc14faD4cef").then(
        () => {
        }
      ).catch(
        (reason: any) => {
          console.log("reason:", reason.message);
        }
      );
    }
  }

  const removeGuardians = () => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));

      goal_contract.removeGuardian("0xA76d3fCaA2Dfd1ac0813f41f5D6A36630d4a1045").then(
        () => {
        }
      ).catch(
        (reason: any) => {
          console.log("reason:", reason.message);
        }
      );
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        Current Guardians:
        <TransactionInfo label={'Min. Received'} />
        <TransactionInfo label={'Rate'} />
        Add New Guardian:
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="0x..."
          autoComplete="off"
        />
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={addGuardians}
          className="mt-2 uppercase xs:mt-4 xs:tracking-widest"
        >
          Add Guardian
        </Button>
      </div>
    </>
  )
}


const SecretPage = () => {

  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const setSecret = () => {
    console.log('here');
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));

      goal_contract.setSecret("0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107").then(
        () => {
        }
      ).catch(
        (reason: any) => {
          console.log("reason:", reason.message);
        }
      );
    }
  }
  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">

        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="0x..."
          autoComplete="off"
        />

        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={setSecret}
          className="mt-2 uppercase xs:mt-4 xs:tracking-widest"
        >
          Set Secret & Finish Setup
        </Button>
      </div>
    </>
  )
}

const SetupRecoveryPage: NextPageWithLayout = () => {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const [state, setState] = useAtom(setupRecoveryAtom);

  useEffect(() => {
    console.log("state: ", state);
    for (let i = 0; i <= state.unlockedStep; i++) {
      setupRecoveryMenu[i].visibility = true;
      setupRecoveryMenu[i].selected = false;
    }
    setupRecoveryMenu[state.step].selected = true;
  }, [state])

  return (
    <>
      <CarouselMenu carouselMenu={setupRecoveryMenu}>
        {(state.step == 0 && (<InitializePage />)) ||
          (state.step == 1 && (<AddGuardianPage />)) ||
          (state.step == 2 && (<SetThresholdPage />)) ||
          (state.step == 3 && (<SecretPage />))}
      </CarouselMenu>
    </>
  );
};

SetupRecoveryPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SetupRecoveryPage;
