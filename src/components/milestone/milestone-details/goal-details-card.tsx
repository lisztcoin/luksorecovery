import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import cn from 'classnames';
import Button from '@/components/ui/button';
import RevealContent from '@/components/ui/reveal-content';
import AuctionCountdown from '@/components/nft/auction-countdown';
import { Switch } from '@/components/ui/switch';
import { ExportIcon } from '@/components/icons/export-icon';
import VotePoll from '@/components/milestone/milestone-details/vote-poll';
import VoteActions from '@/components/milestone/milestone-details/vote-actions';
import VoterTable from '@/components/milestone/milestone-details/voter-table';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { Contract, utils } from "ethers";
import { GOAL_CONTRACT } from '@/config/constants';
import GOAL_ABI from '@/abis/goal.json'
import { WalletContext } from '@/lib/hooks/use-connect';
import { useContext, useState, useEffect } from 'react';

// FIXME: need to add vote type
export default function GoalDetailsCard({ goal }: any) {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);

  const checkin = async (id: string) => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GOAL_CONTRACT, GOAL_ABI, provider.getSigner(address));

      goal_contract.checkin(id).then(
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

  const finish = async (id: string) => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GOAL_CONTRACT, GOAL_ABI, provider.getSigner(address));

      goal_contract.achieveGoal(id).then(
        (tx: any) => {
          console.log(tx);
        }
      ).catch(
        (reason: any) => {
          alert(reason.message);
        }
      );
    }
  }

  const abandon = async (id: string) => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GOAL_CONTRACT, GOAL_ABI, provider.getSigner(address));

      goal_contract.abandonGoal(id).then(
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

  const cheer = async (id: string) => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GOAL_CONTRACT, GOAL_ABI, provider.getSigner(address));

      goal_contract.cheers(id).then(
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
        className="flex w-full flex-col-reverse justify-between md:grid md:grid-cols-3"
      >
        <div className="self-start md:col-span-2">
          <h3
            className="cursor-pointer text-base font-medium leading-normal dark:text-gray-100 2xl:text-lg"
          >
            {goal.goalName}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {goal.goalDescription}
          </p>

          <div className='flex'>
            {utils.formatUnits(goal.status, 0) === "0" && goal.creator === address && (
              <div className='mr-3'>

                <Button
                  onClick={() => checkin(utils.formatUnits(goal.id, 0))}
                  className="mt-4 w-full xs:mt-6 xs:w-auto md:mt-10"
                  shape="rounded"
                >
                  Checkin
                </Button>

              </div>
            )}

            {utils.formatUnits(goal.status, 0) === "0" && goal.creator === address && (
              <div className='mr-3'>

                <Button
                  onClick={() => finish(utils.formatUnits(goal.id, 0))}
                  className="mt-4 w-full xs:mt-6 xs:w-auto md:mt-10"
                  shape="rounded"
                >
                  Finish
                </Button>

              </div>
            )}

            {utils.formatUnits(goal.status, 0) === "0" && goal.creator === address && (
              <div className='mr-3'>

                <Button
                  onClick={() => abandon(utils.formatUnits(goal.id, 0))}
                  className="mt-4 w-full xs:mt-6 xs:w-auto md:mt-10"
                  shape="rounded"
                >
                  Abandon
                </Button>

              </div>
            )}

            {utils.formatUnits(goal.status, 0) === "0" && goal.creator != address && (
              <div className='mr-3'>

                <Button
                  onClick={() => cheer(utils.formatUnits(goal.id, 0))}
                  className="mt-4 w-full xs:mt-6 xs:w-auto md:mt-10"
                  shape="rounded"
                >
                  Cheer
                </Button>

              </div>
            )}
          </div>
        </div>

        <div className="before:content-[' '] relative mb-5 grid h-full gap-2 pb-5 before:absolute before:bottom-0 before:h-[1px] before:w-full before:border-b before:border-r before:border-dashed before:border-gray-200 ltr:before:left-0 rtl:before:right-0 dark:border-gray-700 dark:before:border-gray-700 xs:gap-2.5 md:mb-0 md:pb-0 md:before:h-full md:before:w-[1px] ltr:md:pl-8 rtl:md:pr-8">
          <h3 className="text-gray-400 md:text-base md:font-medium md:uppercase md:text-gray-900 dark:md:text-gray-100 2xl:text-lg ">
            Check-ins: {utils.formatUnits(goal.checkins, 0)}
          </h3>
          <h3 className="text-gray-400 md:text-base md:font-medium md:uppercase md:text-gray-900 dark:md:text-gray-100 2xl:text-lg ">
            Cheers: {utils.formatUnits(goal.cheers, 0)}
          </h3>
          <h3 className="text-gray-400 md:text-base md:font-medium md:uppercase md:text-gray-900 dark:md:text-gray-100 2xl:text-lg ">
            Coins Earned: {utils.formatUnits(goal.coins, 0)}
          </h3>
        </div>
      </motion.div>
    </motion.div>
  );
}
