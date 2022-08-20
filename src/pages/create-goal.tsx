import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/_dashboard';
import { RadioGroup } from '@/components/ui/radio-group';
import { Listbox } from '@/components/ui/listbox';
import Image from '@/components/ui/image';
import Button from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Uploader from '@/components/ui/forms/uploader';
import InputLabel from '@/components/ui/input-label';
import { Contract, utils } from "ethers";
import { GOAL_CONTRACT } from '@/config/constants';
import GOAL_ABI from '@/abis/goal.json'
import { WalletContext } from '@/lib/hooks/use-connect';
import { useContext, useState, useEffect } from 'react';


const CreateGoalPage: NextPageWithLayout = () => {

	const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);

	const createGoal = () => {
		console.log('here');
		if (!!address && !!provider) {
			const goal_contract = new Contract(GOAL_CONTRACT, GOAL_ABI, provider.getSigner(address));

			let nameInput = document.getElementById("goalNameInput");
			let name = ""
			if (nameInput != null) {
				name = (nameInput as HTMLInputElement).value;
			}

			let desc = (document.getElementById("goalDescriptionInput")! as HTMLInputElement).value;
			if (name === "") {
				alert("name must be filled.");
				return;
			}

			goal_contract.createGoal(name, desc).then(
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
		<>
			<div className="mx-auto w-full px-4 pt-8 pb-14 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
				<h2 className="mb-6 text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-10 sm:text-2xl">
					Create New Goal
				</h2>

				{/* Name */}
				<div className="mb-8">
					<InputLabel title="Name" important />
					<Input type="text" placeholder="Goal name" id='goalNameInput' />
				</div>

				{/* Description */}
				<div className="mb-8">
					<InputLabel
						title="Description"
						important
					/>
					<Textarea placeholder="Provide a detailed description of your goal" id='goalDescriptionInput' />
				</div>

				<Button shape="rounded" onClick={createGoal}>CREATE</Button>
			</div>
		</>
	);
};

CreateGoalPage.getLayout = function getLayout(page) {
	return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreateGoalPage;
