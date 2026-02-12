import { Suspense } from 'react';
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/supabase-server";
import JobsClient from "@/components/JobsClient";
import { SkeletonJobsList } from '@/components/ui/Skeletons';

export const dynamic = "force-dynamic";

async function JobsContent() {
  const { user, company, supabase } = await getServerSession();
  if (!user || !company) redirect("/login");

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  return <JobsClient company={company} initialJobs={jobs || []} />;
}

export default function JobsPage() {
  return (
    <Suspense fallback={<SkeletonJobsList />}>
      <JobsContent />
    </Suspense>
  );
}