import { ConnectWallet } from '../wallet/connect-wallet-button';
import { Links } from './links';
import { NavLink } from 'react-router-dom';
import { routes } from '@/router';
import { Logo } from '../ui/svg/logo';

export const HeaderDesktop = () => {
  return (
    <div className="grid grid-cols-4 items-center py-2 w-full">
      <div className="w-20">
        <NavLink to={routes.root}>
          <Logo className="w-20 h-20" />
        </NavLink>
      </div>
      <Links />
      <div className="flex justify-end">
        <ConnectWallet className="py-2 !rounded-xl" />
      </div>
    </div>
  );
};
