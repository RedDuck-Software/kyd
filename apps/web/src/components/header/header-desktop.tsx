import { ConnectWallet } from '../wallet/connect-wallet-button';
import { Links } from './links';
import { NavLink } from 'react-router-dom';
import { routes } from '@/router';

export const HeaderDesktop = () => {
  return (
    <div className="grid grid-cols-3 items-center py-5 w-full">
      <NavLink to={routes.root} className="flex items-center gap-3">
        <div className="text-[18px] font-semibold">KYD</div>
      </NavLink>
      <Links />
      <div className="flex justify-end">
        <ConnectWallet className="h-[46px]" />
      </div>
    </div>
  );
};
