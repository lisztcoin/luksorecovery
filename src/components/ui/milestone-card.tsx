import Image from '@/components/ui/image';
import cn from 'classnames';
import { StaticImageData } from 'next/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import Avatar from '@/components/ui/avatar';
import CheerImage from '@/assets/images/nft/cheer.png';
import CheckinImage from '@/assets/images/nft/checkin.png';
import GoalImage from '@/assets/images/nft/goal.png';
import { MILESTONE_CONTRACT } from '@/config/constants';

type ItemType = {
  id: number;
  type: string;
  name: string;
  slug: string;
  title: string;
  cover_image: StaticImageData;
  image?: StaticImageData;
  number_of_artwork: number;
  user: {
    avatar?: StaticImageData;
    name: string;
    slug: string;
  };
};
type CardProps = {
  item: ItemType;
  className?: string;
};

export default function MilestoneCard({ item, className = '' }: CardProps) {
  const { id, type, name, slug, title, cover_image, image, number_of_artwork, user } =
    item ?? {};
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg transition-transform hover:-translate-y-1',
        className
      )}
    >
      <a href={'https://testnets.opensea.io/assets/mumbai/' + MILESTONE_CONTRACT + '/' + id}>
        <div className="relative flex aspect-[8/11] w-full justify-center overflow-hidden rounded-lg">
          <Image
            src={type == "cheer" ? CheerImage : (type == "checkin" ? CheckinImage : GoalImage)}
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
            <h2 className="mb-1.5 truncate text-lg font-medium -tracking-wider text-white">
              {type == "cheer" ? "NFT for Cheers" : (type == "checkin" ? "NFT for Checkin" : "NFT for Achieving Goals")}
            </h2>
            <div className="text-sm font-medium -tracking-wide text-[#B6AAA2]">
              Click to view on Opensea for NFT #{id}
            </div>
          </div>
        </div>
      </a>
    </div >
  );
}
