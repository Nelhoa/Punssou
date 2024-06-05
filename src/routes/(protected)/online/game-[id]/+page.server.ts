import { error } from '@sveltejs/kit';

export async function load({ locals, params }) {
	const { data } = await locals.supabase.from('games').select().eq('id', params.id).maybeSingle();
	if (!data) error(404, 'Partie introuvable !');
	return { game: data };
}
