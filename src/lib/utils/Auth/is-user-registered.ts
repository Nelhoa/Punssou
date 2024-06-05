import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types-supabase';

type profileRow = Database['public']['Tables']['profiles']['Row'];

export async function getCompletedProfile(supabase: SupabaseClient<Database>, user_id: string) {
	const { data: profile } = await supabase
		.from('profiles')
		.select()
		.eq('user_id', user_id)
		.maybeSingle()
		.throwOnError();
	if (!profile) return null;
	const { pseudo } = profile;
	if (!pseudo) return null;
	return { user_id, pseudo } satisfies profileRow;
}
