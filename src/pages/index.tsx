import type { NextPageWithLayout } from '@/types';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import routes from '@/config/routes';
import DashboardLayout from '@/layouts/_dashboard';
import Image from '@/components/ui/image';
// static data
import votePool from '@/assets/images/vote-pool.svg';
import discord from '@/assets/images/discord.svg';
import forum from '@/assets/images/forum.svg';
import bank from '@/assets/images/bank.svg';
import mirror from '@/assets/images/mirror.svg';

const Homepage: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <div className="mx-auto w-full max-w-[1160px] text-sm md:pt-14 4xl:pt-24">
        <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3">
          <motion.div
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            onClick={() => router.push(routes.proposals)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:col-span-2 sm:col-auto sm:row-span-2"
          >
            <div className="h-auto w-16 xs:w-20 xl:w-24 3xl:w-28 4xl:w-auto">
              <Image alt="Vote Pool" src={votePool} />
            </div>
            <h3 className="mt-6 mb-2 text-sm font-medium uppercase text-gray-800 dark:text-gray-100 sm:text-base 3xl:text-lg">
              Connect wallet and Create a goal
            </h3>
            <p className="leading-loose text-gray-600 dark:text-gray-400">
              Earn coins from daily check ins and finally achieving the goal. No initial deposit required.
            </p>
          </motion.div>
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <h3 className="mt-6 mb-2 text-sm font-medium uppercase text-gray-800 dark:text-gray-100 sm:text-base 3xl:text-lg">
              Cheer on other people's goals
            </h3>
            <p className="leading-loose text-gray-600 dark:text-gray-400">
              Earn extra coins by cheering on others and getting cheers for your goals.
            </p>
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <h3 className="mt-6 mb-2 text-sm font-medium uppercase text-gray-800 dark:text-gray-100 sm:text-base 3xl:text-lg">
              Claim milestone NFTs
            </h3>
            <p className="leading-loose text-gray-600 dark:text-gray-400">
              Claim cool milestone NFTs when you reach certain stages of your goal or finally achieve your goal.
            </p>
          </motion.a>
          <motion.div
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            onClick={() => router.push('/')}
            className="cursor-pointer rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <h3 className="mt-6 mb-2 text-sm font-medium uppercase text-gray-800 dark:text-gray-100 sm:text-base 3xl:text-lg">
              Mint special NFTs
            </h3>
            <p className="leading-loose text-gray-600 dark:text-gray-400">
              Use your hard-earned coins to mint special NFTs! The more coin you are willing to spend on mint, the better the NFTs will be!
            </p>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            onClick={() => router.push('/')}
            className="cursor-pointer rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <h3 className="mt-6 mb-2 text-sm font-medium uppercase text-gray-800 dark:text-gray-100 sm:text-base 3xl:text-lg">
              Showcase your NFTs
            </h3>
            <p className="leading-loose text-gray-600 dark:text-gray-400">
              Tell your friends you reached your goals and show your NFTs! You can view all NFTs here or on opensea.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

Homepage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Homepage;
