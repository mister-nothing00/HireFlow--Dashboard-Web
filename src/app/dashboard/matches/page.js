import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase-server';
import MatchesClient from '@/components/MatchesClient';

export const dynamic = 'force-dynamic';

export default async function MatchesPage() {
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