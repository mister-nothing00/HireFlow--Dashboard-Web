import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase-server';
import ChatListClient from '@/components/ChatListClient';
import { SkeletonChatList } from '@/components/ui/Skeletons';

export const dynamic = 'force-dynamic';

async function ChatListContent() {
  const { user, company, supabase } = await getServerSession();
  if (!user || !company) redirect('/login');

  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      candidate:candidates(id, first_name, last_name, headline, avatar_url),
      job:jobs(id, title)
    `)
    .eq('company_id', company.id)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  return <ChatListClient company={company} initialMatches={matches || []} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<SkeletonChatList />}>
      <ChatListContent />
    </Suspense>
  );
}