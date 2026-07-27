const FilterChips = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const active = value === opt.id;
      return (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer ${
            active
              ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
              : 'border border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50'
          }`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

export default FilterChips;
