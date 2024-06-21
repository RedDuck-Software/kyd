import { ConnectWallet } from '../wallet/connect-wallet-button';
import { Links } from './links';
import { NavLink } from 'react-router-dom';
import { routes } from '@/router';

export const HeaderDesktop = () => {
  return (
    <div className="grid grid-cols-3 items-center py-5 w-full">
      <div>
        <NavLink to={routes.root} className="flex items-center justify-start gap-3 text-lg font-semibold">
          KYD
        </NavLink>
      </div>
      <Links />
      <div className="flex justify-end">
        <ConnectWallet className="h-[42px]" />
      </div>
    </div>
  );
};
