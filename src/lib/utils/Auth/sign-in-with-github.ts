import { supabase } from '../supabase-client';

export async function signInWithGithub() {
	supabase().auth.signInWithOAuth({
		provider: 'github',
		options: {
			redirectTo: 'http://localhost:5173/'
		}
	});
}
