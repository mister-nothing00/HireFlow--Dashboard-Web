import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/supabase-server";
import JobsClient from "@/components/JobsClient";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const { user, company, supabase } = await getServerSession();
  if (!user || !company) redirect("/login");

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, _count:company_swipes(count)")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  return <JobsClient company={company} initialJobs={jobs || []} />;
}
