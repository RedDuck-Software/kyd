import { routes } from '@/router';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const config = [
  {
    title: 'Home',
    link: routes.root,
  },
  {
    title: 'Auctions',
    link: routes.auctions,
  },
  {
    title: 'Profile',
    link: routes.profile,
  },
  {
    title: 'Create auction',
    link: routes.create,
  },
];

export const Links = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex items-center justify-center gap-4 flex-1 col-span-2">
      {config.map((link) => (
        <NavLink
          to={link.link}
          key={link.title}
          className={cn(
            'rounded-[8px] py-3 px-2 font-medium uppercase hover:underline',
            link.link.toLowerCase() === pathname.toLowerCase() ? 'underline' : ''
          )}
        >
          {link.title}
        </NavLink>
      ))}
    </div>
  );
};
