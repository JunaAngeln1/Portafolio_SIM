import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a real-time subscription for a Supabase table.
 * @param supabaseClient - The Supabase client instance.
 * @param tableName - The name of the table to subscribe to.
 * @param normalize - Function to normalize a row from the database to the app type.
 * @param setState - State setter function to update the state with the normalized data.
 * @returns A function to unsubscribe from the subscription.
 */
export function createRealTimeSubscription(
  supabaseClient: SupabaseClient,
  tableName: string,
  normalize: (row: any) => any,
  setState: React.Dispatch<React.SetStateAction<any[]>>
) {
  const channel = supabaseClient
    .channel(`${tableName}-changes`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: tableName }, 
      payload => {
        const normalized = normalize(payload.new);

        if (payload.eventType === 'INSERT') {
          setState(prev => [...prev, normalized]);
        } else if (payload.eventType === 'UPDATE') {
          setState(prev => prev.map(item => 
            item.id === normalized.id ? normalized : item
          ));
        } else if (payload.eventType === 'DELETE') {
          setState(prev => prev.filter(item => item.id !== payload.old.id));
        }
      }
    )
    .subscribe();

  return () => {
    supabaseClient.removeChannel(channel);
  };
}