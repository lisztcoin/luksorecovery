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
import HashLoader from 'react-spinners/HashLoader'

let setupRecoveryMenu = [
  {
    name: 'Initialize',
    visibility: true,
    selected: true,
    path: '/setup-recovery',
  },
  {
    name: 'Guardians',
    visibility: false,
    selected: false,
    path: '/setup-recovery',
  },
  {
    name: 'Threshold',
    visibility: false,
    selected: false,
    path: '/setup-recovery',
  },
  {
    name: 'Secret',
    visibility: false,
    selected: false,
    path: '/setup-recovery',
  }
];

const InitializePage = () => {
  const [state, setState] = useAtom(setupRecoveryAtom);
  const handleInitialize = () => {
    const newStep = state.step + 1;
    setState({ ...state, step: newStep, unlockedStep: state.unlockedStep < newStep ? newStep : state.unlockedStep })
  }

  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <div className="text-sm leading-6 tracking-tighter text-gray-600 dark:text-gray-400">
          Click Next
        </div>
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleInitialize}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Initialize
        </Button>
      </div>
    </>
  )
}

const SetThresholdPage = () => {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const [thresholdNumber, setThresholdNumber] = useState("0");

  useEffect(() => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));

      goal_contract.getGuardiansThreshold().then(
        (result: any) => {
          setThresholdNumber(utils.formatUnits(result, 0));
        }
      ).catch(
        (reason: any) => {
          console.log(reason.message);
        }
      );
    }
  });

  const [loading, setLoading] = useState(false);

  const setThreshold = async () => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));
      let thresholdInput = document.getElementById("thresholdInput");
      let threshold = ""
      if (thresholdInput != null) {
        threshold = (thresholdInput as HTMLInputElement).value;
      }
      setLoading(true);
      let tx = await goal_contract.setThreshold(parseInt(threshold));
      let receipt = await tx.wait();
    }
  }

  const [state, setState] = useAtom(setupRecoveryAtom);

  const handleSetThreshold = async () => {
    await setThreshold();
    setLoading(false);
    const newStep = state.step + 1;
    setState({ ...state, step: newStep, unlockedStep: state.unlockedStep < newStep ? newStep : state.unlockedStep })
  }

  const skipSetThreshold = () => {
    const newStep = state.step + 1;
    setState({ ...state, step: newStep, unlockedStep: state.unlockedStep < newStep ? newStep : state.unlockedStep })
  }

  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <p>Current Threshold: {thresholdNumber} </p>
        <p>New Threshold: </p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="enter a number please."
          autoComplete="off"
          id="thresholdInput"
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
          onClick={handleSetThreshold}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Set Threshold
        </Button>
        {parseInt(thresholdNumber) > 0 && (
          <Button
            size="large"
            shape="rounded"
            fullWidth={true}
            onClick={skipSetThreshold}
            className="mt-2 uppercase xs:mt-4 xs:tracking-widest"
          >
            Skip Add Guardian
          </Button>
        )}
      </div>
    </>
  )
}

const AddGuardianPage = () => {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const [guardianCount, setGuardianCount] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));

      goal_contract.getGuardians().then(
        (result: any[]) => {
          console.log("here");
          setGuardianCount(result.length);
        }
      ).catch(
        (reason: any) => {
          console.log(reason.message);
        }
      );
    }
  });

  const addGuardians = async () => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));
      let guardianInput = document.getElementById("guardianInput");
      let guardianAddress = ""
      if (guardianInput != null) {
        guardianAddress = (guardianInput as HTMLInputElement).value;
      }
      setLoading(true);
      let tx = await goal_contract.addGuardian(guardianAddress);
      let receipt = await tx.wait();
    }
  }

  const removeGuardians = () => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));
      let guardianInput = document.getElementById("guardianInput");
      let guardianAddress = ""
      if (guardianInput != null) {
        guardianAddress = (guardianInput as HTMLInputElement).value;
      }
      goal_contract.removeGuardian(guardianAddress).then(
        () => {
        }
      ).catch(
        (reason: any) => {
          console.log("reason:", reason.message);
        }
      );
    }
  }

  const [state, setState] = useAtom(setupRecoveryAtom);
  const handleAddGuardian = async () => {
    //0x37684639E96D85853BC1D8813a86252F79EfccE6
    await addGuardians();
    setLoading(false);
    const newStep = state.step + 1;
    setState({ ...state, step: newStep, unlockedStep: state.unlockedStep < newStep ? newStep : state.unlockedStep })
  }

  const skipAddGuardian = () => {
    const newStep = state.step + 1;
    setState({ ...state, step: newStep, unlockedStep: state.unlockedStep < newStep ? newStep : state.unlockedStep })
  }

  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <p>Current Guardian Number: {guardianCount}</p>

        <p>Add New Guardian:</p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="0x..."
          autoComplete="off"
          id="guardianInput"
        />
        <Button
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleAddGuardian}
          className="mt-2 uppercase xs:mt-4 xs:tracking-widest"
        >
          Add Guardian
        </Button>
        {guardianCount > 0 && (
          <Button
            size="large"
            shape="rounded"
            fullWidth={true}
            onClick={skipAddGuardian}
            className="mt-2 uppercase xs:mt-4 xs:tracking-widest"
          >
            Skip Add Guardian
          </Button>
        )}
      </div>
    </>
  )
}


const SecretPage = () => {

  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const setSecret = () => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GUARDIAN_CONTRACT, LSP11ABI, provider.getSigner(address));
      let secretInput = document.getElementById("secretInput");
      let secret = ""
      if (secretInput != null) {
        secret = (secretInput as HTMLInputElement).value;
      }
      console.log("secret: ", secret)
      goal_contract.setSecret(secret).then(
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
        <p>If you have already set secret, you are all set!</p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="Enter a keccak256 generated hash starting with 0x"
          autoComplete="off"
          id="secretInput"
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
  const [menu, setMenu] = useState(setupRecoveryMenu);

  useEffect(() => {
    // need to make a copy to make sure there's a reference change to trigger rerender
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
