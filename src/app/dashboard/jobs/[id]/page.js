import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase-server';
import JobDetailClient from '@/components/JobDetailClient';

export const dynamic = 'force-dynamic';

export default async function JobDetailPage({ params }) {
  const jobId = params.id;
  const { user, company, supabase } = await getServerSession();
  if (!user || !company) redirect('/login');

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*, company:companies(name, logo_url, location)')
    .eq('id', jobId)
    .eq('company_id', company.id) // sicurezza ownership
    .single();

  if (error || !job) redirect('/dashboard/jobs');

  return <JobDetailClient job={job} company={company} />;
}
