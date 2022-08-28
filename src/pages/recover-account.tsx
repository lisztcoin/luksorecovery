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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  let { address, contract, setLsp11Contract, provider } = useContext(WalletContext);
  const [state, setState] = useAtom(recoverAtom);
  const [loading, setLoading] = useState(false);

  const handleSetAccount = async () => {
    setLoading(true);
    await setAccount();
    setLoading(false);
  }

  const setAccount = async () => {
    if (!!address && !!provider) {
      let accountInput = document.getElementById("accountInput");
      let account = ""
      if (accountInput != null) {
        account = (accountInput as HTMLInputElement).value;
      }
      const success = await setLsp11Contract(account);
      // update Contract to reflect the new state.
      if (!success) {
        toast("This profile does not support LSP11!", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      } else {
        // move forward.
        const newStep = state.step + 1;
        setState({ ...state, account: address, step: newStep, unlockedStep: state.unlockedStep < newStep ? newStep : state.unlockedStep });
      }
    } else {
      toast("Please connect to your wallet!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <p>Enter the universal profile address requiring recovery. </p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="enter a UP address starting with 0x"
          autoComplete="off"
          id="accountInput"
        />
        <Button
          isLoading={loading}
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleSetAccount}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Confirm
        </Button>
        <ToastContainer autoClose={6000} />
      </div>
    </>
  )
}

const RecoverPage = () => {
  const { address, contract, provider } = useContext(WalletContext);
  const [loading, setLoading] = useState(false);

  const recover = async () => {
    if (!!address && !!provider) {
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
      const hashedNewSecret = utils.keccak256(utils.toUtf8Bytes(newHash));
      try {
        let tx = await contract.recoverOwnership(utils.formatBytes32String(recoveryProcess), secret, hashedNewSecret);
        let receipt = await tx.wait();
        toast("Success!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } catch {
        toast("Recover error! Please make sure you entered the correct process name and secret.", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
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
        <p>Please enter a new secret for the profile: </p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="The word will be hashed."
          autoComplete="off"
          id="newHashInput"
        />
        <Button
          isLoading={loading}
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleRecover}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Recover
        </Button>
        <ToastContainer autoClose={6000} />
      </div>
    </>
  )
}

const RecoverAccountPage: NextPageWithLayout = () => {
  const [state, setState] = useAtom(recoverAtom);
  const [menu, setMenu] = useState(recoverAccountMenu);

  useEffect(() => {
    let temp = structuredClone(menu);
    for (let i = 0; i <= state.unlockedStep; i++) {
      temp[i].visibility = true;
      temp[i].selected = false;
    }
    temp[state.step].selected = true;
    setMenu(temp);
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
