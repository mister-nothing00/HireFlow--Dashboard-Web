import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/supabase-server";
import EditJobClient from "@/components/EditJobClient";

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }) {
  // ✅ FIX: await params
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

  return <EditJobClient job={job} company={company} />;
}
