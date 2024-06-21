import { routes } from '@/router';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';

export const config = [
  {
    title: 'Home',
    link: routes.root,
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
    <div className="flex items-center gap-6">
      {config.map((link) => (
        <NavLink to={link.link} key={link.title}>
          <Button variant={pathname === link.link ? 'default' : 'outline'} className="rounded-[32px] w-[120px] py-3">
            {link.title}
          </Button>
        </NavLink>
      ))}
    </div>
  );
};
