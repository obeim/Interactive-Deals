import DealsTable from '@/components/DealsTable';
import { dealsData, defaultColumns } from '@/lib/data';

export default function Home() {
  return (
    <div className="h-screen w-full">
      <DealsTable data={dealsData} columns={defaultColumns} />
    </div>
  );
}
