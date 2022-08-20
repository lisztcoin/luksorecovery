import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import ListCard from '@/components/ui/list-card';
import TransactionSearchForm from '@/components/author/transaction-search-form';
import TransactionHistory from '@/components/author/transaction-history';
import MilestoneCard from '@/components/ui/milestone-card';
// static data
import { collections } from '@/data/static/collections';
import { Contract, utils, BigNumber } from "ethers";
import { MILESTONE_CONTRACT, SPECIAL_CONTRACT } from '@/config/constants';
import MILESTONE_ABI from '@/abis/milestone.json'
import SPECIAL_ABI from '@/abis/special.json'
import SpecialNFTCard from '../ui/special-nft-card';
import { WalletContext } from '@/lib/hooks/use-connect';
import { useContext, useState, useEffect } from 'react';

export default function CollectionTab() {
  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);

  let [milestoneNfts, setMilestoneNfts] = useState<any[]>([]);
  let [specialNfts, setSpecialNfts] = useState<any[]>([]);
  let [checkinNFTClaimed, setCheckinNFTClaimed] = useState(0);
  let [cheerNFTClaimed, setCheerNFTClaimed] = useState(0);
  let [goalNFTClaimed, setGoalNFTClaimed] = useState<any[]>([]);

  useEffect(() => {
    setMilestoneNfts([]);
    if (cheerNFTClaimed) {
      setMilestoneNfts((old) => [...old, { id: cheerNFTClaimed, type: "cheer" }]);
    }
    if (checkinNFTClaimed) {
      setMilestoneNfts((old) => [...old, { id: checkinNFTClaimed, type: "checkin" }]);
    }
    for (const g of goalNFTClaimed) {
      setMilestoneNfts((old) => [...old, { id: utils.formatUnits(g, 0), type: "goal" }]);
    }
  }, [checkinNFTClaimed, cheerNFTClaimed, goalNFTClaimed])

  useEffect(() => {
    if (!!address && !!provider) {

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

      milestone_contract.getAllGoalTokensFromAddress(address).then(
        (result: any) => {
          setGoalNFTClaimed(result);
        }
      )

      const special_contract = new Contract(SPECIAL_CONTRACT, SPECIAL_ABI, provider.getSigner(address));

      special_contract.getAllSpecialokensFromAddress(address).then(
        (result: any) => {
          setSpecialNfts(result);
        }
      )
    }
  }, [address, provider])

  return (
    <ParamTab
      tabMenu={[
        {
          title: 'Special NFTs ' + specialNfts.length,
          path: 'collection',
        },
        {
          title: 'Milestone NFTs ' + milestoneNfts.length,
          path: 'portfolio',
        },
      ]}
    >
      <TabPanel className="focus:outline-none">
        <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:gap-6 3xl:grid-cols-3 4xl:grid-cols-4">
          {specialNfts.map((nft) => (
            <SpecialNFTCard item={nft} key={nft?.id} />
          ))}
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:gap-6 3xl:grid-cols-3 4xl:grid-cols-4">
          {milestoneNfts.map((nft) => (
            <MilestoneCard item={nft} key={nft.id} />
          ))}
        </div>
      </TabPanel>
    </ParamTab>
  );
}
