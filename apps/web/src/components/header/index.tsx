import { useMediaQuery } from '@/hooks/useMediaQuery';
import { HeaderDesktop } from './header-desktop';
import { HeaderMobile } from './header-mobile';

export const Header = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  return isMobile ? <HeaderMobile /> : <HeaderDesktop />;
};
