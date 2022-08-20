import SingleNft from '@/assets/images/single-nft.jpg';

import Bitcoin from '@/assets/images/currency/bitcoin.svg';
import Ethereum from '@/assets/images/currency/ethereum.svg';
import Avatar1 from '@/assets/images/avatar/1.png';
import Avatar2 from '@/assets/images/avatar/2.png';
import Avatar3 from '@/assets/images/avatar/3.png';
import Avatar4 from '@/assets/images/avatar/4.png';
import Avatar5 from '@/assets/images/avatar/5.png';
import Avatar6 from '@/assets/images/avatar/6.png';
import Avatar7 from '@/assets/images/avatar/7.png';
import CatTiger from '@/assets/images/nft/cattiger.png';

export const nftData = {
  isAuction: true,
  name: 'Cat vs. Tiger',
  image: CatTiger,
  minted_date: 'Jan 26, 2022',
  minted_slug: 'https://etherscan.io/',
  price: 0.2,
  description:
    'Spend some coins to buy a cat, or a tiger with random attack and defence numbers to reward your great progress on your goals. Use your newly minted NFT to battle with other people!',
  creator: { id: 1, logo: Avatar1, name: 'Goal Keeper NFT', slug: '#' },
  collection: { id: 1, logo: Avatar1, name: 'Goal Keeper NFT', slug: '#' },
  owner: { id: 1, logo: Avatar4, name: '@williamson', slug: '#' },
  block_chains: [
    { id: 1, logo: Bitcoin, name: 'Ethereum', slug: '#' },
    { id: 2, logo: Ethereum, name: 'Bitcoin', slug: '#' },
  ],
  bids: [
    {
      id: 1,
      label: 'Cat',
      name: 'Goal Keeper NFT',
      authorSlug: '#',
      created_at: '2022-08-21T17:26:22.000000Z',
      avatar: Avatar1,
      amount: 2,
    },
    {
      id: 2,
      label: 'Tiger',
      name: 'Goal Keeper NFT',
      authorSlug: '#',
      created_at: '2022-08-21T17:26:22.000000Z',
      avatar: Avatar1,
      amount: 5,
    }
  ],
};
