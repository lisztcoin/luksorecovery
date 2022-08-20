import type { NextPageWithLayout } from '@/types';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import routes from '@/config/routes';
import DashboardLayout from '@/layouts/_dashboard';
import Button from '@/components/ui/button';
import Image from '@/components/ui/image';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import GoalList from '@/components/milestone/goal-list';
import { ExportIcon } from '@/components/icons/export-icon';
// static data
import { getGoalsByStatus, getGoalsByAddress } from '@/data/static/goal-data';
import { useContext, useState, useEffect } from 'react';
import { GOAL_CONTRACT, MILESTONE_CONTRACT } from '@/config/constants';
import GOAL_ABI from '@/abis/goal.json'
import MILESTONE_ABI from '@/abis/milestone.json'
import { BigNumber, Contract, utils } from "ethers";
import { WalletContext } from '@/lib/hooks/use-connect';
import AchievementList from '@/components/milestone/achievement-list';

const ClaimNFT: NextPageWithLayout = () => {
  const router = useRouter();
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  let [canClaimMilestones, setCanClaimMilestones] = useState<any[]>([]);
  let [alreadyClaimedlMilestones, setalreadyClaimedMilestones] = useState<any[]>([]);
  let [completedGoals, setCompletedGoals] = useState<any[]>([]);
  let [checkinCount, setCheckinCount] = useState(0);
  let [cheerCount, setCheerCount] = useState(0);
  // TokenID starts at 1.
  let [checkinNFTClaimed, setCheckinNFTClaimed] = useState(0);
  let [cheerNFTClaimed, setCheerNFTClaimed] = useState(0);
  let [goalNFTClaimed, setGoalNFTClaimed] = useState<any[]>([]);

  useEffect(() => {
    console.log(checkinCount);
    let tempCanClaimMilestones: any[] = [];
    let tempAlreadyClaimedMilestones: any[] = [];
    if (checkinCount >= 3) {
      if (checkinNFTClaimed) {
        tempAlreadyClaimedMilestones.push({ name: "NFT for checkins", description: "Unlocked by check in 3 times.", status: true, type: "checkin", goalid: "a167" })
      }
      else {
        tempCanClaimMilestones.push({ name: "NFT for checkins", description: "Unlocked by check in 3 times.", status: false, type: "checkin", goalid: "a15" })
      }
    }
    if (cheerCount >= 3) {
      if (cheerNFTClaimed) {
        tempAlreadyClaimedMilestones.push({ name: "NFT for cheers", description: "Unlocked by get 3 cheers from others.", status: true, type: "cheers", goalid: "a13" })
      } else {
        tempCanClaimMilestones.push({ name: "NFT for cheers", description: "Unlocked by get 3 cheers from others.", status: false, type: "cheers", goalid: "a14" })
      }
    }
    for (const g of completedGoals) {
      if (goalNFTClaimed.includes(utils.formatUnits(g.id, 0))) {
        tempAlreadyClaimedMilestones.push({ name: "NFT for goal achieved", description: "Unlocked by achieve goal: " + g.goalName, status: true, type: "goal", goalName: g.goalName, goalid: g.id })
      } else {
        tempCanClaimMilestones.push({ name: "NFT for goal achieved", description: "Unlocked by achieve goal: " + g.goalName, status: false, type: "goal", goalName: g.goalName, goalid: g.id })
      }
    }
    setCanClaimMilestones(tempCanClaimMilestones);
    setalreadyClaimedMilestones(tempAlreadyClaimedMilestones);
  }, [checkinNFTClaimed, cheerNFTClaimed, goalNFTClaimed, checkinCount, cheerCount])

  useEffect(() => {
    if (!!address && !!provider) {

      // get completed goals
      const goal_contract = new Contract(GOAL_CONTRACT, GOAL_ABI, provider.getSigner(address));

      goal_contract.getAllGoals().then(
        (goals: any) => {
          if (goals.length != 0) {
            setCompletedGoals(getGoalsByAddress(getGoalsByStatus(goals, 1), address));
          }
        }
      )

      goal_contract.checkinCount(address).then(
        (result: BigNumber) => {
          setCheckinCount(parseInt(utils.formatUnits(result, 0)));
        }
      )

      goal_contract.cheersCount(address).then(
        (result: BigNumber) => {
          setCheerCount(parseInt(utils.formatUnits(result, 0)));
        }
      )

      const milestone_contract = new Contract(MILESTONE_CONTRACT, MILESTONE_ABI, provider.getSigner(address));

      milestone_contract.checkinNFTClaimed(address).then(
        (result: BigNumber) => {
          setCheckinNFTClaimed(parseInt(utils.formatUnits(result, 0)));
        }
      )

      milestone_contract.cheersNFTClaimed(address).then(
        (result: BigNumber) => {
          setCheerNFTClaimed(parseInt(utils.formatUnits(result, 0)));
        }
      )

      milestone_contract.getAllCompletedGoalsFromAddress(address).then(
        (result: BigNumber[]) => {
          for (const r of result) {
            setGoalNFTClaimed((old) => [...old, utils.formatUnits(r, 0)]);
          }
        }
      )

    }
  }, [address, provider])

  return (
    <>
      <section className="mx-auto w-full max-w-[1160px] text-sm sm:pt-10 4xl:pt-14">
        <ParamTab
          tabMenu={[
            {
              title: (
                <>
                  Can Claim{' '}
                  {(canClaimMilestones.length > 0) && (
                    <span className="ltr:ml-0.5 rtl:mr-0.5 ltr:md:ml-1.5 rtl:md:mr-1.5 ltr:lg:ml-2 rtl:lg:mr-2">
                      {canClaimMilestones.length}
                    </span>
                  )}
                </>
              ),
              path: 'canClaim',
            },
            {
              title: (
                <>
                  Already Claimed{' '}
                  {(alreadyClaimedlMilestones.length > 0) && (
                    <span className="ltr:ml-0.5 rtl:mr-0.5 ltr:md:ml-1.5 rtl:md:mr-1.5 ltr:lg:ml-2 rtl:lg:mr-2">
                      {alreadyClaimedlMilestones.length}
                    </span>
                  )}
                </>
              ),
              path: 'alreadyClaimed',
            }
          ]}
        >
          <TabPanel className="focus:outline-none">
            {(canClaimMilestones.length > 0) ? <AchievementList milestones={canClaimMilestones} /> : <>You do not have any NFT waiting to be claimed. </>}
          </TabPanel>
          <TabPanel className="focus:outline-none">
            {(alreadyClaimedlMilestones.length > 0) ? <AchievementList milestones={alreadyClaimedlMilestones} /> : <>You do not have any already claimed NFT. </>}
          </TabPanel>
        </ParamTab>
      </section>
    </>
  )
};

ClaimNFT.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ClaimNFT;
