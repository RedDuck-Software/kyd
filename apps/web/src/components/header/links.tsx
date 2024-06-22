import { routes } from '@/router';
import { NavLink } from 'react-router-dom';
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
  return (
    <div className="flex items-center gap-1">
      {config.map((link) => (
        <NavLink to={link.link} key={link.title}>
          <Button variant="ghost" className="rounded-[8px] w-[120px] py-3">
            {link.title}
          </Button>
        </NavLink>
      ))}
    </div>
  );
};
