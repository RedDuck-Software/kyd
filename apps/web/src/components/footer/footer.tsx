import { Github } from '../ui/svg/github';
import { Link } from 'react-router-dom';
import { Linkedin } from '../ui/svg/linkedin';
export const Footer = () => {
  return (
    <div className="py-6 bg-[#222222]">
      <div className="max-w-[1375px] flex items-center justify-between mx-auto px-2 sm:px-4">
        <h3 className="text-light text-[32px] font-semibold">KYD</h3>
        <div className="flex gap-3 items-center">
          <Link to={'https://github.com/RedDuck-Software/kyd'} target="_blank" className="group">
            <Github className="transition-all " />
          </Link>
          <Link to={'https://www.linkedin.com/company/redduckdev/mycompany/'} target="_blank" className="group">
            <Linkedin className="transition-all " />
          </Link>
        </div>
      </div>
    </div>
  );
};
