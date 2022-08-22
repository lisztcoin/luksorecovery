import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import routes from '@/config/routes';
import DashboardLayout from '@/layouts/_dashboard';
import Button from '@/components/ui/button';
import ActiveLink from '@/components/ui/links/active-link';
import AnchorLink from '@/components/ui/links/anchor-link';
import { RangeIcon } from '@/components/icons/range-icon';
import { ExportIcon } from '@/components/icons/export-icon';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
// dynamic import
const Listbox = dynamic(() => import('@/components/ui/list-box'));

function SetupRecoveryNavLink({ title, isActive, className }: any) {
  return (
    <ActiveLink
      href=''
      className={cn(
        'relative z-[1] inline-flex items-center py-1.5 px-3',
        className
      )}
      activeClassName="font-medium text-white"
      isActive={isActive}
    >
      <span>{title}</span>
      {isActive && (
        <motion.span
          className="absolute left-0 right-0 bottom-0 -z-[1] h-full w-full rounded-lg bg-brand shadow-large"
          layoutId="activeNavLinkIndicator"
        />
      )}
    </ActiveLink>
  );
}

type CarouselMenuProps = {
  carouselMenu: any[];
  children: boolean | React.ReactChild | React.ReactChild[];
};

export default function CarouselMenu({ carouselMenu, children }: CarouselMenuProps) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const currentPath = carouselMenu.findIndex(
    (item) => item.value === router.pathname
  );
  let [selectedMenuItem, setSelectedMenuItem] = useState(carouselMenu[0]);
  function handleRouteOnSelect(path: string) {
    router.push(path);
  }
  useEffect(() => {
    setSelectedMenuItem(carouselMenu[currentPath]);
  }, [currentPath]);
  return (
    <div className="pt-8 text-sm xl:pt-10">
      <div className="mx-auto w-full max-w-lg rounded-lg bg-white p-5 pt-4 shadow-card dark:bg-light-dark xs:p-6 xs:pt-5">
        <nav className="mb-5 min-h-[40px] border-b border-dashed border-gray-200 pb-4 uppercase tracking-wider dark:border-gray-700 xs:mb-6 xs:pb-5 xs:tracking-wide">
          {isMounted && ['xs'].indexOf(breakpoint) !== -1 && (
            <Listbox
              options={carouselMenu}
              selectedOption={selectedMenuItem}
              onChange={setSelectedMenuItem}
              onSelect={(path) => handleRouteOnSelect(path)}
              className="w-full"
            >
            </Listbox>
          )}
          <div className="hidden items-center justify-between text-gray-600 dark:text-gray-400 sm:flex">
            {carouselMenu.map((item) => item.visibility && (
              <SetupRecoveryNavLink
                key={item.name}
                title={item.name}
                isActive={item.selected}
              />
            ))}
          </div>
        </nav>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            initial="exit"
            animate="enter"
            exit="exit"
            variants={fadeInBottom('easeIn', 0.25)}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
