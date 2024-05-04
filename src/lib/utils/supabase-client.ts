import { page } from '$app/stores';
import { get } from 'svelte/store';

export function supabase() {
	const supabase = get(page).data.supabase;
	console.log({ supabase });
	return supabase;
}
