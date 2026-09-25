import { formatPrice } from '../../lib/constants';

const SIZE_CLASSES = {
  card: 'text-lg',
  dialog: 'text-xl',
};

/* Shared price/"Free" rendering for listing cards and the details dialog. */
const PriceTag = ({ price, isLend, size = 'card', as, className = '' }) => {
  const Tag = as || 'span';
  const amount = Number(price) || 0;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.card;

  if (amount > 0) {
    return (
      <Tag className={`serif-accent shrink-0 ${sizeClass} text-primary-500 ${className}`}>
        ₹{formatPrice(amount)}
      </Tag>
    );
  }
  if (!isLend) return null;
  return <Tag className={`serif-accent shrink-0 ${sizeClass} text-emerald-600 ${className}`}>Free</Tag>;
};

export default PriceTag;
