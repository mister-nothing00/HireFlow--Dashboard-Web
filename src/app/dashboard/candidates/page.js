import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase-server';
import CandidatesClient from '@/components/CandidatesClient';
import { SkeletonCandidates } from '@/components/ui/Skeletons';

export const dynamic = 'force-dynamic';

async function CandidatesContent() {
  const { user, company, supabase } = await getServerSession();
  if (!user || !company) redirect('/login');

  // Candidati non ancora swipati da questa company
  const { data: swipedIds } = await supabase
    .from('company_swipes')
    .select('candidate_id')
    .eq('company_id', company.id);

  const excludeIds = swipedIds?.map(s => s.candidate_id) || [];

  let query = supabase
    .from('candidates')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(20);

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  const { data: candidates } = await query;

  return (
    <CandidatesClient
      company={company}
      initialCandidates={candidates || []}
    />
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<SkeletonCandidates />}>
      <CandidatesContent />
    </Suspense>
  );
}