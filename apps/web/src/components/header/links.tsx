import { routes } from '@/router';
import { NavLink, useLocation } from 'react-router-dom';

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
    <div className="flex items-center justify-center gap-6">
      {config.map((link) => (
        <NavLink to={link.link} className={`${pathname === link.link ? 'underline' : ''}`} key={link.title}>
          {link.title}
        </NavLink>
      ))}
    </div>
  );
};
