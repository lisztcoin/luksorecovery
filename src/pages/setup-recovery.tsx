import { useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import Button from '@/components/ui/button';
import DashboardLayout from '@/layouts/_dashboard';
import Trade from '@/components/ui/trade';
import { useContext } from 'react';
import { WalletContext } from '@/lib/hooks/use-connect';
import { Contract, BigNumber, utils } from 'ethers';
import LSP11ABI from '@/abis/LSP11BasicSocialRecovery.json'
import CarouselMenu from '@/components/ui/carousel-menu';
import { setupRecoveryAtom } from '@/store/store';
import { useAtom } from 'jotai';
import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import Web3 from 'web3'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  const [setupRecoveryState, setSetupRecoveryState] = useAtom(setupRecoveryAtom);
  const [loading, setLoading] = useState(false);
  const { address, provider, contract, setLsp11Contract } = useContext(WalletContext);

  const handleInitialize = async () => {

    if (!!address && !!provider) {
      setLoading(true);
      const success = await setLsp11Contract(address);
      setLoading(false);
      if (!success) {
        toast("Your profile does not support LSP11!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        // move forward
        const newStep = setupRecoveryState.step + 1;
        setSetupRecoveryState({ ...setupRecoveryState, step: newStep, unlockedStep: setupRecoveryState.unlockedStep < newStep ? newStep : setupRecoveryState.unlockedStep })
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
        <div className="text-sm leading-6 tracking-tighter text-gray-600 dark:text-gray-400">
          <p> Please make sure your profile supports LSP11, and click Initialize button </p>
        </div>
        <Button
          isLoading={loading}
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleInitialize}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Initialize
        </Button>
        <ToastContainer autoClose={6000} />
      </div>
    </>
  )
}

const SetThresholdPage = () => {
  const { address, contract, provider } = useContext(WalletContext);
  const [thresholdNumber, setThresholdNumber] = useState("0");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useAtom(setupRecoveryAtom);

  useEffect(() => {
    if (!!address && !!provider) {
      contract.getGuardiansThreshold().then(
        (result: any) => {
          setThresholdNumber(utils.formatUnits(result, 0));
        }
      ).catch(
        (reason: any) => {
          console.log(reason.message);
        }
      );
    }
  }, [address, provider]);

  const setThreshold = async () => {
    if (!!address && !!provider) {
      setLoading(true);
      let thresholdInput = document.getElementById("thresholdInput");
      let threshold = ""
      if (thresholdInput != null) {
        threshold = (thresholdInput as HTMLInputElement).value;
      }
      try {
        let tx = await contract.setThreshold(parseInt(threshold));
        let receipt = await tx.wait();
      } catch {
        toast("Failed to set threshold!", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } else {
      toast("Please connect to your wallet!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

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
        <p>Please enter a number between 1 and the guardian count.</p>
        <p>Current Threshold: {parseInt(thresholdNumber) > 0 ? thresholdNumber : "NOT SET"} </p>
        <p>New Threshold: </p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="enter a number please."
          autoComplete="off"
          id="thresholdInput"
        />
        <ToastContainer autoClose={6000} />
        <Button
          isLoading={loading}
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
  const { address, contract, provider } = useContext(WalletContext);
  const [guardianCount, setGuardianCount] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!!address && !!provider) {
      contract.getGuardians().then(
        (result: any[]) => {
          console.log("here, ", result);
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
      let guardianInput = document.getElementById("guardianInput");
      let guardianAddress = ""
      if (guardianInput != null) {
        guardianAddress = (guardianInput as HTMLInputElement).value;
      }
      setLoading(true);
      try {
        let tx = await contract.addGuardian(guardianAddress);
        let receipt = await tx.wait();
      } catch {
        toast("Failed to add guardian!", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } else {
      toast("Please connect to your wallet!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  const [state, setState] = useAtom(setupRecoveryAtom);
  const handleAddGuardian = async () => {
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
        <ToastContainer autoClose={6000} />
        <Button
          isLoading={loading}
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

  const { address, contract, provider } = useContext(WalletContext);
  const [loading, setLoading] = useState(false);
  const setSecret = async () => {
    if (!!address && !!provider) {
      let secretInput = document.getElementById("secretInput");
      let secret = ""
      if (secretInput != null) {
        secret = (secretInput as HTMLInputElement).value;
      }
      try {
        const hashedSecret = utils.keccak256(utils.toUtf8Bytes(secret));
        console.log(hashedSecret);
        const tx = await contract.setSecret(hashedSecret);
        let receipt = await tx.wait();
        toast("Success! Your profile can now be recovered through guardians!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } catch {
        toast("Failed to set secret!", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  }

  const handleSetSecret = async () => {
    setLoading(true);
    await setSecret();
    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col gap-4 xs:gap-[18px]">
        <p>Set a new secret, or override the old one!</p>
        <input
          className="h-12 w-full appearance-none rounded-full border-2 border-gray-200 py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-11 rtl:pl-5 rtl:pr-11 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 sm:ltr:pl-14 sm:rtl:pr-14 xl:ltr:pl-16 xl:rtl:pr-16"
          placeholder="The secret will be hashed by keccak256 method."
          autoComplete="off"
          id="secretInput"
        />

        <Button
          isLoading={loading}
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleSetSecret}
          className="mt-2 uppercase xs:mt-4 xs:tracking-widest"
        >
          Set Secret & Finish Setup
        </Button>
        <ToastContainer autoClose={6000} />
      </div>
    </>
  )
}

const SetupRecoveryPage: NextPageWithLayout = () => {
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
