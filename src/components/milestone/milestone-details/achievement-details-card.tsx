import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import cn from 'classnames';
import Button from '@/components/ui/button';
import RevealContent from '@/components/ui/reveal-content';
import AuctionCountdown from '@/components/nft/auction-countdown';
import { Switch } from '@/components/ui/switch';
import { ExportIcon } from '@/components/icons/export-icon';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { Contract, utils } from "ethers";
import { MILESTONE_CONTRACT } from '@/config/constants';
import MILESTONE_ABI from '@/abis/milestone.json'
import { WalletContext } from '@/lib/hooks/use-connect';
import { useContext, useState, useEffect } from 'react';
import { uploadCheckinNFT, uploadCheersNFT, uploadGoalAchievedNFT } from './achievement-utils';

export default function AchievementDetailsCard({ milestone }: any) {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);

  const claimGoalAchievedAward = async (id: string, name: string) => {
    if (!!address && !!provider) {
      const milestone_contract = new Contract(MILESTONE_CONTRACT, MILESTONE_ABI, provider.getSigner(address));
      const cid = await uploadGoalAchievedNFT(name);
      const uri = "https://" + cid + ".ipfs.nftstorage.link"
      console.log('details!')
      console.log(uri);
      console.log(id)
      milestone_contract.mintGoalAchieved(id, uri).then(
        (tx: any) => {
          console.log(tx);
        }
      ).catch(
        (reason: any) => {
          console.log(reason.message);
        }
      );
    }
  }

  const claimCheckinAward = async () => {
    if (!!address && !!provider) {
      const milestone_contract = new Contract(MILESTONE_CONTRACT, MILESTONE_ABI, provider.getSigner(address));
      const cid = await uploadCheckinNFT();
      const uri = "https://" + cid + ".ipfs.nftstorage.link"
      milestone_contract.mintCheckinNFT(uri).then(
        (tx: any) => {
          console.log(tx);
        }
      ).catch(
        (reason: any) => {
          console.log(reason.message);
        }
      );
    }
  }

  const claimCheersAward = async () => {
    if (!!address && !!provider) {
      const milestone_contract = new Contract(MILESTONE_CONTRACT, MILESTONE_ABI, provider.getSigner(address));
      const cid = await uploadCheersNFT();
      const uri = "https://" + cid + ".ipfs.nftstorage.link"
      milestone_contract.mintCheersNFT(uri).then(
        (tx: any) => {
          console.log(tx);
        }
      ).catch(
        (reason: any) => {
          console.log(reason.message);
        }
      );
    }
  }

  return (
    <motion.div
      layout
      initial={{ borderRadius: 8 }}
      className={cn(
        'mb-3 rounded-lg bg-white p-5 transition-shadow duration-200 dark:bg-light-dark xs:p-6',
        'shadow-card hover:shadow-large'
      )}
    >
      <motion.div
        layout
        className="flex w-full flex-col-reverse justify-between"
      >
        <div className="self-start">
          <h3
            className="cursor-pointer text-base font-medium leading-normal dark:text-gray-100 2xl:text-lg"
          >
            {milestone.name}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {milestone.description} {milestone.status === true && "Go to My NFT tab to view your NFT"}
          </p>

          <div className='flex'>
            {milestone.status === false && milestone.type === "checkin" && (
              <div className='mr-3'>

                <Button
                  onClick={() => claimCheckinAward()}
                  className="mt-4 w-full xs:mt-6 xs:w-auto md:mt-10"
                  shape="rounded"
                >
                  Claim
                </Button>

              </div>
            )}
            {milestone.status === false && milestone.type === "cheers" && (
              <div className='mr-3'>

                <Button
                  onClick={() => claimCheersAward()}
                  className="mt-4 w-full xs:mt-6 xs:w-auto md:mt-10"
                  shape="rounded"
                >
                  Claim
                </Button>

              </div>
            )}
            {milestone.status === false && milestone.type === "goal" && (
              <div className='mr-3'>

                <Button
                  onClick={() => claimGoalAchievedAward(milestone.goalid, milestone.goalName)}
                  className="mt-4 w-full xs:mt-6 xs:w-auto md:mt-10"
                  shape="rounded"
                >
                  Claim
                </Button>

              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
