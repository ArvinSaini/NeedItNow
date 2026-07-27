import { useState } from 'react';
import Navbar from '../components/Navbar';
import PageHeader from '../components/ui/PageHeader';
import RequestsBrowser from '../components/RequestsBrowser';

const AllRequests = () => {
  const [count, setCount] = useState(null);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-10 sm:px-6">
        <PageHeader
          eyebrow="Marketplace"
          title="Browse"
          accent="requests"
          sub={
            count === null
              ? 'What your hostel mates are looking for'
              : `${count} request${count === 1 ? '' : 's'} from your hostel mates`
          }
        />
        <RequestsBrowser onCount={setCount} />
      </main>
    </div>
  );
};

export default AllRequests;
