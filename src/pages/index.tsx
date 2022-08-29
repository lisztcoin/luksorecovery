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
            className="flex cursor-pointer flex-col rounded-lg bg-white p-6 text-center shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:col-span-2 sm:col-auto sm:row-span-2"
          >
            <h3 className="text-left mt-6 mb-2 text-sm font-medium uppercase text-gray-800 dark:text-gray-100 sm:text-base 3xl:text-lg">
              Step 1: Setup Recovery
            </h3>
            <p className="leading-loose text-gray-600 dark:text-gray-400 text-left">
              You must still have access to your profile to do the social recovery setup. You also need to deploy a LSP 11 contract with your account as the owner and make the necessary permission changes before continuing the process on this website.
            </p>
            <br />
            <p className="leading-loose text-gray-600 dark:text-gray-400 text-left">
              Follow the steps in the Setup Recovery section to finish the setup.
            </p>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            className="flex cursor-pointer flex-col rounded-lg bg-white p-6 text-center shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:col-span-2 sm:col-auto sm:row-span-2"
          >
            <h3 className="text-left mt-6 mb-2 text-sm font-medium uppercase text-gray-800 dark:text-gray-100 sm:text-base 3xl:text-lg">
              Step 2: Vote as a Guardian
            </h3>
            <p className="leading-loose text-gray-600 dark:text-gray-400 text-left">
              You've lost access to your profile?
            </p>
            <br />
            <p className="leading-loose text-gray-600 dark:text-gray-400 text-left">
              No worries. Ask the guardians you have set in the first step to use the website to vote your new profile as the owner of your old profile.
            </p>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            className="flex cursor-pointer flex-col rounded-lg bg-white p-6 text-center shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:col-span-2 sm:col-auto sm:row-span-2"
          >
            <h3 className="text-left mt-6 mb-2 text-sm font-medium uppercase text-gray-800 dark:text-gray-100 sm:text-base 3xl:text-lg">
              Step 3: Recover Account
            </h3>
            <p className="leading-loose text-gray-600 dark:text-gray-400 text-left">
              It's time to celebrate to re-gain access to your profile!
            </p>
            <br />
            <p className="leading-loose text-gray-600 dark:text-gray-400 text-left">
              Login to your new profile that has gained enough vote from your guardians. Simply enter required information to claim your old profile! Cheers!
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
