import { NavLink } from 'react-router-dom';
import { ConnectWallet } from '../wallet/connect-wallet-button';
import { Links } from './links';
import { routes } from '@/router';

export const Header = () => {
  return (
    <div className="flex items-center py-5 w-full justify-between">
      <NavLink to={routes.root} className="flex items-center gap-3">
        <img src="" alt="KYD" />
        <div className="text-[18px] font-semibold">KYD</div>
      </NavLink>
      <Links />
      <ConnectWallet />
    </div>
  );
};
