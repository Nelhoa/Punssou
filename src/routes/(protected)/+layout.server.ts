import { getCompletedProfile } from '$lib/utils/Auth/is-user-registered.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const session = await locals.getSession();
	if (!session) redirect(303, '/auth/sign-in');
	const profile = await getCompletedProfile(locals.supabase, session.safeUser.id);
	if (!profile) redirect(303, '/auth/register');
	return { profile };
}
