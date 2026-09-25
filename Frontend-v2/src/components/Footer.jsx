import { Link } from 'react-router-dom';
import { LuInstagram, LuLinkedin, LuGithub } from 'react-icons/lu';
import Button from './ui/Button';
import Wordmark from './ui/Wordmark';

const LINK_COLUMNS = [
  {
    heading: 'Marketplace',
    links: [
      { label: 'Browse listings', to: '/listings' },
      { label: 'Browse requests', to: '/requests' },
      { label: 'Post a request', to: '/dashboard' },
      { label: 'Add a listing', to: '/dashboard' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Log in', to: '/login' },
      { label: 'Sign up', to: '/signup' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'About us', to: '/aboutus' },
      { label: 'How it works', href: '/#how-it-works' },
    ],
  },
];

const SOCIALS = [
  { label: 'Instagram', icon: LuInstagram, href: 'https://instagram.com' },
  { label: 'LinkedIn', icon: LuLinkedin, href: 'https://linkedin.com' },
  { label: 'GitHub', icon: LuGithub, href: 'https://github.com' },
];

const Footer = () => (
  <footer className="overflow-hidden bg-[#241d18] px-6 pt-0 text-[#b8b1a6]">
    {/* Top CTA strip */}
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 border-b border-[#3a322b] py-8 sm:flex-row">
      <div className="text-center sm:text-left">
        <h4 className="text-xl font-bold tracking-tight text-white">
          Need something <span className="serif-accent text-cream-200">right now</span>?
        </h4>
        <p className="mt-1 text-sm text-[#9c948a]">Post a request and let your hostel mates come to you.</p>
      </div>
      <Button as={Link} to="/dashboard" variant="primary" size="md">
        Post a request
      </Button>
    </div>

    {/* Link columns */}
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 pt-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div className="col-span-2 md:col-span-1">
        <Wordmark variant="dark" />
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#9c948a]">
          Borrow, lend, buy and sell within your hostel community. No strangers, no shipping.
        </p>
        <div className="mt-5 flex gap-2.5">
          {SOCIALS.map((social) => {
            const Icon = social.icon;
            return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#453b32] text-[#b8b1a6] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </a>
            );
          })}
        </div>
      </div>
      {LINK_COLUMNS.map((col) => (
        <div key={col.heading}>
          <h5 className="mb-4 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#8a8277]">
            {col.heading}
          </h5>
          <ul className="space-y-2.5 text-sm">
            {col.links.map((link) => (
              <li key={link.label}>
                {link.href ? (
                  <a href={link.href} className="group flex items-center gap-2 transition-colors hover:text-cream-200">
                    <span className="h-1 w-1 rounded-full bg-primary-500 opacity-70" />
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.to} className="group flex items-center gap-2 transition-colors hover:text-cream-200">
                    <span className="h-1 w-1 rounded-full bg-primary-500 opacity-70" />
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Bottom bar */}
    <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-[#3a322b] pb-1 pt-4 text-xs text-[#847c71] sm:flex-row">
      <span>© {new Date().getFullYear()} NeedItNow. All rights reserved.</span>
      <span className="serif-accent text-sm text-[#a89f92]">
        Made with <span className="not-italic text-primary-500">♥</span> for students.
      </span>
    </div>

    {/* Giant wordmark */}
    <div
      aria-hidden="true"
      className="brand-gradient-text mx-auto -mb-[0.08em] mt-5 select-none whitespace-nowrap text-center text-[clamp(4rem,14.5vw,12.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em]"
    >
      Need<span className="serif-accent tracking-[-0.02em]">It</span>Now
    </div>
  </footer>
);

export default Footer;
