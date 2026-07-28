import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { m } from 'framer-motion';
import {
  LuArrowRight,
  LuHandshake,
  LuUsers,
  LuShieldCheck,
} from 'react-icons/lu';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import { apiFetch } from '../lib/api';
import { CATEGORIES } from '../lib/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const FEATURES = [
  {
    icon: LuHandshake,
    tone: 'red',
    title: 'Borrow & lend',
    text: 'Share textbooks, notes and gear with students in your own building.',
  },
  {
    icon: LuUsers,
    tone: 'cream',
    title: 'Community driven',
    text: 'Every listing comes from a hostel mate — a name, room and phone you can knock on.',
  },
  {
    icon: LuShieldCheck,
    tone: 'red',
    title: 'Safe & simple',
    text: 'Trade inside your trusted hostel circle. No strangers, no shipping.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Sign up with your hostel',
    text: "Create an account with your hostel and room number — that's your address on the platform.",
  },
  {
    num: '02',
    title: 'List or request',
    text: 'Put up something to lend or sell, or post a request for what you need right now.',
  },
  {
    num: '03',
    title: 'Meet & trade',
    text: 'Every listing shows a name, room and phone number. Walk over, pick it up, done.',
  },
];

const Home = () => {
  const [counts, setCounts] = useState({ listings: null, requests: null });
  const [categoryCounts, setCategoryCounts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([apiFetch('/product'), apiFetch('/request')]).then(([p, r]) => {
      if (cancelled) return;
      const allListings = p.status === 'fulfilled' ? p.value.listings ?? [] : null;
      const listings = allListings
        ? allListings.filter((l) => String(l.status).toLowerCase() === 'available').length
        : null;
      if (allListings) {
        const perCategory = {};
        allListings.forEach((l) => {
          const id = String(l.category).toLowerCase();
          perCategory[id] = (perCategory[id] || 0) + 1;
        });
        setCategoryCounts(perCategory);
      }
      const allRequests = r.status === 'fulfilled' ? r.value.requests ?? [] : null;
      const requests = allRequests
        ? allRequests.filter((q) => String(q.status).toLowerCase() === 'active').length
        : null;
      setCounts({ listings, requests });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-white">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="hero-wash border-b border-ink-200">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:py-20">
          <m.div initial="hidden" animate="visible" variants={stagger}>
            <m.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-cream-100 px-4 py-1.5 text-xs font-semibold text-cream-800"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-500" />
              Made for hostel students
            </m.span>

            <m.h1
              variants={fadeUp}
              className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-6xl"
            >
              Your hostel&apos;s
              <span className="serif-accent block text-primary-500">sharing hub.</span>
            </m.h1>

            <m.p variants={fadeUp} className="mt-4 max-w-lg text-lg text-ink-600">
              Borrow, lend, buy and sell within your hostel community. Textbooks, kettles, cycles —
              someone next door already has it.
            </m.p>

            <m.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
              <Button as={Link} to="/signup" variant="primary" size="lg">
                Get started free
                <LuArrowRight className="h-4 w-4" />
              </Button>
              <Button as={Link} to="/listings" variant="ghost" size="lg">
                Browse items
              </Button>
            </m.div>

            <m.div variants={fadeUp} className="mt-9 flex items-end gap-7">
              <div>
                <div className="font-serif text-2xl leading-tight text-ink-900">100+</div>
                <div className="text-xs text-ink-400">students</div>
              </div>
              <div>
                <div className="font-serif text-2xl leading-tight tabular-nums text-ink-900">
                  {counts.listings ?? '—'}
                </div>
                <div className="text-xs text-ink-400">active listings</div>
              </div>
              <div>
                <div className="font-serif text-2xl leading-tight tabular-nums text-ink-900">
                  {counts.requests ?? '—'}
                </div>
                <div className="text-xs text-ink-400">active requests</div>
              </div>
            </m.div>
          </m.div>

          {/* Category mini-cards */}
          <m.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            {/* soft glow behind the panel */}
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_30%_20%,rgba(249,231,178,0.6),transparent_70%),radial-gradient(50%_50%_at_80%_85%,rgba(211,78,78,0.12),transparent_70%)]" />

            {/* framed panel */}
            <div className="relative rounded-3xl border border-cream-300 bg-white/70 p-5 pb-4 shadow-xl shadow-ink-900/10 backdrop-blur-sm">
              {/* floating live chip — real count from the API */}
              {counts.listings !== null && (
                <span className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-900 shadow-md shadow-ink-900/10">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {counts.listings} item{counts.listings === 1 ? '' : 's'} live
                </span>
              )}

              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.slice(0, 4).map((cat, i) => {
                  const count = categoryCounts?.[cat.id] ?? null;
                  return (
                    <Link
                      key={cat.id}
                      to={`/listings?category=${cat.id}`}
                      className={`group flex items-center gap-3.5 rounded-2xl border border-ink-200 bg-white p-4.5 shadow-md shadow-ink-900/5 transition-all duration-200 hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/10 ${
                        i % 2 === 1 ? 'translate-y-3' : ''
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl transition-colors duration-200 ${
                          i % 2 === 1
                            ? 'bg-primary-50 text-primary-500 group-hover:bg-primary-500 group-hover:text-white'
                            : 'bg-cream-100 text-primary-700 group-hover:bg-primary-500 group-hover:text-white'
                        }`}
                      >
                        <cat.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ink-900">{cat.label}</span>
                        <span className="block text-xs text-ink-400">
                          {count === null ? 'Browse items' : count === 0 ? 'No items yet' : `${count} item${count === 1 ? '' : 's'}`}
                        </span>
                      </span>
                      <LuArrowRight className="h-4 w-4 flex-none text-ink-300 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary-500 group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-dashed border-ink-200 pt-3.5">
                <span className="serif-accent text-sm text-ink-400">What do you need today?</span>
                <Link
                  to="/listings"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  Browse all
                  <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </m.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="mx-auto max-w-6xl px-4 pt-16 text-center sm:px-6">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
        >
          <m.div variants={fadeUp} className="eyebrow">
            Why NeedItNow
          </m.div>
          <m.h2
            variants={fadeUp}
            className="mt-2 text-4xl font-extrabold tracking-tight text-ink-900"
          >
            Built for <span className="serif-accent text-primary-500">hostel life</span>.
          </m.h2>
          <m.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-ink-600">
            The simplest way to share, trade and connect with your hostel community.
          </m.p>

          <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
            {FEATURES.map((feature) => {
              const { icon: Icon, tone, title, text } = feature;
              return (
              <m.div
                key={title}
                variants={fadeUp}
                className="rounded-2xl border border-ink-200 bg-white p-7 shadow-md shadow-ink-900/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-900/10"
              >
                <span
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    tone === 'red' ? 'bg-primary-50 text-primary-500' : 'bg-cream-100 text-primary-700'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-ink-900">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-600">{text}</p>
              </m.div>
              );
            })}
          </div>
        </m.div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-16 text-center sm:px-6">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
        >
          <m.div variants={fadeUp} className="eyebrow">
            How it works
          </m.div>
          <m.h2
            variants={fadeUp}
            className="mt-2 text-4xl font-extrabold tracking-tight text-ink-900"
          >
            Three steps, <span className="serif-accent text-primary-500">that&apos;s it</span>.
          </m.h2>
          <m.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-ink-600">
            From signing up to knocking on a door — the whole thing takes minutes.
          </m.p>

          <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
            {STEPS.map((step, i) => (
              <m.div
                key={step.num}
                variants={fadeUp}
                className="relative rounded-2xl border border-cream-300 bg-cream-50 p-7"
              >
                <span className="serif-accent block text-4xl text-primary-500">{step.num}</span>
                <h3 className="mt-3 text-lg font-bold text-ink-900">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600">{step.text}</p>
                {i < STEPS.length - 1 && (
                  <span className="absolute -right-3.5 top-8 z-10 hidden h-7 w-7 items-center justify-center rounded-full border border-ink-200 bg-white text-primary-500 shadow-sm md:flex">
                    <LuArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </m.div>
            ))}
          </div>
        </m.div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="brand-gradient relative overflow-hidden rounded-3xl px-8 py-14 text-center text-white"
        >
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="eyebrow relative !text-white/75">Start in minutes</div>
          <h3 className="relative mt-3 text-4xl font-extrabold tracking-tight [text-shadow:0_1px_3px_rgba(100,30,20,0.2)]">
            Ready to <span className="serif-accent">get started</span>?
          </h3>
          <p className="relative mx-auto mt-3 max-w-lg text-white/95">
            Join your hostel community today — list something you&apos;re not using, or find what you
            need.
          </p>
          <div className="relative mt-7 flex justify-center">
            <Button as={Link} to="/signup" variant="cream" size="lg">
              Create free account
              <LuArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </m.div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
