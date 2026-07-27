import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageHeader from '../components/ui/PageHeader';
import ListingsBrowser from '../components/ListingsBrowser';

const AllListings = () => {
  const [count, setCount] = useState(null);
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-10 sm:px-6">
        <PageHeader
          eyebrow="Marketplace"
          title="Browse"
          accent="listings"
          sub={
            count === null
              ? 'Everything shared across your hostel'
              : `${count} item${count === 1 ? '' : 's'} shared across your hostel right now`
          }
        />
        <ListingsBrowser onCount={setCount} initialCategory={initialCategory} />
      </main>
    </div>
  );
};

export default AllListings;
