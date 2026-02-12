import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/supabase-server";
import JobDetailClient from "@/components/JobDetailClient";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }) {
  const { id: jobId } = await params;

  const { user, company, supabase } = await getServerSession();
  if (!user || !company) redirect("/login");

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("company_id", company.id)
    .single();

  if (!job) redirect("/dashboard/jobs");

  return <JobDetailClient job={job} company={company} />;
}
