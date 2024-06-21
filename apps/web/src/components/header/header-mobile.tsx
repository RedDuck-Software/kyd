import { Link, NavLink } from 'react-router-dom';
import { routes } from '@/router';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Menu } from '../ui/svg/Menu';
import { ConnectWallet } from '../wallet/connect-wallet-button';

export const HeaderMobile = () => {
  const [active, setActive] = useState(false);
  const [show, setShow] = useState(false);
  const { isConnected } = useAccount();

  const init = (value: boolean) => {
    if (value) {
      setShow(value);
      setTimeout(() => setActive(value), 20);
    } else {
      setActive(value);
      setTimeout(() => setShow(value), 500);
    }
  };

  return (
    <>
      <div className="flex justify-between w-full py-2">
        <NavLink to={routes.root} className="flex items-center gap-3">
          <div className="text-[18px] font-semibold">KYD</div>
        </NavLink>
        <div onClick={() => init(true)} className="flex cursor-pointer items-center lg:hidden">
          <Menu className="min-h-8 min-w-8" />
        </div>
      </div>

      <nav className={'nav-mobile ' + (active ? 'active' : '') + (show ? ' show' : '')}>
        <div onClick={() => init(false)} className="absolute right-[25px] top-[16px] cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M14.0805 12.5019L20.462 6.12029C21.1781 5.40793 21.1781 4.25406 20.4694 3.53798C19.7571 2.82191 18.6032 2.82191 17.8871 3.53056L17.8834 3.53427L11.5019 9.91584L5.11658 3.53798C4.40422 2.82562 3.24663 2.82562 2.53427 3.53798C1.82191 4.25035 1.82191 5.40793 2.53427 6.12029L8.91584 12.5019L2.53427 18.8834C1.82191 19.5958 1.82191 20.7534 2.53427 21.4657C3.24663 22.1781 4.40422 22.1781 5.11658 21.4657L11.4981 15.0842L17.8797 21.4657C18.5921 22.1781 19.7497 22.1781 20.462 21.4657C21.1744 20.7534 21.1744 19.5958 20.462 18.8834L14.0805 12.5019Z"
              fill="white"
            />
          </svg>
        </div>
        <ul>
          <li>
            <Link onClick={() => init(false)} to={`/`}>
              Home
            </Link>
          </li>
          <li>
            <Link onClick={() => init(false)} to={`/profile`}>
              Profile
            </Link>
          </li>
          <li>
            <Link onClick={() => init(false)} to={`/create`}>
              Create auction
            </Link>
          </li>
          <li>
            <ConnectWallet />
          </li>
        </ul>
      </nav>
    </>
  );
};
