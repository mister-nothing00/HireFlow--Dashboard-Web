// SERVER COMPONENT – fetch iniziale SSR
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase-server';
import ChatDetailClient from '@/components/ChatDetailClient';

export const dynamic = 'force-dynamic';

export default async function ChatDetailPage({ params }) {
  const matchId = params.id;
  const { user, company, supabase } = await getServerSession();
  if (!user || !company) redirect('/login');

  // Fetch match + messaggi server-side
  const [matchRes, messagesRes] = await Promise.all([
    supabase
      .from('matches')
      .select(`
        *,
        candidate:candidates(id, first_name, last_name, headline, avatar_url),
        job:jobs(id, title, location)
      `)
      .eq('id', matchId)
      .eq('company_id', company.id) // sicurezza: solo match della tua company
      .single(),

    supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true }),
  ]);

  if (matchRes.error || !matchRes.data) redirect('/dashboard/chat');

  return (
    <ChatDetailClient
      match={matchRes.data}
      initialMessages={messagesRes.data || []}
      company={company}
    />
  );
}