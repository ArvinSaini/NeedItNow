// eslint-disable-next-line no-unused-vars
import { m } from 'framer-motion';
import { LuInstagram, LuLinkedin, LuGithub } from 'react-icons/lu';
import Navbar from '../components/Navbar';
import arvinPhoto from '../assets/arvin.jpg';

const SOCIALS = [
  { label: 'Instagram', icon: LuInstagram, href: 'https://www.instagram.com/arvinsaini23/' },
  { label: 'LinkedIn', icon: LuLinkedin, href: 'https://www.linkedin.com/in/ArvinSaini/' },
  { label: 'GitHub', icon: LuGithub, href: 'https://github.com/ArvinSaini' },
];

const Aboutus = () => (
  <div className="flex min-h-screen flex-col bg-white">
    <Navbar />
    <main className="auth-glow flex flex-1 flex-col items-center px-4 py-16">
      <div className="eyebrow">About</div>
      <h1 className="mt-2 text-center text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
        Made with <span className="serif-accent text-primary-500">passion</span>.
      </h1>
      <p className="mt-3 max-w-md text-center text-ink-600">
        NeedItNow is built by a hostel student, for hostel students.
      </p>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-10 w-full max-w-sm overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-xl shadow-ink-900/10"
      >
        <img src={arvinPhoto} alt="Arvin Saini" className="h-auto w-full" />
        <div className="p-7 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">Arvin Saini</h2>
          <p className="serif-accent mt-1 text-primary-500">Creator of NeedItNow</p>
          <div className="mt-5 flex justify-center gap-3">
            {SOCIALS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-500 hover:bg-primary-500 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </m.div>

      <p className="mt-8 text-sm text-ink-400">Connect with me on social media!</p>
    </main>
  </div>
);

export default Aboutus;
