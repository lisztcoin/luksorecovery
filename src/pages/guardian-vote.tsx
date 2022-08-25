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
import { voteAtom } from '@/store/store';
import { useAtom } from 'jotai';
import { HashLoader } from 'react-spinners';
import ProcessInfo from '@/components/ui/process-info';

const guardianVoteMenu = [
  {
    name: 'Account',
    visibility: true,
    selected: true,
    path: '/guardian-vote',
  },
  {
    name: 'Select Process',
    visibility: false,
    selected: false,
    path: '/guardian-vote',
  },
  {
    name: 'Vote',
    visibility: false,
    selected: false,
    path: '/guardian-vote',
  }
];

const AccountPage = () => {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const [state, setState] = useAtom(voteAtom);
  const handleSetAccount = async () => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));
      let accountInput = document.getElementById("accountInput");
      let account = ""
      if (accountInput != null) {
        account = (accountInput as HTMLInputElement).value;
      }
      // Check whether this account has LSP11 attached and whether you are a guardian.
      // let tx = await goal_contract.setThreshold(parseInt(threshold));
      // let receipt = await tx.wait();
      const newStep = state.step + 1;
      setState({ ...state, account: account, step: newStep, unlockedStep: state.unlockedStep < newStep ? newStep : state.unlockedStep });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <p>Enter the universal profile address requiring recovery. You must be a guardian set by the profile owner. </p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="enter a UP address starting with 0x"
          autoComplete="off"
          id="accountInput"
        />
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleSetAccount}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Confirm
        </Button>
      </div>
    </>
  )
}

const NamePage = () => {

  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const [state, setState] = useAtom(voteAtom);
  const [process, setProcess] = useState<any[]>([]);

  const handleSetProcessName = () => {
    if (!!address && !!provider) {
      let nameInput = document.getElementById("nameInput");
      let processName = "";
      if (nameInput != null) {
        processName = (nameInput as HTMLInputElement).value;
      }
      // Check whether this account has LSP11 attached and whether you are a guardian.
      // let tx = await goal_contract.setThreshold(parseInt(threshold));
      // let receipt = await tx.wait();
      const newStep = state.step + 1;
      setState({ ...state, processName: processName, step: newStep, unlockedStep: state.unlockedStep < newStep ? newStep : state.unlockedStep });
    }
  }

  useEffect(() => {
    if (!!address && !!provider) {
      console.log("thre");
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));
      goal_contract.getRecoverProcessesIds().then(
        (result: any[]) => {
          console.log("here", result);
          setProcess(result);
        }
      );
    }
  }, [address, provider]);

  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <p>Select a row to vote on existing process, or enter process name to create a new voting process. </p>
        {process.map((item) => (
          <ProcessInfo
            label={item}
          />
        ))}
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="enter a word for process name"
          autoComplete="off"
          id="nameInput"
        />
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleSetProcessName}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Confirm
        </Button>
      </div>
    </>
  )
}

const VotePage = () => {
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
  const [state, setState] = useAtom(voteAtom);
  const [loading, setLoading] = useState(false);

  const castVote = async () => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));
      let newOwnerInput = document.getElementById("newOwnerInput");
      let newOwner = ""
      if (newOwnerInput != null) {
        newOwner = (newOwnerInput as HTMLInputElement).value;
      }
      setLoading(true);
      console.log("process, ", state.processName);
      console.log("newOwner, ", newOwner);
      let tx = await goal_contract.voteToRecover(utils.formatBytes32String(state.processName), newOwner);
      let receipt = await tx.wait();
    }
  }

  const handleCastVote = async () => {
    await castVote();
    setLoading(false);
  }
  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <p>Enter an address to cast your vote. </p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="0x..."
          autoComplete="off"
          id="newOwnerInput"
        />
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleCastVote}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Confirm
        </Button>
      </div>
    </>
  )
}

const GuardianVotePage: NextPageWithLayout = () => {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const [state, setState] = useAtom(voteAtom);
  const [menu, setMenu] = useState(guardianVoteMenu);

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
      <CarouselMenu carouselMenu={menu}>
        {(state.step == 0 && (<AccountPage />)) ||
          (state.step == 1 && (<NamePage />)) ||
          (state.step == 2 && (<VotePage />))}
      </CarouselMenu>
    </>
  );
};

GuardianVotePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default GuardianVotePage;
