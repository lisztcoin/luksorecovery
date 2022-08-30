import { useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import Button from '@/components/ui/button';
import DashboardLayout from '@/layouts/_dashboard';
import { useContext } from 'react';
import { WalletContext } from '@/lib/hooks/use-connect';
import CarouselMenu from '@/components/ui/carousel-menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lsp11Bytecode } from '@/abis/LSP11Bytecode'
import {
  ERC725YKeys
  // @ts-ignore
} from '@lukso/lsp-smart-contracts/constants.js'
import UniversalProfile from '@lukso/universalprofile-smart-contracts/artifacts/UniversalProfile.json'

export const DEFAULT_GAS = 4_000_000
export const DEFAULT_GAS_PRICE = '7000000000'

let deployContractMenu = [
  {
    name: 'Deploy LSP11 Contract',
    visibility: true,
    selected: true,
    path: '/deploy-contract',
  }
];

const DeployLSP11Page = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(-1);
  const { address, web3, contract, setLsp11Contract, provider } = useContext(WalletContext);
  const [lsp11ContractAddress, setLsp11ContractAddress] = useState<string>();
  useEffect(() => {
    setLoading(true);
    if (step == 0) {
      console.log('deploying contract');

      // Deploy Contract.
      let deploy_contract = new web3.eth.Contract(UniversalProfile.abi);
      let parameter = {
        from: address,
        gas: DEFAULT_GAS,
        gasPrice: DEFAULT_GAS_PRICE
      }
      deploy_contract.deploy({ data: lsp11Bytecode, arguments: [address] }).send(parameter, (err: any, transactionHash: any) => {
        console.log('Transaction Hash :', transactionHash);
      }).on('confirmation', () => { }).then((newContractInstance: any) => {
        console.log('Deployed Contract Address : ', newContractInstance.options.address);
        setLsp11ContractAddress(newContractInstance.options.address);
        setStep(1);
      }).catch((error: any) => {
        console.log(error);
        toast(error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setLoading(false);
        setStep(-1);
      });
    } else if (step == 1) {
      console.log('linking newly deployed contract to profile');
      if (!lsp11ContractAddress) {
        toast("Newly deployed contract is missing! (Please report this bug)", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }
      const profileContract = new web3.eth.Contract(UniversalProfile.abi as any, address, {
        gasPrice: DEFAULT_GAS_PRICE,
        gas: DEFAULT_GAS,
      })

      const key1 =
        ERC725YKeys['LSP6']['AddressPermissions:Permissions'] + lsp11ContractAddress.slice(2)
      // ADD PERMISION + CHANGE PERMISSION      
      const value1 = "0x0000000000000000000000000000000000000000000000000000000000000006";

      // set address permission size to current size plus 1
      const key2 = ERC725YKeys['LSP6']["AddressPermissions[]"].length
      console.log(key2);
      // TODO: optimize this so we read size first and then set
      const value2 = "0x0000000000000000000000000000000000000000000000000000000000000004"

      // set the newly added slot to the new contract
      const key3 = key2.slice(0, 34) + web3.utils.padLeft(web3.utils.numberToHex(3), 32).replace('0x', '');
      const value3 = lsp11ContractAddress;

      profileContract.methods
        .setData([key1, key2], [value1, value2])
        .send({
          from: address,
        })
        .on('receipt', function (receipt: any) {
          console.log('receipt: ', receipt)
          setStep(2);
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
          setStep(-1)
          setStep(1);
        });
    } else if (step == 2) {
      const profileContract = new web3.eth.Contract(UniversalProfile.abi as any, address, {
        gasPrice: DEFAULT_GAS_PRICE,
        gas: DEFAULT_GAS,
      })

      const key2 = ERC725YKeys['LSP6']["AddressPermissions[]"].length;
      // set the newly added slot to the new contract
      const key3 = key2.slice(0, 34) + web3.utils.padLeft(web3.utils.numberToHex(3), 32).replace('0x', '');
      const value3 = lsp11ContractAddress;

      profileContract.methods
        .setData([key3], [value3])
        .send({
          from: address,
        })
        .on('receipt', function (receipt: any) {
          console.log('receipt: ', receipt)
          setStep(3);
          toast("Success! Please go to the Setup Recovery tab to continue the process!", {
            position: toast.POSITION.TOP_CENTER,
          });
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
          setStep(-1);
          setStep(2);
        });
    }
    setLoading(false);
  }, [step])

  const handleDeployContract = async () => {
    if (!!address && !!web3) {
      setStep(0);
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
          <p> Click below button to attach LSP 11 contract to your account, a required step to setup social recovery. Please do not close your browser and approve the 3 transactions.</p>
          <br />
          <p> The process will do the following: </p>
          <br />
          <p> ==> Deploy LSP contract. {step == 0 && "[processing...]"} {step > 0 && "[Done]"}</p>
          <p> ==> Setting permissions. {step == 1 && "[processing...]"} {step > 1 && "[Done]"}</p>
          <p> ==> Linking contract to account. {step == 2 && "[processing...]"} {step > 2 && "[Done]"}</p>
        </div>
        <Button
          isLoading={loading}
          size="large"
          shape="rounded"
          fullWidth={true}
          onClick={handleDeployContract}
          className="mt-6 uppercase xs:mt-8 xs:tracking-widest"
        >
          Deploy LSP 11 Contract
        </Button>
        <ToastContainer autoClose={6000} />
      </div>
    </>
  )
}

const DeployContractPage: NextPageWithLayout = () => {

  return (
    <>
      <CarouselMenu carouselMenu={deployContractMenu}>
        <DeployLSP11Page />
      </CarouselMenu>
    </>
  );
};

DeployContractPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DeployContractPage;
