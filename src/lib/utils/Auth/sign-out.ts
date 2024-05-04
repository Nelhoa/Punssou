import { supabase } from '../supabase-client';

export function signOut() {
	supabase().auth.signOut();
}
