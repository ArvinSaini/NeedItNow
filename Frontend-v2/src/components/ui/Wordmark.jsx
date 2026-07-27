import { Link } from 'react-router-dom';

/**
 * Brand wordmark: "N" tile + NeedItNow.
 * variant "onGradient" — white tile with red N, white text (gradient navbar, red sidebar)
 * variant "dark"       — gradient tile, white text (dark footer)
 * variant "light"      — gradient tile, dark text (light surfaces, auth cards)
 */
const VARIANTS = {
  onGradient: { tile: 'bg-white text-primary-500 shadow-md shadow-primary-900/25', text: 'text-white' },
  dark: { tile: 'brand-gradient text-white', text: 'text-white' },
  light: { tile: 'brand-gradient text-white shadow-md shadow-primary-500/25', text: 'text-ink-900' },
};

const Wordmark = ({ variant = 'light', size = 'md', to = '/', showText = true }) => {
  const v = VARIANTS[variant] || VARIANTS.light;
  const tileSize = size === 'lg' ? 'h-11 w-11 rounded-xl text-2xl' : 'h-9 w-9 rounded-[11px] text-lg';
  const textSize = size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <Link to={to} className="inline-flex items-center gap-2.5">
      <span className={`flex items-center justify-center font-extrabold ${v.tile} ${tileSize}`}>N</span>
      {showText && <span className={`font-bold tracking-tight ${v.text} ${textSize}`}>NeedItNow</span>}
    </Link>
  );
};

export default Wordmark;
