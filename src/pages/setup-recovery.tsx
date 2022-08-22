import { useState } from 'react';
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

const setupRecoveryMenu = [
  {
    name: 'Initialize',
    visibility: true,
    selected: true,
  },
  {
    name: 'Add Guardian',
    visibility: false,
    selected: false,
  },
  {
    name: 'Set Threshold',
    visibility: false,
    selected: false,
  },
  {
    name: 'Set Secret',
    visibility: false,
    selected: false,
  },
  {
    name: 'Finish',
    visibility: false,
    selected: false,
  },
];

const SetupRecoveryPage: NextPageWithLayout = () => {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  let [step, setStep] = useState(1);
  let [toggleCoin, setToggleCoin] = useState(false);
  let [threshold, setThreshold] = useState(-1);

  const getThreshold = () => {
    console.log('here');
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
      <CarouselMenu carouselMenu={setupRecoveryMenu}>
        <div className="flex flex-col gap-4 xs:gap-[18px]">
          <TransactionInfo label={'Min. Received'} />
          <TransactionInfo label={'Rate'} />
          <TransactionInfo label={'Offered by'} />
          <TransactionInfo label={'Price Slippage'} value={'1%'} />
          <TransactionInfo label={'Network Fee'} />
          <TransactionInfo label={'Criptic Fee'} />
        </div>

        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={getThreshold}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Get Threshold
        </Button>
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleSetThreshold}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Set Threshold
        </Button>
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={getGuardians}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Get Guardian
        </Button>
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={addGuardians}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Add Guardian
        </Button>

        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={removeGuardians}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Remove Guardian
        </Button>

        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={setSecret}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Set Secret
        </Button>

      </CarouselMenu>
    </>
  );
};

SetupRecoveryPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SetupRecoveryPage;
