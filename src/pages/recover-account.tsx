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
import { HashLoader } from 'react-spinners';

const recoverAccountMenu = [
  {
    name: 'Account',
    visibility: true,
    selected: true,
    path: '/recover-account',
  }
];

const AccountPage = () => {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const [loading, setLoading] = useState(false);
  const [accountRecover, setAccountRecover] = useState("");

  const recover = async () => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));
      let newHashInput = document.getElementById("newHashInput");
      let newHash = ""
      if (newHashInput != null) {
        newHash = (newHashInput as HTMLInputElement).value;
      }
      let recoveryProcessInput = document.getElementById("recoveryProcessInput");
      let recoveryProcess = ""
      if (recoveryProcessInput != null) {
        recoveryProcess = (recoveryProcessInput as HTMLInputElement).value;
      }
      let secretInput = document.getElementById("secretInput");
      let secret = ""
      if (secretInput != null) {
        secret = (secretInput as HTMLInputElement).value;
      }
      setLoading(true);
      console.log('aaaa')
      console.log(newHash);
      // console.log(utils.formatBytes32String(recoveryProcess));
      // console.log(secret);
      // console.log(account)
      // let tx = await goal_contract.recoverOwnership(utils.formatBytes32String(recoveryProcess), secret, newHash);
      let tx = await goal_contract.recoverOwnership(utils.formatBytes32String(recoveryProcess), secret, newHash);
      let receipt = await tx.wait();
    }
  }

  const handleRecover = async () => {
    await recover();
    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <p>Please enter the recovery process id: </p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="a word"
          autoComplete="off"
          id="recoveryProcessInput"
        />
        <p>Please enter the secret word you used when setting up recovery: </p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="a word"
          autoComplete="off"
          id="secretInput"
        />
        <p>Please enter a new hash for the profile: </p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="0x..."
          autoComplete="off"
          id="newHashInput"
        />
        {loading && (
          <div className='flex justify-center'>
            <HashLoader />
          </div>
        )}
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleRecover}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Recover
        </Button>
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
        <AccountPage />
      </CarouselMenu>
    </>
  );
};

RecoverAccountPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default RecoverAccountPage;
