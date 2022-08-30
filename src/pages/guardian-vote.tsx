import { useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import Button from '@/components/ui/button';
import DashboardLayout from '@/layouts/_dashboard';
import { useContext } from 'react';
import { WalletContext } from '@/lib/hooks/use-connect';
import { Contract, BigNumber, utils } from 'ethers';
import { GUARDIAN_CONTRACT } from '@/config/constants';
import LSP11ABI from '@/abis/LSP11BasicSocialRecovery.json'
import CarouselMenu from '@/components/ui/carousel-menu';
import { voteAtom } from '@/store/store';
import ProcessInfo from '@/components/ui/process-info';
import { useAtom } from 'jotai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  let { address, contract, setLsp11Contract, web3 } = useContext(WalletContext);
  const [state, setState] = useAtom(voteAtom);
  const [loading, setLoading] = useState(false);
  const [targetAccount, setTargetAccount] = useState<string>()

  useEffect(() => {
    const isGuardian = async () => {
      let result = false;
      // wait for the contract variable to be updated.
      if (contract && address && web3 && targetAccount) {
        console.log('contract not null!')
        result = await contract.methods.isGuardian(address).call({ from: address });
        if (!result) {
          toast("You are not a guardian to this profile!", {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          // move forward.
          const newStep = state.step + 1;
          setState({ ...state, account: address, step: newStep, unlockedStep: state.unlockedStep < newStep ? newStep : state.unlockedStep });
        }
      }
      setLoading(false);
    }
    isGuardian();
  }, [contract, address, targetAccount])

  const handleSetAccount = async () => {
    setLoading(true);
    await setAccount();
  }

  const setAccount = async () => {
    if (!!address && !!web3) {
      let accountInput = document.getElementById("accountInput");
      let account = ""
      if (accountInput != null) {
        account = (accountInput as HTMLInputElement).value;
      }
      const success = await setLsp11Contract(account);
      setTargetAccount(account);
      // update Contract to reflect the new state.
      if (!success) {
        toast("This profile does not support LSP11!", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
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
        <p>Enter the universal profile address requiring recovery. You must be a guardian set by the profile owner. </p>
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

const NamePage = () => {

  const { address, contract, web3 } = useContext(WalletContext);
  const [state, setState] = useAtom(voteAtom);
  const [process, setProcess] = useState<any[]>([]);

  const handleSetProcessName = () => {
    let nameInput = document.getElementById("nameInput");
    let processName = "";
    if (nameInput != null) {
      processName = (nameInput as HTMLInputElement).value;
    }
    const newStep = state.step + 1;
    setState({ ...state, processName: processName, step: newStep, unlockedStep: state.unlockedStep < newStep ? newStep : state.unlockedStep });
  }

  useEffect(() => {
    if (!!address && !!web3) {
      contract.methods.getRecoverProcessesIds().call({ from: address }).then(
        (result: any) => {
          setProcess(result);
        }
      ).catch(
        (reason: any) => {
          console.log(reason.message);
        }
      );
    }
  }, [address, web3]);

  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <p>Enter an existing process to join, or enter a new process name to create a new voting process. </p>
        <p>Existing Processes: {process.length == 0 && "None"}</p>
        {process.map((item, index) => (
          <ProcessInfo
            label={utils.parseBytes32String(item)}
            key={index}
            value={true}
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
        <ToastContainer autoClose={6000} />
      </div>
    </>
  )
}

const VotePage = () => {
  const { address, contract, web3 } = useContext(WalletContext);
  const [state, setState] = useAtom(voteAtom);
  const [loading, setLoading] = useState(false);

  const castVote = async () => {
    if (!!address && !!web3) {
      let newOwnerInput = document.getElementById("newOwnerInput");
      let newOwner = ""
      if (newOwnerInput != null) {
        newOwner = (newOwnerInput as HTMLInputElement).value;
      }
      try {
        contract.methods.voteToRecover(utils.formatBytes32String(state.processName), newOwner)
          .send({
            from: address,
          }).on('receipt', function (receipt: any) {
            console.log('receipt: ', receipt)
            toast("Success!", {
              position: toast.POSITION.TOP_CENTER,
            });
            setLoading(false);
          })
          .once('sending', (payload: any) => {
            console.log('payload: ', JSON.stringify(payload, null, 2))
          })
          .catch((error: any) => {
            console.log(error);
            toast(error.message, {
              position: toast.POSITION.TOP_CENTER,
            });
            setLoading(false);
          });

      } catch {
        toast("Failed to cast your vote!", {
          position: toast.POSITION.TOP_CENTER,
        });
        setLoading(false);
      }
    } else {
      toast("Please connect to your wallet!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  const handleCastVote = async () => {
    setLoading(true);
    await castVote();
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
          isLoading={loading}
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleCastVote}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Confirm
        </Button>
        <ToastContainer autoClose={6000} />
      </div>
    </>
  )
}

const GuardianVotePage: NextPageWithLayout = () => {
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
