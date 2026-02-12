import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase-server';
import MatchesClient from '@/components/MatchesClient';
import { SkeletonMatches } from '@/components/ui/Skeletons';

export const dynamic = 'force-dynamic';

async function MatchesContent() {
  const { user, company, supabase } = await getServerSession();
  if (!user || !company) redirect('/login');

  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      candidate:candidates(id, first_name, last_name, headline, avatar_url, location, skills),
      job:jobs(id, title, location)
    `)
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });

  return <MatchesClient company={company} initialMatches={matches || []} />;
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<SkeletonMatches />}>
      <MatchesContent />
    </Suspense>
  );
}