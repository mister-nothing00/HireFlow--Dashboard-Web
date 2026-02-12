// ═══════════════════════════════════════════
// src/app/dashboard/jobs/[id]/edit/page.js
// SERVER COMPONENT
// ═══════════════════════════════════════════
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase-server';
import EditJobClient from '../../../../../components/EditJobClient';

export const dynamic = 'force-dynamic';

export default async function EditJobPage({ params }) {
  const jobId = params.id;
  const { user, company, supabase } = await getServerSession();
  if (!user || !company) redirect('/login');

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('company_id', company.id)
    .single();

  if (error || !job) redirect('/dashboard/jobs');

  return <EditJobClient job={job} company={company} />;
}


