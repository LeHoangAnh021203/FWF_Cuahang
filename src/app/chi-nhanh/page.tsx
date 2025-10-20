import { Suspense } from 'react';
import AllBranchesClient from './AllBranchesClient';

export default function AllBranchesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải chi nhánh...</div>}>
      <AllBranchesClient />
    </Suspense>
  );
}
