import { page } from '$app/stores';
import { get } from 'svelte/store';
import { supabase } from '../supabase-client';

export async function signInWithGithub(redirectTo = '') {
	redirectTo = get(page).url.origin + redirectTo;
	supabase().auth.signInWithOAuth({
		provider: 'github',
		options: {
			redirectTo
		}
	});
}
