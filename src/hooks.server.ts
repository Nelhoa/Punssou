import { SUPABASE_JWT_SECRET } from '$env/static/private';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { SafeSession } from '$lib/utils/types';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			/**
			 * Note: You have to add the `path` variable to the
			 * set and remove method due to sveltekit's cookie API
			 * requiring this to be set, setting the path to an empty string
			 * will replicate previous/standard behaviour (https://kit.svelte.dev/docs/types#public-types-cookies)
			 */
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		let newSession: SafeSession | undefined = undefined;
		try {
			if (session) {
				const decoded_session = jwt.verify(session.access_token, SUPABASE_JWT_SECRET);
				newSession = safeSessionSchema.parse({ session, decoded_session });
			}
		} catch (err) {
			console.error('getSessionError', err);
			return null;
		}

		return newSession as SafeSession;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

const safeSessionSchema = z
	.object({
		session: z.object({
			access_token: z.string(),
			token_type: z.string(),
			expires_in: z.number(),
			expires_at: z.number().optional(),
			refresh_token: z.string()
		}),
		decoded_session: z.object({
			aud: z.string(),
			exp: z.number(),
			iat: z.number(),
			iss: z.string(),
			sub: z.string(),
			email: z.string().optional(),
			phone: z.string().optional(),
			app_metadata: z.object({ provider: z.string(), providers: z.array(z.any()) }),
			user_metadata: z.record(z.any()),
			role: z.string().optional(),
			aal: z.string(),
			amr: z.array(z.any()),
			session_id: z.string(),
			is_anonymous: z.boolean().optional()
		})
	})
	.transform((original) => {
		const newSession: SafeSession = {
			access_token: original.session.access_token,
			token_type: original.session.token_type,
			expires_in: original.session.expires_in,
			expires_at: original.session.expires_at,
			refresh_token: original.session.refresh_token,
			safeUser: {
				id: original.decoded_session.sub,
				aud: original.decoded_session.aud,
				role: original.decoded_session.role,
				email: original.decoded_session.email,
				phone: original.decoded_session.phone,
				app_metadata: original.decoded_session.app_metadata,
				user_metadata: original.decoded_session.user_metadata,
				is_anonymous: original.decoded_session.is_anonymous,
				created_at: ''
			}
		};
		return newSession;
	});
