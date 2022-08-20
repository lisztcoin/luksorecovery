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
import { getGoalsByStatus, getGoalsOtherThanAddress } from '@/data/static/goal-data';
import { useContext, useState, useEffect } from 'react';
import { GOAL_CONTRACT } from '@/config/constants';
import GOAL_ABI from '@/abis/goal.json'
import { Contract, utils } from "ethers";
import { WalletContext } from '@/lib/hooks/use-connect';

const SupportOthers: NextPageWithLayout = () => {
  const router = useRouter();
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);

  let [allGoals, setAllGoals] = useState<any[]>([]);

  useEffect(() => {
    if (!!address && !!provider) {
      const goal_contract = new Contract(GOAL_CONTRACT, GOAL_ABI, provider.getSigner(address));

      goal_contract.getAllGoals().then(
        (goals: any) => {
          console.log(goals);
          setAllGoals(goals);
        }
      ).catch(
        () => {
        }
      );
    }
  }, [address, provider])

  const activeGoals = getGoalsOtherThanAddress(getGoalsByStatus(allGoals, 0), address);
  const achievedGoals = getGoalsOtherThanAddress(getGoalsByStatus(allGoals, 1), address);
  const abandonedGoals = getGoalsOtherThanAddress(getGoalsByStatus(allGoals, 2), address);
  return (
    <>
      <section className="mx-auto w-full max-w-[1160px] text-sm sm:pt-10 4xl:pt-14">
        <ParamTab
          tabMenu={[
            {
              title: (
                <>
                  Active{' '}
                  {activeGoals.length > 0 && (
                    <span className="ltr:ml-0.5 rtl:mr-0.5 ltr:md:ml-1.5 rtl:md:mr-1.5 ltr:lg:ml-2 rtl:lg:mr-2">
                      {activeGoals.length}
                    </span>
                  )}
                </>
              ),
              path: 'active',
            },
            {
              title: (
                <>
                  Achieved{' '}
                  {achievedGoals.length > 0 && (
                    <span className="ltr:ml-0.5 rtl:mr-0.5 ltr:md:ml-1.5 rtl:md:mr-1.5 ltr:lg:ml-2 rtl:lg:mr-2">
                      {achievedGoals.length}
                    </span>
                  )}
                </>
              ),
              path: 'achieved',
            },
            {
              title: (
                <>
                  Abandoned{' '}
                  {abandonedGoals.length > 0 && (
                    <span className="ltr:ml-0.5 rtl:mr-0.5 ltr:md:ml-1.5 rtl:md:mr-1.5 ltr:lg:ml-2 rtl:lg:mr-2">
                      {abandonedGoals.length}
                    </span>
                  )}
                </>
              ),
              path: 'abandoned',
            }
          ]}
        >
          <TabPanel className="focus:outline-none">
            <GoalList goals={activeGoals} />
          </TabPanel>
          <TabPanel className="focus:outline-none">
            <GoalList goals={achievedGoals} />
          </TabPanel>
          <TabPanel className="focus:outline-none">
            <GoalList goals={abandonedGoals} />
          </TabPanel>
        </ParamTab>
      </section>
    </>
  )
};

SupportOthers.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SupportOthers;
