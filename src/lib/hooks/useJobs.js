import { useEffect } from 'react';
import { useStore } from '../store';
import { supabase } from '../supabase';

export function useJobs() {
  const { jobs, setJobs, setJobsLoading, addJob, updateJob, deleteJob, company } = useStore();

  useEffect(() => {
    if (!company?.id) return;

    fetchJobs();
    const unsubscribe = subscribeToJobs();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [company?.id]);

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);

      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(name, logo_url)
        `)
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('✅ Jobs loaded:', data?.length || 0);
      setJobs(data || []);
    } catch (error) {
      console.error('❌ Error fetching jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  const subscribeToJobs = () => {
    console.log('🔄 Subscribing to jobs real-time updates...');

    const channel = supabase
      .channel('jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
          filter: `company_id=eq.${company.id}`,
        },
        (payload) => {
          console.log('🔔 Job change event:', payload.eventType, payload);

          if (payload.eventType === 'INSERT') {
            addJob(payload.new);
          } else if (payload.eventType === 'UPDATE') {
            updateJob(payload.new.id, payload.new);
          } else if (payload.eventType === 'DELETE') {
            deleteJob(payload.old.id);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Jobs subscription status:', status);
      });

    return () => {
      console.log('🔴 Unsubscribing from jobs real-time...');
      supabase.removeChannel(channel);
    };
  };

  return { 
    jobs, 
    loading: useStore((state) => state.jobsLoading), 
    refetch: fetchJobs 
  };
}