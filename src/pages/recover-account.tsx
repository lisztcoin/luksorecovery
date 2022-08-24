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
import { recoverAtom } from '@/store/store';
import { useAtom } from 'jotai';

const recoverAccountMenu = [
  {
    name: 'Account',
    visibility: true,
    selected: true,
    path: '/recover-account',
  },
  {
    name: 'Recover',
    visibility: false,
    selected: false,
    path: '/recover-account',
  }
];

const AccountPage = () => {
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

const RecoverPage = () => {
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

const RecoverAccountPage: NextPageWithLayout = () => {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const [state, setState] = useAtom(recoverAtom);

  useEffect(() => {
    for (let i = 0; i <= state.unlockedStep; i++) {
      recoverAccountMenu[i].visibility = true;
      recoverAccountMenu[i].selected = false;
    }
    recoverAccountMenu[state.step].selected = true;
  }, [state])

  return (
    <>
      <CarouselMenu carouselMenu={recoverAccountMenu}>
        {(state.step == 0 && (<AccountPage />)) ||
          (state.step == 1 && (<RecoverPage />))}
      </CarouselMenu>
    </>
  );
};

RecoverAccountPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default RecoverAccountPage;
