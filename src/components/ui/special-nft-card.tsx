import Image from '@/components/ui/image';
import cn from 'classnames';
import { StaticImageData } from 'next/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import Avatar from '@/components/ui/avatar';
import CheerImage from '@/assets/images/nft/cheer.png';
import CheckinImage from '@/assets/images/nft/checkin.png';
import CatImage from '@/assets/images/nft/cat.jpg';
import TigerImage from '@/assets/images/nft/tiger.jpg';
import { Contract, utils, BigNumber } from "ethers";
import { MILESTONE_CONTRACT, SPECIAL_CONTRACT } from '@/config/constants';
import MILESTONE_ABI from '@/abis/milestone.json'
import SPECIAL_ABI from '@/abis/special.json'
import { WalletContext } from '@/lib/hooks/use-connect';
import { useContext, useState, useEffect } from 'react';

export default function SpecialNFTCard({ item, className = '' }: any) {

  const { address, connectToWallet, disconnectWallet, provider } = useContext(WalletContext);
  let [metadata, setMetadata] = useState<any>();

  useEffect(() => {
    if (!!address && !!provider) {
      const id = utils.formatUnits(item, 0);
      const fetchData = async () => {
        const special_contract = new Contract(SPECIAL_CONTRACT, SPECIAL_ABI, provider.getSigner(address));
        const uri = await special_contract.tokenURI(id);
        const data = await fetch(uri);
        const json = await data.json();
        setMetadata(json);
      }
      fetchData();
    }
  }, [address, provider, item])

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg transition-transform hover:-translate-y-1',
        className
      )}
    >
      <a href={'https://testnets.opensea.io/assets/mumbai/' + SPECIAL_CONTRACT + '/' + item}>
        <div className="relative flex aspect-[8/11] w-full justify-center overflow-hidden rounded-lg">
          <Image
            src={metadata && metadata.name == "The Cat" ? CatImage : TigerImage}
            placeholder="blur"
            layout="fill"
            quality={100}
            objectFit="cover"
          />
        </div>
        <div className="absolute top-0 left-0 z-[5] flex h-full w-full flex-col justify-between bg-gradient-to-t from-black p-5 md:p-6">
          <div className="flex justify-between gap-3">
            <div
              className="inline-flex h-8 shrink-0 items-center rounded-2xl bg-white/20 px-4 text-xs font-medium uppercase -tracking-wide text-white
          backdrop-blur-[40px]"
            >
            </div>
          </div>
          <div className="block">
            <h2 className="mb-1.5 truncate text-base font-medium -tracking-wider text-white">
              Attack: {metadata ? metadata.attributes[1].value : "0"}; Defence: {metadata ? metadata.attributes[2].value : "0"}
            </h2>
            <div className="text-xs font-medium -tracking-wide text-[#B6AAA2]">
              Click to view on Opensea for {metadata && metadata.name} NFT #{utils.formatUnits(item, 0)}
            </div>
          </div>
        </div>
      </a>
    </div >
  );
}
