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
import { GOAL_CONTRACT, GUARDIAN_CONTRACT } from '@/config/constants';
import LSP11ABI from '@/abis/LSP11BasicSocialRecovery.json'
import LSP0ABI from '@/abis/LSP0ERC725AccountCore.json'
import CarouselMenu from '@/components/ui/carousel-menu';
import { setupRecoveryAtom, profileLSP11ContractAtom } from '@/store/store';
import { useAtom } from 'jotai';
import HashLoader from 'react-spinners/HashLoader'
import Schema_v06 from '@/lib/LSP-schema.json'
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

function encodeArrayKey(key: string, index: number) {
  let web3 = new Web3();
  return key.slice(0, 34) + web3.utils.padLeft(web3.utils.numberToHex(index), 32).replace('0x', '');
}

const InitializePage = () => {
  const [setupRecoveryState, setSetupRecoveryState] = useAtom(setupRecoveryAtom);
  const [lsp11ContractState, setLsp11ContractState] = useAtom(profileLSP11ContractAtom);
  const [loading, setLoading] = useState(false);
  const { address, provider, contract, setLsp11Contract } = useContext(WalletContext);

  const handleInitialize = async () => {

    if (!!address && !!provider) {
      setLoading(true);
      let schema: ERC725JSONSchema[] = []

      schema = [{
        "name": "AddressPermissions[]",
        "key": "0xdf30dba06db6a30e65354d9a64c609861f089545ca58c6b4dbe31a5f338cb0e3",
        "keyType": "Array",
        "valueType": "address",
        "valueContent": "Address"
      } as ERC725JSONSchema]

      const httpProvider = new Web3.providers.HttpProvider(
        'https://rpc.l16.lukso.network',
      );
      const erc725 = new ERC725(schema, address, httpProvider);
      // get contracts
      const result = await erc725.getData(schema[0].name);
      let hasLSP11Contract = false;
      if (Array.isArray(result.value)) {
        for (let addressPermissionsValue of result.value) {
          console.log('aaaa')
          console.log(addressPermissionsValue);
          // We can still use LSP11ABI as we will only call supportInterface which is supported by all contracts
          try {
            const address_permission_contract = new Contract(addressPermissionsValue, LSP11ABI, provider.getSigner(address));
            if (await address_permission_contract.supportsInterface('0xcb81043b')) {
              hasLSP11Contract = true;
              setLsp11Contract(addressPermissionsValue);
            }
          } catch {
            console.log('error that can be ignored');
          }
        }
      }
      setLoading(false);
      if (!hasLSP11Contract) {
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
        <ToastContainer autoClose={8000} />
      </div>
    </>
  )
}

const SetThresholdPage = () => {
  const { address, contract, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  const [thresholdNumber, setThresholdNumber] = useState("0");

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
      let tx = await contract.addGuardian(guardianAddress);
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
